import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChanDto, MsgDto, PwdDto, UpdateChanDto } from './chan.dto';
import { Chan } from './chan.entity';

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
			msg: [],
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
		return this.repository.find({ order: { id: "ASC" } });
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
		chan.msg = [];

		if (body.type === 'protected' && body.hash)
			chan.hash = hashing(body.hash);
		// init msg
		chan.bannedId = [];
		chan.mutedId = [];

		return await this.repository.save(chan);
	}

	public async createDirectChan(body: CreateChanDto): Promise<Chan>
	{
		let name: string;

		if (body.usersId[0] < body.usersId[1])
			name = body.usersId[0] + ' ' + body.usersId[1];
		else
			name = body.usersId[1] + ' ' + body.usersId[0];

		if (await this.repository.count({ where: { name: name } }))
			return await this.repository.findOne({ name: name });

		const chan: Chan = new Chan();

		chan.name = name;
		chan.ownerId = -1;
		chan.adminsId = [];
		chan.usersId = body.usersId;
		chan.type = 'direct';
		chan.msg = [];
		chan.bannedId = [];
		chan.mutedId = [];

		return await this.repository.save(chan);
	}

	public async updateChan(id: number, data: UpdateChanDto)
	{
		const chan = await this.repository.findOne(id);

		if (data.name)
			chan.name = data.name;
		if (data.userId)
		{
			if (!chan.usersId.includes(data.userId))
				chan.usersId.push(data.userId);
			else
			{
				const index = chan.usersId.indexOf(data.userId);
				if (index > -1)
					chan.usersId.splice(index, 1);
			}
		}
		if (data.ownerId)
			chan.ownerId = data.ownerId;
		if (data.adminId)
		{
			if (!chan.adminsId.includes(data.adminId))
				chan.adminsId.push(data.adminId);
			else
			{
				const index = chan.adminsId.indexOf(data.adminId);
				if (index > -1)
					chan.adminsId.splice(index, 1);
			}
		}
		if (data.type)
			chan.type = data.type;
		if (data.hash)
			chan.hash = hashing(data.hash);
		if (data.bannedId)
		{
			if (!chan.bannedId.includes(data.bannedId))
				chan.bannedId.push(data.bannedId);
			else
			{
				const index = chan.bannedId.indexOf(data.bannedId);
				if (index > -1)
					chan.bannedId.splice(index, 1);
			}
		}
		if (data.mutedId)
		{
			if (!chan.mutedId.includes(data.mutedId))
				chan.mutedId.push(data.mutedId);
			else
			{
				const index = chan.mutedId.indexOf(data.mutedId);
				if (index > -1)
					chan.mutedId.splice(index, 1);
			}
		}

		return await this.repository.save(chan);
	}

	public async joinChan(id: number, data: UpdateChanDto)
	{
		const chan = await this.repository.findOne(id);

		if (!data.userId)
			return chan;

		if (!chan.usersId.includes(data.userId))
			chan.usersId.push(data.userId);

		return await this.repository.save(chan);
	}


	public async sendMsg(id: number, data: MsgDto)
	{
		const chan = await this.repository.findOne(id);

		chan.msg.push(data);

		return this.repository.save(chan);
	}

	public async sendDirectMsg(toUserId: number, data: MsgDto)
	{
		let name: string;
		let chan: Chan;

		if (toUserId < data.userId)
			name = toUserId.toString() + ' ' + data.userId.toString();
		else
			name = data.userId.toString() + ' ' + toUserId.toString();

		if (!await this.repository.count({ where: { name: name } }))
		{
			const createChanDto: CreateChanDto = {
				name: name,
				ownerId: -1,
				usersId: [data.userId, toUserId],
				type: 'direct',
				hash: ''
			};
			chan = await this.createDirectChan(createChanDto);
		}
		else
			chan = await this.repository.findOne({ name: name });

		chan.msg.push(data);

		return this.repository.save(chan);
	}

	public async tryPwd(id: number, data: PwdDto): Promise<Chan>
	{
		const chan = await this.repository.findOne(id);

		if (chan.hash && chan.hash === hashing(data.pwd))
		{
			chan.usersId.push(data.userId);
			return this.repository.save(chan);
		}

		return chan;
	}

	public deleteChan(id: number)
	{
		return this.repository.delete(id)
	}

	public async addUserToChan(id: number, usersId: number)
	{
		const chan = await this.repository.findOne(id);

		if (!chan.usersId)
			chan.usersId = [];
		chan.usersId.push(usersId);
		return this.repository.save(chan);
	}

	public async addAdminToChan(id: number, usersId: number)
	{
		const chan = await this.repository.findOne(id);

		if (!chan.adminsId)
			chan.adminsId = [];
		chan.adminsId.push(usersId);
		return this.repository.save(chan);
	}

	public async addBannedIdToChan(id: number, usersId: number)
	{
		const chan = await this.repository.findOne(id);

		if (!chan.bannedId)
			chan.bannedId = [];
		chan.bannedId.push(usersId);
		return this.repository.save(chan);
	}

	public async addMutedIdToChan(id: number, usersId: number)
	{
		const chan = await this.repository.findOne(id);

		if (!chan.mutedId)
			chan.mutedId = [];
		chan.mutedId.push(usersId);
		return this.repository.save(chan);
	}

	public async quitChan(id: number, usersId: number)
	{
		const chan = await this.repository.findOne(id);
		const index_users = chan.usersId.indexOf(usersId);

		if (index_users > -1)
			chan.usersId.splice(index_users, 1);
		console.log("after usersid splice" + chan.usersId.length);
		console.log("before adminid splice" + chan.adminsId.length);
		if (chan.usersId.length < 1)
		{
			// delete the chan
			return this.repository.remove(chan);
		}
		const index_admins = chan.adminsId.indexOf(usersId);
		if (index_admins > -1)
			chan.adminsId.splice(index_admins, 1);
		console.log("after adminid splice " + chan.adminsId.length + ", index_admins = " + index_admins);
		if (chan.adminsId.length < 1)
		{
			// delete the chan
			return this.repository.remove(chan);
		}

		return this.repository.save(chan);
	}
}
