import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChanController } from './chan.controller';
import { Chan } from './chan.entity';
import { ChanService } from './chan.service';
import { ChatGateway } from './chat.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([Chan])],
	controllers: [ChanController],
	providers: [ChanService, ChatGateway],
})
export class ChanModule { }
