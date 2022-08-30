import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateChanDto, MsgDto, PwdDto } from './chan.dto';
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
}
