import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNotEmptyObject, IsArray } from 'class-validator';

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
