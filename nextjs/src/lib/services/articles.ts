import { AppDataSource, initializeDatabase } from '../db/config';
import { Article } from '../db/models/Article';
import { Author } from '../db/models/Author';
import { Category } from '../db/models/Category';
import { generateUniqueSlug } from '../utils/slugify';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export async function listArticles(options: {
  status?: "draft" | "published";
  limit?: number;
  offset?: number;
  sort?: string;
  populate?: string[];
}) {
  await initializeDatabase();
  const { status, limit, offset, sort, populate = [] } = options;

  const where: FindOptionsWhere<Article> = {};
  if (status !== undefined) where.status = status;

  let order: FindOptionsOrder<Article> = { createdAt: "DESC" };
  if (sort) {
    const [field, direction] = sort.split(':');
    order = { [field]: direction.toUpperCase() } as any;
  }

  const relations: string[] = [];
  if (populate.includes('author')) relations.push('author');
  if (populate.includes('category')) relations.push('category');

  const repository = AppDataSource.getRepository('Article');
  const [items, total] = await repository.find({
    where,
    take: limit,
    skip: offset,
    order,
    relations,
  }).then(res => [res, res.length]); // findAndCount with relations might need careful handling in TypeORM depending on versions

  const count = await repository.count({ where });

  return { data: items, total: count };
}

export async function getArticleBySlug(slug: string, options: { status?: "draft" | "published"; populate?: string[] } = {}) {
  await initializeDatabase();
  const { status, populate = [] } = options;
  const where: FindOptionsWhere<Article> = { slug };
  if (status !== undefined) where.status = status;

  const relations: string[] = [];
  if (populate.includes('author')) relations.push('author');
  if (populate.includes('category')) relations.push('category');

  const repository = AppDataSource.getRepository('Article');
  return await repository.findOne({ where, relations });
}

export async function createArticle(data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Article');
  if (!data.slug) {
    data.slug = await generateUniqueSlug('Article', data.title);
  }
  const article = repository.create(data);
  return await repository.save(article);
}

export async function updateArticle(slug: string, data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Article');
  const article = await repository.findOne({ where: { slug } });
  if (!article) return null;

  if (data.title && !data.slug && data.title !== article.title) {
    data.slug = await generateUniqueSlug('Article', data.title, article.id);
  }

  Object.assign(article, data);
  return await repository.save(article);
}

export async function deleteArticle(slug: string) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Article');
  const article = await repository.findOne({ where: { slug } });
  if (!article) return false;

  await repository.remove(article);
  return true;
}
