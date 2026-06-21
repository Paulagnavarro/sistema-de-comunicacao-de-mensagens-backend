import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuariosRepository: Repository<Usuario>,
    ) {}

    // Busca um usuário pelo e-mail trazendo a senha (usado na autenticação)
    async encontrarPorEmailComSenha(email: string): Promise<Usuario | null> {
        return this.usuariosRepository.findOne({
            where: { email },
            select: {
                id: true,
                email: true,
                senha: true,
                nome: true,
                perfil: true,
            },
        });
    }

    // Cadastra um novo usuário no banco de dados
    async criar(dadosUsuario: CreateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
        const emailExiste = await this.usuariosRepository.findOne({
            where: { email: dadosUsuario.email },
        });

        if (emailExiste) {
            throw new BadRequestException('Este e-mail já está cadastrado.');
        }

        const salt = await bcrypt.genSalt();
        const senhaCriptografada = await bcrypt.hash(dadosUsuario.senha, salt);

        const novoUsuario = this.usuariosRepository.create({
            ...dadosUsuario,
            senha: senhaCriptografada,
        });

        const usuarioSalvo = await this.usuariosRepository.save(novoUsuario);
        const { senha, ...resultado } = usuarioSalvo;
        return resultado;
    }

    async listarTodos(): Promise<Usuario[]> {
        return this.usuariosRepository.find();
    }
}