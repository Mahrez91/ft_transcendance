import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddMatchDto
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
