import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateChanDto
{
	@IsString()
	@IsNotEmpty()
	public name: string;

	@IsNumber()
	@IsNotEmpty()
	public ownerId: number;

	@IsArray()
	@IsNotEmpty()
	@IsOptional()
	public usersId: number[];

	@IsString()
	@IsNotEmpty()
	public type: 'public' | 'private' | 'protected' | 'direct';

	@IsString()
	@IsOptional()
	public hash: string;
}

export class MsgDto
{
	@IsNumber()
	@IsNotEmpty()
	public userId: number;

	@IsString()
	@IsNotEmpty()
	public username: string;

	@IsString()
	@IsNotEmpty()
	public msg: string;

	@IsDateString()
	@IsNotEmpty()
	public sendAt: Date;
}
