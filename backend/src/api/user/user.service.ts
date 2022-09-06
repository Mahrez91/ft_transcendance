import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Readable } from 'stream';
import { Not, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, UpdateUsersAfterGameDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService
{
	@InjectRepository(User)
	private readonly repository: Repository<User>;

	public getUser(id: number): Promise<User>
	{
		return this.repository.findOne(id);
	}

	public getUserByName(name: string): Promise<User>
	{
		return this.repository.findOne({ name: name });
	}

	public getUsers(): Promise<User[]>
	{
		return this.repository.find({ where: { id: Not(1) } });
	}

	public getUsersWithDefault(): Promise<User[]>
	{
		return this.repository.find();
	}

	public createUser(body: CreateUserDto): Promise<User>
	{
		const user: User = new User();

		user.access_token = body.access_token;

		return this.repository.save(user);
	}

	public tmpCreateUser(user: {
		name: string;
		elo?: number;
		xp?: number;
		win?: number;
		lose?: number;
	}): Promise<User>
	{
		const new_user: User = new User();

		new_user.access_token = "tmp_null";

		new_user.name = user.name;

		// profile pic
		if (user.elo)
			new_user.elo = user.elo;
		if (user.xp)
			new_user.xp = user.xp;
		if (user.win)
			new_user.win = user.win;
		if (user.lose)
			new_user.lose = user.lose;

		return this.repository.save(new_user);
	}

	public async updateUser(id: number, updateUserDto: UpdateUserDto)
	{
		const user = await this.repository.findOne(id);

		if (updateUserDto.name)
			user.name = updateUserDto.name;
		if (updateUserDto.xp)
			user.xp += updateUserDto.xp;
		if (updateUserDto.elo)
			user.elo += updateUserDto.elo;
		if (updateUserDto.win)
			user.win += 1;
		if (updateUserDto.lose)
			user.lose += 1;
		if (updateUserDto.friendId)
		{
			if (!user.friendsId)
				user.friendsId = [];
			const i = user.friendsId.indexOf(updateUserDto.friendId);
			if (i > -1)
				user.friendsId.splice(i, 1);
			else
				user.friendsId.push(updateUserDto.friendId);
		}
		if (updateUserDto.mutedId)
		{
			if (!user.mutedId)
				user.mutedId = [];
			const i = user.mutedId.indexOf(updateUserDto.mutedId);
			if (i > -1)
				user.mutedId.splice(i, 1);
			else
				user.mutedId.push(updateUserDto.mutedId);
		}

		return await this.repository.save(user);
	}

	public async chooseUsername(id: number, name: string, res: Response)
	{
		const user = await this.repository.findOne(id);

		if (await this.repository.count({ where: { name: name } }))
			throw new HttpException("username already taken", HttpStatus.CONFLICT);

		user.name = name;

		return await this.repository.save(user);
	}

	public async updateUsersAfterGame(data: UpdateUsersAfterGameDto)
	{
		const winner: User = await this.repository.findOne({ name: data.winner });
		const loser: User = await this.repository.findOne({ name: data.loser });

		winner.win++;
		loser.lose++;

		const K = 42;	// could change it depending on elo:
		// (higher elo, lower number. But usualy only applies over 2000 elo)

		const Sw = data.scoreWinner / (data.scoreWinner + data.scoreLoser);
		const Sl = data.scoreLoser / (data.scoreWinner + data.scoreLoser);
		const Ew = 1 / (1 + Math.pow(10, ((loser.elo - winner.elo) / 400)));
		const El = 1 / (1 + Math.pow(10, ((winner.elo - loser.elo) / 400)));

		winner.elo += Math.ceil(K * (Sw - Ew));
		loser.elo += Math.ceil(K * (Sl - El));

		if (winner.elo > 942)
		{
			winner.xp += data.scoreWinner / 2 * ((winner.elo - 942) / 142) + 1.42;
			loser.xp += data.scoreLoser / 2 * ((loser.elo - 942) / 142);
		}
		else
			winner.xp += 1.42;

		this.repository.save(loser);
		return this.repository.save(winner);
	}

	public deleteUser(id: number)
	{
		return this.repository.delete(id)
	}

	public async getPP(id: number)//: Promise<StreamableFile>
	{
		const user: User = await this.repository.findOne(id);

		// very unsure about this working

		return new StreamableFile(Readable.from(user.pp));
	}

	public async putPP(id: number, name: string, buffer: Buffer)
	{
		const user: User = await this.repository.findOne(id);

		user.pp_name = name;
		user.pp = buffer;

		return await this.repository.save(user);
	}
}
