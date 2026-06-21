import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { MensagensService } from './mensagens.service';
import { MensagensController } from './mensagens.controller';
import { Mensagem } from './entities/mensagem.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mensagem]), 
    ],
    controllers: [MensagensController],
    providers: [MensagensService],
    exports: [MensagensService],
})
export class MensagensModule {}