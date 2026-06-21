import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto'; 

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    // Recebe os dados no corpo da requisição para criar um usuário
    @Post()
    criar(@Body() createUsuarioDto: CreateUsuarioDto) { 
        return this.usuariosService.criar(createUsuarioDto);
    }

    // Retorna a lista completa de usuários cadastrados
    @Get()
    listarTodos() {
        return this.usuariosService.listarTodos();
    }
}