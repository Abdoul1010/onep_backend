import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column('text')
  description: string;

  @Column()
  coverImage: string;

  @Column()
  category: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  pdfPath: string;

  @Column({ type: 'date' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
