import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNotEmptyObject } from 'class-validator';

export class CreateUserDto
{
	@IsString()
	public access_token: string;
}

export class UpdateUserDto
{
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	public name: string;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public xp: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public elo: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public win: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public lose: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public friendId: number;

	@IsNumber()
	@IsNotEmpty()
	@IsOptional()
	public mutedId: number;
}

export class UpdateUsersAfterGameDto
{
	@IsString()
	@IsNotEmpty()
	public winner: string;

	@IsString()
	@IsNotEmpty()
	public loser: string;

	@IsNumber()
	@IsNotEmpty()
	public scoreWinner: number;

	@IsNumber()
	@IsNotEmpty()
	public scoreLoser: number;
}
