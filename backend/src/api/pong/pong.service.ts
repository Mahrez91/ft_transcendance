import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddMatchDto } from './matchHistory.dto';
import { MatchHistory } from './matchHistory.entity';

@Injectable()
export class PongService
{
	@InjectRepository(MatchHistory)
	private readonly repositoryMatch: Repository<MatchHistory>;

	public getMatchs(): Promise<MatchHistory[]>
	{
		return this.repositoryMatch.find();
	}

	public getMatchOfUser(name: string): Promise<MatchHistory[]>
	{
		return this.repositoryMatch.find({
			where: [
				{ winner: name },
				{ loser: name },
			],
		});
	}

	public addMatch(body: AddMatchDto): Promise<MatchHistory>
	{
		const match = new MatchHistory();

		match.winner = body.winner;
		match.loser = body.loser;
		match.scoreWinner = body.scoreWinner;
		match.scoreLoser = body.scoreLoser;

		return this.repositoryMatch.save(match);
	}
}
