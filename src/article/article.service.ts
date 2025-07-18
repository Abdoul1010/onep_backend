import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Article } from './article.entity';
import { NotFoundException } from '@nestjs/common';



@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>, 
  ) {}
//It injects the TypeORM repository for the Article entity
// Allowing the service to manage Article data in the database.
async create(article: Article): Promise<Article> {
    return this.ArticleRepository.save(article);
  }

// Creates a new Article and saves it to the database
async findAll(): Promise<Article[]> {
    return this.ArticleRepository.find();
  }

  async findByCategory(category: string): Promise<Article[]> {
  return this.ArticleRepository.find({
    where: { category },
    order: { published_at: 'DESC' },
  });
}

  async findOne(id: number): Promise<Article> {
  const article = await this.ArticleRepository.findOne({
    where: { id },
    relations: ['tags'],
  });

  if (!article) {
    throw new NotFoundException(`Article with ID ${id} not found`);
  }

  return article;
}

async search(query: string): Promise<Article[]> {
  return this.ArticleRepository.find({
    where: { title: Like(`%${query}%`) },
    take: 10,
  });
}

// Retrieves all Articles from the database
 async update(id: number, article: Article): Promise<Article> {
    await this.ArticleRepository.update(id, article);
    return this.findOne(id);
  }

 // Updates an existing Article by their ID and returns the updated Article
  async remove(id: number): Promise<void> {
    await this.ArticleRepository.delete(id);
  }
 // Deletes a Article from the database by their ID
}