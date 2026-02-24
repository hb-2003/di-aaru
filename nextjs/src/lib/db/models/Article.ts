import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Author } from "./Author";
import { Category } from "./Category";

@Entity("articles")
export class Article {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "jsonb", nullable: true })
  cover!: any;

  @Column({ type: "jsonb", default: [] })
  blocks!: any[];

  @Column({
    type: "enum",
    enum: ["draft", "published"],
    default: "draft"
  })
  status!: "draft" | "published";

  @ManyToOne(() => Author, (author) => author.articles, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "author_id" })
  author!: Relation<Author>;

  @Column({ name: "author_id", type: "uuid", nullable: true })
  authorId!: string;

  @ManyToOne(() => Category, (category) => category.articles, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "category_id" })
  category!: Relation<Category>;

  @Column({ name: "category_id", type: "uuid", nullable: true })
  categoryId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
