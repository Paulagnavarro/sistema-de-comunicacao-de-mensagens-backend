import { DataSource } from 'typeorm';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Mensagem } from './mensagens/entities/mensagem.entity';

// Configuração da conexão com o banco de dados PostgreSQL usando o TypeORM
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'mensageria_db',
  synchronize: false,
  entities: [Usuario, Mensagem],
  migrations: ['src/migrations/*.ts'],
});