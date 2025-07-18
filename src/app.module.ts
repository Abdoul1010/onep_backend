import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { SliderModule } from './slider/slider.module';
import { ProductModule } from './product/product.module';
import { RubriqueModule } from './rubrique/rubrique.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
//import { HiringService } from './hiring/hiring.service';
//import { HiringController } from './hiring/hiring.controller';
import { HiringModule } from './hiring/hiring.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'onep_info',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ArticleModule,
    TagModule,
    SliderModule,
    ProductModule,
    RubriqueModule,
    UserModule,
    AuthModule,
    HiringModule,
  ],
  controllers: [AppController],//, HiringController],
  providers: [AppService],// HiringService],
})
export class AppModule {}
