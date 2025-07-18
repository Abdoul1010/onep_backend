import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rubrique } from './entities/rubrique.entity';
import { RubriqueService } from './rubrique.service';
import { RubriqueController } from './rubrique.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rubrique])],
  controllers: [RubriqueController],
  providers: [RubriqueService],
  exports: [RubriqueService],
})
export class RubriqueModule {}
