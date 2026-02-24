import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771923169246 implements MigrationInterface {
    name = 'Migration1771923169246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, "price" numeric(10,2), "diamond_type" "public"."products_diamond_type_enum", "carat" numeric(6,2), "shape" character varying(100), "images" jsonb NOT NULL DEFAULT '[]', "featured" boolean NOT NULL DEFAULT false, "is_show" boolean NOT NULL DEFAULT true, "status" "public"."products_status_enum" NOT NULL DEFAULT 'draft', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "page_sections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(255) NOT NULL, "content" jsonb NOT NULL, "order" integer NOT NULL DEFAULT '0', "is_show" boolean NOT NULL DEFAULT true, "page_id" uuid NOT NULL, CONSTRAINT "PK_febb265da4ebfa7cf6bb0e732b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "seo_title" character varying(255), "seo_description" text, "status" "public"."pages_status_enum" NOT NULL DEFAULT 'draft', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe66ca6a86dc94233e5d7789535" UNIQUE ("slug"), CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "globals" ("id" integer NOT NULL DEFAULT '1', "site_name" character varying(255) NOT NULL, "favicon" jsonb, "site_description" text NOT NULL, "top_bar_message" text, "top_bar_phone" character varying(50), "top_bar_email" character varying(255), "default_seo" jsonb, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d989dd9e031494b708da4f213bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "about_blocks" ("id" uuid NOT NULL, "type" character varying(255) NOT NULL, "content" jsonb NOT NULL, "order" integer NOT NULL DEFAULT '0', "is_show" boolean NOT NULL DEFAULT true, "about_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_700584d162dd6af596f7cf22249" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "abouts" ("id" integer NOT NULL DEFAULT '1', "title" character varying(255), "email" character varying(255), "phone" character varying(50), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_26b459c708a47f213dc76c451f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "public_id" character varying(500) NOT NULL, "url" text NOT NULL, "format" character varying(20), "width" integer, "height" integer, "bytes" integer, "resource_type" character varying(20), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "page_sections" ADD CONSTRAINT "FK_fd4e1044ed2cd7886b8b57954c1" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "about_blocks" ADD CONSTRAINT "FK_0e587dd447232ef209b2b798fa1" FOREIGN KEY ("about_id") REFERENCES "abouts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "about_blocks" DROP CONSTRAINT "FK_0e587dd447232ef209b2b798fa1"`);
        await queryRunner.query(`ALTER TABLE "page_sections" DROP CONSTRAINT "FK_fd4e1044ed2cd7886b8b57954c1"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "abouts"`);
        await queryRunner.query(`DROP TABLE "about_blocks"`);
        await queryRunner.query(`DROP TABLE "globals"`);
        await queryRunner.query(`DROP TABLE "pages"`);
        await queryRunner.query(`DROP TABLE "page_sections"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
