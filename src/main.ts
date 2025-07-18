/*import { NestFactory } from '@nestjs/core';
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
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();*/

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { join } from 'path';
import fastifyCors from '@fastify/cors';
// Changez cette ligne
import multipart from '@fastify/multipart';

let app: NestFastifyApplication;

async function createNestServer() {
  if (!app) {
    const fastifyInstance = require('fastify')();
    
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(fastifyInstance),
      { logger: ['error', 'warn', 'debug', 'log', 'verbose'] }
    );
    
    // Changez cette ligne
    await app.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    });
    
    await app.register(fastifyCors, {
      origin: '*',
    });
    
    app.useStaticAssets({
      root: join(__dirname, '..', 'uploads'),
      prefix: '/uploads/',
    });
    
    await app.init();
  }
  return app;
}

// Export pour Vercel
export default async (req, res) => {
  const nestApp = await createNestServer();
  await nestApp.getHttpAdapter().getInstance().ready();
  nestApp.getHttpAdapter().getInstance().server.emit('request', req, res);
};

