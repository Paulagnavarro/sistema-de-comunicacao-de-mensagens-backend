import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class SeedUsuariosDeTeste1781743825704 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const senhaAdminHash = await bcrypt.hash('admin123', 10);
        const senhaPadraoHash = await bcrypt.hash('usuario123', 10);

        await queryRunner.query(`
            INSERT INTO "usuarios" ("email", "senha", "nome", "perfil")
            VALUES ('admin@teste.com', '${senhaAdminHash}', 'Teste Administrador', 'administrador')
        `);

        await queryRunner.query(`
            INSERT INTO "usuarios" ("email", "senha", "nome", "perfil")
            VALUES ('usuario@teste.com', '${senhaPadraoHash}', 'Teste Usuário Padrão', 'usuario_padrao')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "usuarios" WHERE "email" IN ('admin@teste.com', 'usuario@teste.com')`);
    }
}
