import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter'
import { ValidationPipe, BadRequestException } from '@nestjs/common'
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor'
import { AppLogger } from '@/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(AppLogger);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Bind both local URL formats
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  
  app.useGlobalFilters(
    new GlobalExceptionFilter(logger),
  )

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: errors.flatMap((error) =>
            Object.values(error.constraints ?? {}),
          ),
        })
      },
    }),
  )

  app.useGlobalInterceptors(
    new ResponseInterceptor(),
  )

  await app.listen(process.env.PORT ?? 3000);

  logger.log(
    `Server running on port ${config.get<number>('app.port')}`,
  )
}
bootstrap();
