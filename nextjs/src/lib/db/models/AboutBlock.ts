import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { About } from "./About";

@Entity("about_blocks")
export class AboutBlock {
  @PrimaryColumn({ type: "uuid" }) // PrimaryColumn with uuid type
  id!: string;

  @Column({ type: "varchar", length: 255 })
  type!: string;

  @Column({ type: "jsonb" })
  content!: any;

  @Column({ type: "integer", default: 0 })
  order!: number;

  @Column({ name: "is_show", type: "boolean", default: true })
  isShow!: boolean;

  @ManyToOne(() => About, (about: About) => about.blocks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "about_id" })
  about!: Relation<About>;

  @Column({ name: "about_id", type: "integer" })
  aboutId!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
