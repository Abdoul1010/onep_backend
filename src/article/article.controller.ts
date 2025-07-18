import { ArticleService } from './article.service';
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Put, 
  Delete, 
  Patch, 
  UploadedFile,
  UseInterceptors,
  Req,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Article } from './article.entity';
import { pipeline } from 'stream/promises';
import { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { Like } from 'typeorm';


@Controller('article')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

  // POST requests to create a new article.
  @Post()
async create(@Req() req: FastifyRequest): Promise<Article> {
  const contentType = req.headers['content-type'];
  
  if (contentType?.includes('multipart/form-data')) {
    const parts = req.parts();
    let formData: Record<string, any> = {};
    let imagePath: string | null = null;
    
    // Traitement de toutes les parties du formulaire
    for await (const part of parts) {
      if (part.type === 'file') {
        const fileName = `${Date.now()}-${part.filename}`;
        const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'images', fileName);
        
        await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
        await pipeline(part.file, fs.createWriteStream(uploadPath));
        imagePath = `/uploads/images/${fileName}`;
      } else {
        // Collecter les données du formulaire
        formData[part.fieldname] = part.value;
      }
    }
    
    // Construire l'objet Article complet
    const articleData: Article = {
  id: 0, 
  title: formData.title,
  slug: formData.slug || this.generateSlug(formData.title),
  content: formData.content,
  image: imagePath || "",
  category: formData.category,
  status: formData.status || 'publie',
  views: 0,
  is_featured: formData.is_featured === 'true' || true,
  tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
  published_at: new Date(),
  updateDate: new Date(),
};
    
    return this.articleService.create(articleData);
  } else {
    // Cas JSON standard
    const article = req.body as Article;
    return this.articleService.create(article);
  }
}

// Méthode utilitaire pour générer un slug
private generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

  /*@Post()
  create(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article);
  }*/

    //recherche
    @Get('search')
async search(@Query('query') query: string) {
  return this.articleService.search(query);
}


  // GET requests to retrieve all articles.
  @Get()
  findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get('category/:category')
findByCategory(@Param('category') category: string): Promise<Article[]> {
  return this.articleService.findByCategory(category);
}

  // PATCH requests to update an existing article's data.
  @Patch(':id')
  update(@Param('id') id: number, @Body() article: Article): Promise<Article> {
    return this.articleService.update(id, article);
  }

  // DELETE requests to remove a article from the system.
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.articleService.remove(id);
  }
}
