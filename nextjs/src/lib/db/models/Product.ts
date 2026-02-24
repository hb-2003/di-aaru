import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price!: number | null;

  @Column({
    name: "diamond_type",
    type: "enum",
    enum: ["Lab Grown", "Natural"],
    nullable: true
  })
  diamondType!: "Lab Grown" | "Natural" | null;

  @Column({ type: "decimal", precision: 6, scale: 2, nullable: true })
  carat!: number | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  shape!: string | null;

  @Column({ type: "jsonb", default: [] })
  images!: any[];

  @Column({ type: "boolean", default: false })
  featured!: boolean;

  @Column({ name: "is_show", type: "boolean", default: true })
  isShow!: boolean;

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
