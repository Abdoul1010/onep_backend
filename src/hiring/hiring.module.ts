import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HiringService } from './hiring.service';
import { HiringController } from './hiring.controller';
import { Hiring } from './hiring.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hiring])],
  controllers: [HiringController],
  providers: [HiringService],
  exports: [HiringService],
})
export class HiringModule {}
