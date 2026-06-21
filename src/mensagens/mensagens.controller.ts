import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, Patch } from '@nestjs/common';
import { MensagensService } from './mensagens.service';
import { ListarMensagemDto } from './dto/listar-mensagem.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMensagemDto } from './dto/create-mensagem.dto';

@UseGuards(JwtAuthGuard) 
@Controller('mensagens')
export class MensagensController {
    constructor(private readonly mensagensService: MensagensService) {}

    // Cria uma nova mensagem usando o ID do usuário logado
    @Post()
    criar(@Req() req, @Body() createMensagemDto: CreateMensagemDto) { 
        return this.mensagensService.criar(req.user.id, createMensagemDto);
    }

    // Lista as mensagens aplicando os filtros passados na URL
    @Get()
    listarTodas(@Req() req, @Query() filtros: ListarMensagemDto) {
        return this.mensagensService.listarTodas(req.user, filtros);
    }

    // Busca os detalhes de uma mensagem específica pelo ID
    @Get(':id') 
    buscarPorId(@Param('id') id: string, @Req() req) { 
        return this.mensagensService.buscarPorId(+id, req.user);
    }

    // Marca uma mensagem como lida
    @Patch(':id/ler')
    async marcarComoLida(@Param('id') id: string, @Req() req) {
        return this.mensagensService.marcarComoLida(+id, req.user);
    }
}