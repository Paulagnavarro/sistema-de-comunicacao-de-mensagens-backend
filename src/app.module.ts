import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MensagensModule } from './mensagens/mensagens.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        
        // Conexão principal com o banco Postgres usando variáveis de ambiente
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: 'postgres',
            password: process.env.DB_PASSWORD || 'password123',
            database: process.env.DB_DATABASE || 'mensageria_db',
            entities: [__dirname + '/**/*.entity.{js,ts}'],
            synchronize: false, 
            migrations: [__dirname + '/migrations/*.{js,ts}'], 
            migrationsRun: true, 
        }),
        UsuariosModule,
        MensagensModule,
        AuthModule,
    ],
})
export class AppModule {}