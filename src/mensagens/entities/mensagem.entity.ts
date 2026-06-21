import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('mensagens')
export class Mensagem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, { eager: true }) 
  remetente!: Usuario;

  @ManyToOne(() => Usuario, { eager: true })
  destinatario!: Usuario;

  @Column({ type: 'text' })
  conteudo!: string;

  @Column({ default: false })
  lida!: boolean;

  @CreateDateColumn()
  criadoEm!: Date;
}