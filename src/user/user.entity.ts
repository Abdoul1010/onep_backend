// src/auth/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true }) // Nullable car utilisateur Google peut ne pas avoir de password
  password: string;

  @Column({ nullable: true }) // Nullable car utilisateur classique peut ne pas avoir de googleId
  googleId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ 
    type: 'enum', 
    enum: ['local', 'google', 'both'],
    default: 'local'
  })
  authProvider: 'local' | 'google' | 'both';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}