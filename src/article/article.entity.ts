import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({nullable: true})
  slug: string;

  @Column('text')
  content: string;

  @Column({nullable: true})
  image: string;

  @Column()
  category: string;

  @Column({default: 'publie'})
  status: string;

  @ManyToMany(() => Tag, tag => tag.articles, { cascade: true })
@JoinTable()
tags: Tag[];

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column({default: 0})
  views: number;

  @Column({default: true})
  is_featured: boolean;
}
