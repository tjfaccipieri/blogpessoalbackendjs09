import {
  Body, // Permite acessar o corpo da requisição HTTP
  Controller, // Define a classe como um controller do NestJS
  Delete, // Mapeia o método para requisições HTTP DELETE
  Get, // Mapeia o método para requisições HTTP GET
  HttpCode, // Permite definir o código de status HTTP da resposta
  HttpStatus, // Enum com os códigos de status HTTP
  Param, // Permite acessar parâmetros da rota
  ParseIntPipe, // Converte o parâmetro para inteiro
  Post, // Mapeia o método para requisições HTTP POST
  Put, // Mapeia o método para requisições HTTP PUT
} from '@nestjs/common';
import { Postagem } from '../entities/postagem.entity'; // Importa a entidade Postagem
import { PostagemService } from '../services/postagem.service'; // Importa o serviço PostagemService

@Controller('/postagens') // Define o prefixo das rotas desse controller como /postagens
export class PostagemController {
  constructor(private readonly postagemService: PostagemService) {} // Injeta o serviço PostagemService

  @Get() // Mapeia para GET /postagens
  @HttpCode(HttpStatus.OK) // Responde com status 200 OK
  findAll(): Promise<Postagem[]> {
    // Método para buscar todas as postagens
    return this.postagemService.findAll(); // Chama o método findAll da classe Service
  }

  @Get('/:id') // Mapeia para GET /postagens/:id
  @HttpCode(HttpStatus.OK) // Responde com status 200 OK
  findById(@Param('id', ParseIntPipe) id: number): Promise<Postagem> {
    /**
     * Recupera uma única entidade Postagem pelo seu identificador único.
     * @param id - O identificador único da Postagem a ser recuperada, extraído do parâmetro da rota e automaticamente convertido para número usando ParseIntPipe.
     * O ParseIntPipe garante que o parâmetro id recebido seja convertido para número e lança um erro caso a conversão falhe.
     */
    // Busca uma postagem pelo id
    return this.postagemService.findById(id); // Chama o método findById da classe Service
  }

  @Get('/titulo/:titulo') // Mapeia para GET /postagens/titulo/:titulo
  @HttpCode(HttpStatus.OK) // Responde com status 200 OK
  findByAlltitulo(@Param('titulo') titulo: string): Promise<Postagem[]> {
    // Busca postagens pelo título
    return this.postagemService.findAllByTitulo(titulo); // Chama o método findAllByTitulo da classe Service
  }

  @Post() // Mapeia para POST /postagens
  @HttpCode(HttpStatus.CREATED) // Responde com status 201 Created
  create(@Body() postagem: Postagem): Promise<Postagem> {
    // O @Body() pega os dados que vêm no corpo da requisição HTTP.
    // Por exemplo, quando alguém envia um formulário ou um JSON para criar ou atualizar uma postagem,
    // o @Body() recebe esses dados e coloca na variável 'postagem'.
    // Assim, você pode usar essas informações dentro da função para salvar ou modificar no banco de dados.

    return this.postagemService.create(postagem); // Chama o método create da classe Service
  }

  @Put() // Mapeia para PUT /postagens
  @HttpCode(HttpStatus.OK) // Responde com status 200 OK
  update(@Body() postagem: Postagem): Promise<Postagem> {
    // Atualiza uma postagem existente
    return this.postagemService.update(postagem); // Chama o método update da classe Service
  }

  @Delete('/:id') // Mapeia para DELETE /postagens/:id
  @HttpCode(HttpStatus.NO_CONTENT) // Responde com status 204 No Content
  delete(@Param('id', ParseIntPipe) id: number) {
    // Deleta uma postagem pelo id
    return this.postagemService.delete(id); // Chama o método delete da classe Service
  }
}
