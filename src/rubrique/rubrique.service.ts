import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubrique } from './entities/rubrique.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateRubriqueDto } from './dto/create-rubrique.dto';
import { UpdateRubriqueDto } from './dto/update-rubrique.dto';


@Injectable()
export class RubriqueService {
  constructor(
    @InjectRepository(Rubrique)
    private rubriqueRepo: Repository<Rubrique>,
  ) {}

  create(dto: CreateRubriqueDto) {
    return this.rubriqueRepo.save(dto);
  }

  findAll() {
    return this.rubriqueRepo.find();
  }

  findOne(id: number) {
    return this.rubriqueRepo.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateRubriqueDto) {
    return this.rubriqueRepo.update(id, dto);
  }

  remove(id: number) {
    return this.rubriqueRepo.delete(id);
  }
}
