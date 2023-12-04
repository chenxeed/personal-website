import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // Performance Monitoring
    tracesSampleRate: 1.0,
  });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableVersioning({ type: VersioningType.URI });
  app.use(helmet());
  app.use(compression());
  await app.listen(3001);
}

bootstrap();
