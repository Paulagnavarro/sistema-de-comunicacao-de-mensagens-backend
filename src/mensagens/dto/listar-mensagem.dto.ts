import { IsOptional, IsString, IsIn } from 'class-validator';

// Define os parâmetros opcionais para filtrar a listagem de mensagens
export class ListarMensagemDto {
    @IsOptional()
    @IsString()
    busca?: string;

    @IsOptional()
    @IsString()
    @IsIn(['lidas', 'nao_lidas'])
    statusLida?: string;

    @IsOptional()
    @IsString()
    remetenteId?: string;
}