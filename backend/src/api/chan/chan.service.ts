import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChanDto } from './chan.dto';
import { Chan } from './chan.entity';

@Injectable()
export class ChanService
{
	@InjectRepository(Chan)
	private readonly repository: Repository<Chan>;

	public initChan(): Promise<Chan>
	{
		return this.repository.save({
			id: 1,
			name: "global",
			ownerId: -1,
			adminsId: [-1],
			usersId: [-1],
			type: 'public',
			// msg init
			bannedId: [],
			mutedId: []
		});
	}

	public getChan(id: number): Promise<Chan>
	{
		return this.repository.findOne(id);
	}

	public getChanByName(name: string): Promise<Chan>
	{
		return this.repository.findOne({ name: name });
	}

	public getChans(): Promise<Chan[]>
	{
		return this.repository.find();
	}

	public async createChan(body: CreateChanDto): Promise<Chan>
	{
		if (await this.repository.count({ where: { name: body.name } }))
			throw new HttpException('channel name conflict', HttpStatus.CONFLICT);

		const chan: Chan = new Chan();

		chan.name = body.name;
		chan.ownerId = body.ownerId;
		chan.adminsId = [];
		chan.adminsId.push(body.ownerId);
		chan.usersId = [];
		if (body.usersId)
			chan.usersId = body.usersId;
		else
			chan.usersId.push(body.ownerId);
		chan.type = body.type;

		function hashing(pwd: string)
		{
			let hash = 0;
			for (let i = 0; i < pwd.length; i++)
			{
				const char = pwd.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return (hash);
		}
		if (body.type === 'protected' && body.hash)
			chan.hash = hashing(body.hash);
		// init msg
		chan.bannedId = [];
		chan.mutedId = [];

		return await this.repository.save(chan);
	}

	/*public async updateChan(id: number, updateChanDto: UpdateChanDto)
	{
		const chan = await this.repository.findOne(id);

		console.log

		if (updateChanDto.name)
			chan.name = updateChanDto.name;
		if (updateChanDto.xp)
			chan.xp += updateChanDto.xp;
		chan.xp++;
		if (updateChanDto.elo)
			chan.elo += updateChanDto.elo;
		if (updateChanDto.win)
			chan.win += 1;
		if (updateChanDto.lose)
			chan.lose += 1;
		if (updateChanDto.matchHistory)
		{
			if (!chan.matchHistory)
				chan.matchHistory = [];
			chan.matchHistory.push(updateChanDto.matchHistory);
		}
		if (updateChanDto.friendId)
		{
			if (!chan.friendsId)
				chan.friendsId = [];
			const i = chan.friendsId.indexOf(updateChanDto.friendId);
			if (i > -1)
				chan.friendsId.splice(i, 1);
			else
				chan.friendsId.push(updateChanDto.friendId);
		}

		return await this.repository.save(chan);
	}*/

	public deleteChan(id: number)
	{
		return this.repository.delete(id)
	}
}
