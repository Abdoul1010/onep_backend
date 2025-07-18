import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slider } from './slider.entity';

@Injectable()
export class SliderService {
  constructor(
    @InjectRepository(Slider)
    private readonly sliderRepo: Repository<Slider>,
  ) {}

  async create(data: Partial<Slider>): Promise<Slider> {
    const slider = this.sliderRepo.create(data);
    return this.sliderRepo.save(slider);
  }

  async findAll(): Promise<Slider[]> {
    return this.sliderRepo.find();
  }

  async findOne(id: number): Promise<Slider> {
    const slider = await this.sliderRepo.findOne({ where: { id } });
    if (!slider) throw new NotFoundException(`Slider ${id} introuvable`);
    return slider;
  }

  async update(id: number, data: Partial<Slider>): Promise<Slider> {
    const slider = await this.findOne(id);
    Object.assign(slider, data);
    return this.sliderRepo.save(slider);
  }

  async remove(id: number): Promise<void> {
    const slider = await this.findOne(id);
    await this.sliderRepo.remove(slider);
  }
}
