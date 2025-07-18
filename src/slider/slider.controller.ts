import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { SliderService } from './slider.service';
import { Slider } from './slider.entity';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post()
  create(@Body() data: Partial<Slider>): Promise<Slider> {
    return this.sliderService.create(data);
  }

  @Get()
  findAll(): Promise<Slider[]> {
    return this.sliderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Slider> {
    return this.sliderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: Partial<Slider>): Promise<Slider> {
    return this.sliderService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.sliderService.remove(+id);
  }
}
