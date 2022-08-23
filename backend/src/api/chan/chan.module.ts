import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChanController } from './chan.controller';
import { Chan } from './chan.entity';
import { ChanService } from './chan.service';

@Module({
	imports: [TypeOrmModule.forFeature([Chan])],
	controllers: [ChanController],
	providers: [ChanService],
})
export class ChanModule { }
