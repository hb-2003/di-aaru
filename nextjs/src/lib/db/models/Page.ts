import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { PageSection } from "./PageSection";

@Entity("pages")
export class Page {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ name: "seo_title", type: "varchar", length: 255, nullable: true })
  seoTitle!: string | null;

  @Column({ name: "seo_description", type: "text", nullable: true })
  seoDescription!: string | null;

  @OneToMany(() => PageSection, (section) => section.page, { cascade: true })
  sections!: Relation<PageSection[]>;

  @Column({
    type: "enum",
    enum: ["draft", "published"],
    default: "draft"
  })
  status!: "draft" | "published";

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
