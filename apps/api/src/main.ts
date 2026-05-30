import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter'
import { ValidationPipe, BadRequestException } from '@nestjs/common'
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor'
import { AppLogger } from '@/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(AppLogger);
  const config = app.get(ConfigService);

  app.useGlobalFilters(
    new GlobalExceptionFilter(logger),
  )

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
