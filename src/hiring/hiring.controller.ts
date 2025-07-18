import { Controller, Get, Post, Patch, Delete, Param, Body, Req } from '@nestjs/common';
import { HiringService } from './hiring.service';
import { CreateHiringDto } from './dto/create-hiring.dto/create-hiring.dto';
import { UpdateHiringDto } from './dto/update-hiring.dto/update-hiring.dto';
import { Hiring } from './hiring.entity';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { FastifyRequest } from 'fastify';

@Controller('hiring')
export class HiringController {
  constructor(private readonly service: HiringService) {}

  @Post()
  async create(@Req() req: FastifyRequest): Promise<Hiring> {
    const contentType = req.headers['content-type'];

    const parts = req.parts();
    let formData: Record<string, any> = {};
    let imagePath: string | null = null;

    for await (const part of parts) {
      if (part.type === 'file') {
        const fileName = `${Date.now()}-${part.filename}`;
        const uploadPath = path.join(__dirname,'..','..','uploads','images', fileName);

        await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true});
        await pipeline(part.file, fs.createWriteStream(uploadPath));
        imagePath = `/uploads/images/${fileName}`;
      }else {
        formData[part.fieldname] = part.value;
      }
    }

    const dto: CreateHiringDto = {
    title: formData['title'],
    description: formData['description'],
    structure: formData['structure'],
    place: formData['place'],
    workName: formData['workName'],
    category: formData['category'],
    closeDate: formData['closeDate'],
    image: imagePath ?? '',
  };

    return this.service.create(dto);

  }
  /*@Post()
  create(@Body() dto: CreateHiringDto) {
    return this.service.create(dto);
  }*/

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateHiringDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
