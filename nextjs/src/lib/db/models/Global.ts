import { Entity, PrimaryColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("globals")
export class Global {
  @PrimaryColumn({ type: "integer", default: 1 })
  id!: number;

  @Column({ name: "site_name", type: "varchar", length: 255 })
  siteName!: string;

  @Column({ type: "jsonb", nullable: true })
  favicon!: any | null;

  @Column({ name: "site_description", type: "text" })
  siteDescription!: string;

  @Column({ name: "top_bar_message", type: "text", nullable: true })
  topBarMessage!: string | null;

  @Column({ name: "top_bar_phone", type: "varchar", length: 50, nullable: true })
  topBarPhone!: string | null;

  @Column({ name: "top_bar_email", type: "varchar", length: 255, nullable: true })
  topBarEmail!: string | null;

  @Column({ name: "default_seo", type: "jsonb", nullable: true })
  defaultSeo!: any | null;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
