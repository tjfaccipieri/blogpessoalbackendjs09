import { HttpException, HttpStatus, Injectable } from '@nestjs/common'; // Importa exceções, status HTTP e decorator Injectable
import { InjectRepository } from '@nestjs/typeorm'; // Injeta o repositório do TypeORM
import { ILike, Repository } from 'typeorm'; // ILike para busca case-insensitive, Repository para operações no banco
import { DeleteResult } from 'typeorm/browser'; // Tipo para resultado de deleção
import { Postagem } from '../entities/postagem.entity'; // Importa a entidade Postagem

@Injectable() // Torna a classe injetável pelo NestJS
export class PostagemService {
  constructor(
    @InjectRepository(Postagem) // Injeta o repositório da entidade Postagem
    private postagemRepository: Repository<Postagem>, // Repositório para acessar o banco
  ) {}

  async findAll(): Promise<Postagem[]> {
    // Busca todas as postagens
    return await this.postagemRepository.find(); // Retorna todas do banco
  }

  async findById(id: number): Promise<Postagem> {
    // Busca uma postagem pelo id
    /**
     * Recupera uma única entidade Postagem do banco de dados usando o padrão de repositório do TypeORM.
     *
     * O método `findOne` faz uma consulta no `postagemRepository` buscando uma entidade onde o campo `id`
     * seja igual ao valor fornecido. Isso é utilizado para buscar uma postagem específica pelo seu identificador único.
     *
     * id - Identificador único da entidade Postagem que será recuperada.
     */
    const postagem = await this.postagemRepository.findOne({
      where: {
        id,
      },
    });

    if (!postagem) {
      // Se não encontrar, lança exceção 404
      /**
       * Lança uma exceção HTTP 404 caso a postagem não seja encontrada.
       *
       * Se o método não localizar uma entidade Postagem com o ID fornecido,
       * ele dispara uma exceção do tipo `HttpException` com a mensagem
       * 'A postagem não foi encontrada!!!!' e o status HTTP `NOT_FOUND`.
       *
       * @throws {HttpException} Exceção 404 se a postagem não existir no banco de dados.
       */
      throw new HttpException(
        'A postagem não foi encontrada!!!!',
        HttpStatus.NOT_FOUND,
      );
    }

    return postagem; // Retorna a postagem encontrada
  }

  async findAllByTitulo(titulo: string): Promise<Postagem[]> {
    // Busca postagens pelo título (parcial, ignorando maiúsculas/minúsculas)
    return await this.postagemRepository.find({
      where: {
        titulo: ILike(`%${titulo}%`), // Busca por título parecido
      },
    });
  }

  async create(postagem: Postagem): Promise<Postagem> {
    // Cria uma nova postagem
    return await this.postagemRepository.save(postagem); // Salva no banco
  }

  async update(postagem: Postagem): Promise<Postagem> {
    // Atualiza uma postagem existente
    await this.findById(postagem.id); // Garante que existe antes de atualizar

    return await this.postagemRepository.save(postagem); // Salva as alterações
  }

  async delete(id: number): Promise<DeleteResult> {
    // Deleta uma postagem pelo id
    await this.findById(id); // Garante que existe antes de deletar

    return await this.postagemRepository.delete(id); // Remove do banco
  }
}
