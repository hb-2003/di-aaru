import { AppDataSource, initializeDatabase } from '../db/config';
import { Product } from '../db/models/Product';
import { generateUniqueSlug } from '../utils/slugify';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export async function listProducts(options: {
  status?: "draft" | "published";
  isShow?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sort?: string;
}) {
  await initializeDatabase();
  const { status, isShow, featured, limit, offset, sort } = options;

  const where: FindOptionsWhere<Product> = {};
  if (status !== undefined) where.status = status;
  if (isShow !== undefined) where.isShow = isShow;
  if (featured !== undefined) where.featured = featured;

  let order: FindOptionsOrder<Product> = { createdAt: "DESC" };
  if (sort) {
    const [field, direction] = sort.split(':');
    order = { [field]: direction.toUpperCase() } as any;
  }

  const repository = AppDataSource.getRepository('Product');
  const [items, total] = await repository.findAndCount({
    where,
    take: limit,
    skip: offset,
    order,
  });

  return { data: items, total };
}

export async function getProductBySlug(slug: string, status?: "draft" | "published") {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Product');
  const where: FindOptionsWhere<Product> = { slug };
  if (status !== undefined) where.status = status;

  return await repository.findOne({ where });
}

export async function createProduct(data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Product');
  if (!data.slug) {
    data.slug = await generateUniqueSlug('Product', data.name);
  }
  const product = repository.create(data);
  return await repository.save(product);
}

export async function updateProduct(slug: string, data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Product');
  const product = await repository.findOne({ where: { slug } });
  if (!product) return null;

  if (data.name && !data.slug && data.name !== product.name) {
    data.slug = await generateUniqueSlug('Product', data.name, product.id);
  }

  Object.assign(product, data);
  return await repository.save(product);
}

export async function deleteProduct(slug: string) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Product');
  const product = await repository.findOne({ where: { slug } });
  if (!product) return false;

  await repository.remove(product);
  return true;
}
