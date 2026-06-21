import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensagem } from './entities/mensagem.entity';
import { ListarMensagemDto } from './dto/listar-mensagem.dto';
import { CreateMensagemDto } from './dto/create-mensagem.dto';

@Injectable()
export class MensagensService {
    constructor(
        @InjectRepository(Mensagem)
        private readonly mensagemRepository: Repository<Mensagem>,
    ) {}

    // Cria e salva uma nova mensagem
    async criar(remetenteId: number, corpo: CreateMensagemDto) {
        const novaMensagem = this.mensagemRepository.create({
            conteudo: corpo.conteudo,
            remetente: { id: remetenteId },
            destinatario: { id: corpo.destinatarioId },
        });

        const mensagemSalva = await this.mensagemRepository.save(novaMensagem);

        return this.mensagemRepository.findOne({
            where: { id: mensagemSalva.id },
            relations: {
                remetente: true,
                destinatario: true,
            },
        });
    }

    // Lista as mensagens aplicando filtros e aplicando regras de visualização por perfil
    async listarTodas(usuarioLogado: { id: number; perfil: string }, filtros: ListarMensagemDto) {
        const query = this.mensagemRepository.createQueryBuilder('mensagem')
            .leftJoinAndSelect('mensagem.remetente', 'remetente')
            .leftJoinAndSelect('mensagem.destinatario', 'destinatario');

        // Se não for admin, só permite ver as mensagens que enviou ou que recebeu
        if (usuarioLogado.perfil !== 'administrador') {
            query.andWhere(
                '(mensagem.remetenteId = :id OR mensagem.destinatarioId = :id)',
                { id: usuarioLogado.id }
            );
        }

        // Filtro por palavra-chave
        if (filtros.busca?.trim()) {
            query.andWhere('LOWER(mensagem.conteudo) LIKE LOWER(:busca)', {
                busca: `%${filtros.busca}%`,
            });
        }

        // Filtro pelo status de leitura (lidas / não lidas)
        if (filtros.statusLida) {
            const isLida = filtros.statusLida === 'lidas';
            query.andWhere('mensagem.lida = :status', { status: isLida });
        }

        // Filtro por remetente
        if (filtros.remetenteId) {
            query.andWhere('mensagem.remetenteId = :remetenteId', { remetenteId: filtros.remetenteId });
        }

        query.orderBy('mensagem.criadoEm', 'DESC');
        return query.getMany();
    }

    // Busca uma mensagem por ID, valida as permissões e marca como lida se necessário
    async buscarPorId(id: number, usuarioLogado: { id: number; perfil: string }) {
        const mensagem = await this.mensagemRepository.findOne({
            where: { id }, 
            relations: {
                remetente: true,
                destinatario: true,
            },
        });

        if (!mensagem) {
            throw new NotFoundException('Mensagem não encontrada.');
        }

        // Impede usuários comuns de acessarem mensagens de terceiros
        if (usuarioLogado.perfil !== 'administrador' &&
            mensagem.remetente?.id !== usuarioLogado.id &&
            mensagem.destinatario?.id !== usuarioLogado.id) {
            throw new NotFoundException('Você não tem permissão para ver esta mensagem.');
        }

        // Se quem está abrindo é o destinatário, marca como lida automaticamente
        if (mensagem.destinatario?.id === usuarioLogado.id && !mensagem.lida) {
            mensagem.lida = true;
            await this.mensagemRepository.save(mensagem);
        }
        return mensagem;
    }

    // Rota específica para marcar a mensagem como lida
    async marcarComoLida(id: number, usuarioLogado: { id: number }) {
        const mensagem = await this.mensagemRepository.findOne({
            where: { id }, 
            relations: { destinatario: true },
        });

        if (!mensagem) throw new NotFoundException('Mensagem não encontrada.');

        if (mensagem.destinatario?.id !== usuarioLogado.id) {
            throw new ForbiddenException('Você não tem permissão para marcar esta mensagem como lida.');
        }

        if (!mensagem.lida) {
            mensagem.lida = true;
            return await this.mensagemRepository.save(mensagem);
        }
        return mensagem;
    }
}