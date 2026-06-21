import { MigrationInterface, QueryRunner } from "typeorm";

export class CriarTabelasIniciais1781742589455 implements MigrationInterface {
    name = 'CriarTabelasIniciais1781742589455'

public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."usuarios_perfil_enum" AS ENUM('administrador', 'usuario_padrao')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "nome" character varying NOT NULL, "perfil" "public"."usuarios_perfil_enum" NOT NULL DEFAULT 'usuario_padrao', "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mensagens" ("id" SERIAL NOT NULL, "conteudo" text NOT NULL, "lida" boolean NOT NULL DEFAULT false, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "remetenteId" integer, "destinatarioId" integer, CONSTRAINT "PK_c2ba5218f1bff3363548479d2f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mensagens" ADD CONSTRAINT "FK_0a80b4eb66e59c4d5ac535ffc5a" FOREIGN KEY ("remetenteId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mensagens" ADD CONSTRAINT "FK_cdd8e5d741acf0307add43ed939" FOREIGN KEY ("destinatarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mensagens" DROP CONSTRAINT IF EXISTS "FK_cdd8e5d741acf0307add43ed939"`);
        await queryRunner.query(`ALTER TABLE "mensagens" DROP CONSTRAINT IF EXISTS "FK_0a80b4eb66e59c4d5ac535ffc5a"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "mensagens"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "usuarios"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."usuarios_perfil_enum"`);
    }

}
