import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Page } from "./Page";

@Entity("page_sections")
export class PageSection {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  type!: string;

  @Column({ type: "jsonb" })
  content!: any;

  @Column({ type: "integer", default: 0 })
  order!: number;

  @Column({ name: "is_show", type: "boolean", default: true })
  isShow!: boolean;

  @ManyToOne(() => Page, (page: Page) => page.sections, { onDelete: "CASCADE" })
  @JoinColumn({ name: "page_id" })
  page!: Relation<Page>;

  @Column({ name: "page_id", type: "uuid" })
  pageId!: string;
}
