//import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import {
  Controller, Get, Post, Patch, Delete, Body, Param, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

@Post('upload')
@UseInterceptors(
  FileInterceptor('pdf', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const ext = extname(file.originalname);
        cb(null, `${name}-${Date.now()}${ext}`);
      },
    }),
  }),
)
uploadPdf(@UploadedFile() file: Express.Multer.File, @Body() data: Partial<Product>): Promise<Product> {
  data.pdfPath = file.filename;
  return this.productService.create(data);
}

  @Post()
  create(@Body() data: Partial<Product>): Promise<Product> {
    return this.productService.create(data);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: Partial<Product>): Promise<Product> {
    return this.productService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(+id);
  }
}
