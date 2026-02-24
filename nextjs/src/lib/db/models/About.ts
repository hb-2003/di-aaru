import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { AboutBlock } from "./AboutBlock";

@Entity("abouts")
export class About {
  @PrimaryColumn({ type: "integer", default: 1 })
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  title!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone!: string | null;

  @OneToMany(() => AboutBlock, (block) => block.about, {
    cascade: true,
    eager: true, // Load blocks by default
  })
  blocks!: Relation<AboutBlock[]>;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
