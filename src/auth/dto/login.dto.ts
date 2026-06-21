import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Define e valida as regras dos dados que a API espera receber no momento do login
export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  senha!: string;
}