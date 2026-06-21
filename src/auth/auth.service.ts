import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService,
    ) {}

    // Valida as credenciais do usuário
    async validarUsuario(email: string, senhaPassada: string): Promise<any> {
        const usuario = await this.usuariosService.encontrarPorEmailComSenha(email);
        if (usuario) {
            const senhaValida = await bcrypt.compare(senhaPassada, usuario.senha);
            if (senhaValida) {
                const { senha, ...resultado } = usuario;
                return resultado;
            }
        }
        throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    async login(usuario: any) {
        const payload = { email: usuario.email, sub: usuario.id, perfil: usuario.perfil };
        return {
            access_token: this.jwtService.sign(payload),
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
            },
        };
    }
}