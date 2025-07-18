import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hiring } from './hiring.entity';
import { CreateHiringDto } from './dto/create-hiring.dto/create-hiring.dto';
import { UpdateHiringDto } from './dto/update-hiring.dto/update-hiring.dto';

@Injectable()
export class HiringService {
  constructor(
    @InjectRepository(Hiring)
    private readonly repo: Repository<Hiring>,
  ) {}

  create(dto: CreateHiringDto) {
    const offre = this.repo.create(dto);
    return this.repo.save(offre);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateHiringDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}
