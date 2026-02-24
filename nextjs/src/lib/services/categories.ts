import { AppDataSource, initializeDatabase } from '../db/config';
import { Category } from '../db/models/Category';
import { generateUniqueSlug } from '../utils/slugify';

export async function listCategories() {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Category');
  return await repository.find({
    order: { name: "ASC" },
  });
}

export async function getCategoryBySlug(slug: string) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Category');
  return await repository.findOne({ where: { slug } });
}

export async function createCategory(data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Category');
  if (!data.slug) {
    data.slug = await generateUniqueSlug('Category', data.name);
  }
  const category = repository.create(data);
  return await repository.save(category);
}

export async function updateCategory(slug: string, data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Category');
  const category = await repository.findOne({ where: { slug } });
  if (!category) return null;

  if (data.name && !data.slug && data.name !== category.name) {
    data.slug = await generateUniqueSlug('Category', data.name, category.id);
  }

  Object.assign(category, data);
  return await repository.save(category);
}

export async function deleteCategory(slug: string) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Category');
  const category = await repository.findOne({ where: { slug } });
  if (!category) return false;
  await repository.remove(category);
  return true;
}
