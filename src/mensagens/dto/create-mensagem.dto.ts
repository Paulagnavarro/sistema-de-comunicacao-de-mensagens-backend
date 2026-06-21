import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// Valida os dados obrigatórios enviados na hora de criar e enviar uma nova mensagem
export class CreateMensagemDto {
  @IsNotEmpty({ message: 'O conteúdo da mensagem não pode estar vazio.' })
  @IsString()
  conteudo!: string;

  @IsNotEmpty({ message: 'O destinatário é obrigatório.' })
  @IsNumber({}, { message: 'O ID do destinatário deve ser um número.' })
  destinatarioId!: number;
}