import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slider } from './slider.entity';
import { SliderService } from './slider.service';
import { SliderController } from './slider.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Slider])],
  providers: [SliderService],
  controllers: [SliderController],
})
export class SliderModule {}
