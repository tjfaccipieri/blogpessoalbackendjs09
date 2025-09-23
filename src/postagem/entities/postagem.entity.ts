import { IsNotEmpty } from 'class-validator'; // Valida se o campo não está vazio
import {
  Column, // Define uma coluna no banco de dados
  Entity, // Marca a classe como uma entidade do TypeORM
  PrimaryGeneratedColumn, // Define a coluna como chave primária gerada automaticamente
  UpdateDateColumn, // Atualiza automaticamente a data quando o registro é alterado
} from 'typeorm';

@Entity({ name: 'tb_postagens' }) // Define o nome da tabela no banco de dados
export class Postagem {
  @PrimaryGeneratedColumn() // Chave primária gerada automaticamente
  id: number;

  @IsNotEmpty() // Valida que o campo não pode ser vazio
  @Column({ length: 100, nullable: false }) // Coluna do tipo string, máximo 100 caracteres, obrigatória
  titulo: string;

  @IsNotEmpty() // Valida que o campo não pode ser vazio
  @Column({ length: 1000, nullable: false }) // Coluna do tipo string, máximo 1000 caracteres, obrigatória
  texto: string;

  @UpdateDateColumn() // Coluna que armazena a data de atualização automática
  data: Date;
}
