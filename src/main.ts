import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import fastifyCors from '@fastify/cors';
import * as multipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: ['error', 'warn', 'debug', 'log', 'verbose'] }
  );

  await app.register(multipart);

  await app.register(fastifyCors, {
    origin: '*', // ou l’URL précise de ton frontend (ex. http://localhost:5000)
  });

  app.useStaticAssets({
  root: join(__dirname, '..', 'uploads'),
  prefix: '/uploads/',
});
  //await app.listen(process.env.PORT ?? 3000);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();

