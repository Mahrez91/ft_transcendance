import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateChanDto, MsgDto, PwdDto, UpdateChanDto } from './chan.dto';
import { Chan } from './chan.entity';
import { ChanService } from './chan.service';

@Controller('chan')
export class ChanController
{
	@Inject(ChanService)
	private readonly service: ChanService;

	@Get('init')
	public initChan(): Promise<Chan>
	{
		return this.service.initChan();
	}

	@Get()
	public getChans(): Promise<Chan[]>
	{
		return this.service.getChans();
	}

	@Get(':id')
	public getChan(@Param('id', ParseIntPipe) id: number): Promise<Chan>
	{
		return this.service.getChan(id);
	}

	@Get('name/:name')
	public getChanByName(@Param('name') name: string): Promise<Chan>
	{
		return this.service.getChanByName(name);
	}

	@Post()
	public createChan(@Body() data: CreateChanDto)
	{
		return this.service.createChan(data);
	}

	@Post('dm')
	public createDirectChan(@Body() data: CreateChanDto)
	{
		return this.service.createDirectChan(data);
	}

	@Put(':id')
	public updateChan(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateChanDto)
	{
		return this.service.updateChan(id, data);
	}

	@Put('join/:id')
	public joinChan(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateChanDto)
	{
		return this.service.joinChan(id, data);
	}

	@Post('msg/:id')
	public sendMsg(@Param('id', ParseIntPipe) id: number, @Body() data: MsgDto)
	{
		return this.service.sendMsg(id, data);
	}

	@Post('msg/dm/:id')
	public sendDirectMsg(@Param('id', ParseIntPipe) toUserId: number, @Body() data: MsgDto)
	{
		return this.service.sendDirectMsg(toUserId, data);
	}

	@Post('pwd/:id')
	public tryPwd(@Param('id', ParseIntPipe) id: number, @Body() data: PwdDto)
	{
		return this.service.tryPwd(id, data);
	}

	@Delete(':id')
	public deleteChan(@Param('id', ParseIntPipe) id: number)
	{
		return this.service.deleteChan(id);
	}

	@Post('add/:id/:usersId')
	public addUserToChan(@Param('id', ParseIntPipe) id: number, @Param('usersId', ParseIntPipe) usersId: number)
	{
		return this.service.addUserToChan(id, usersId);
	}

	@Post('adminadd/:id/:usersId')
	public addAdminToChan(@Param('id', ParseIntPipe) id: number, @Param('usersId', ParseIntPipe) usersId: number)
	{
		return this.service.addAdminToChan(id, usersId);
	}

	@Post('adminban/:id/:usersId')
	public addBannedIdToChan(@Param('id', ParseIntPipe) id: number, @Param('usersId', ParseIntPipe) usersId: number)
	{
		return this.service.addBannedIdToChan(id, usersId);
	}

	@Post('adminmute/:id/:usersId')
	public addMutedIdToChan(@Param('id', ParseIntPipe) id: number, @Param('usersId', ParseIntPipe) usersId: number)
	{
		return this.service.addMutedIdToChan(id, usersId);
	}

	@Post('quit/:id/:usersId')
	public quitChan(@Param('id', ParseIntPipe) id: number, @Param('usersId', ParseIntPipe) usersId: number)
	{
		return this.service.quitChan(id, usersId);
	}
}
