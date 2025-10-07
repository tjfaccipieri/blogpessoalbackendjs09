/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

//criar uma nova suite de testes
describe('Testes dos módulos Usuario e Auth (e2e)', () => {
  let app: INestApplication<App>;
  let usuarioId: number;
  let temaId: number;
  let postagemId: number;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // daqui pra baixo começa os testes
  it('01 - Deve cadastrar um novo Usuário', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(201);

    usuarioId = resposta.body.id;
  });

  it('02 - Não deve cadastrar um usuario duplicado', async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(400);
  });

  it('03 - Deve autenticar um Usuário (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = resposta.body.token;
  });

  it('04 - Deve listar todos os usuários', async () => {
    return await request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it('05 - Deve atualizar um usuário', async () => {
    return request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root Atualizado',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(200)
      .then((resposta) => {
        expect('Root Atualizado').toEqual(resposta.body.nome);
      });
  });

  it('06 - Deve conseguir criar um tema', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/temas')
      .set('Authorization', `${token}`)
      .send({
        descricao: 'Novo tema',
      })
      .expect(201);

    temaId = resposta.body.id;
  });

  it('06.2 - Não deve criar um tema sem o token de usuario', async () => {
    await request(app.getHttpServer())
      .post('/temas')
      .send({ descricao: 'novo tema' })
      .expect(401);
  });

  it('07 - Deve conseguir cadastrar uma postagem', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/postagens')
      .set('Authorization', `${token}`)
      .send({
        titulo: 'Titulo de teste',
        texto: 'Texto de teste',
        tema: temaId,
        usuario: usuarioId,
      })
      .expect(201);

    postagemId = resposta.body.id;
  });

  it('08 - Não deve conseguir listar postagens sem Login válido', async () => {
    return await request(app.getHttpServer()).get('/postagens').expect(401);
  });

  it('09 - Deve listar as postagens com Login válido', async () => {
    return await request(app.getHttpServer())
      .get('/postagens')
      .set('Authorization', `${token}`)
      .expect(200);
  });
});
