import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum PerfilUsuario {
    ADMIN = 'administrador',
    PADRAO = 'usuario_padrao',
}

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false }) 
    senha!: string;

    @Column()
    nome!: string;

    @Column({
        type: 'enum',
        enum: PerfilUsuario,
        default: PerfilUsuario.PADRAO,
    })
    perfil!: PerfilUsuario;

    @CreateDateColumn()
    criadoEm!: Date;
}