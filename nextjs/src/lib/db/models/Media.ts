import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("media")
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "public_id", type: "varchar", length: 500 })
  publicId!: string;

  @Column({ type: "text" })
  url!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  format!: string | null;

  @Column({ type: "integer", nullable: true })
  width!: number | null;

  @Column({ type: "integer", nullable: true })
  height!: number | null;

  @Column({ type: "integer", nullable: true })
  bytes!: number | null;

  @Column({ name: "resource_type", type: "varchar", length: 20, nullable: true })
  resourceType!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
