import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog Pessoal do Thiago')
    .setDescription(
      'Blog feito com NEST durante as aulas da Turma JS09, feito com todo amor e carinho e um pouco de caos no meio das aulas',
    )
    .setContact(
      'Thiago Faccipieri',
      'https://github.com/tjfaccipieri',
      'thiago.faccipieri@external.generation.org',
    )
    .setVersion('v1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  process.env.TZ = '-03:00';

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
