import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { PerfilUsuario } from '../entities/usuario.entity';

// Define as regras de validação para os dados recebidos na criação de um usuário
export class CreateUsuarioDto {
    @IsString({ message: 'O nome deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    nome!: string;

    @IsEmail({}, { message: 'E-mail inválido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    senha!: string;

    @IsEnum(PerfilUsuario, { message: 'Perfil inválido.' })
    @IsOptional()
    perfil?: PerfilUsuario;
}