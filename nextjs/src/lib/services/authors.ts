import { AppDataSource, initializeDatabase } from '../db/config';
import { Author } from '../db/models/Author';

export async function listAuthors() {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Author');
  return await repository.find({
    order: { name: "ASC" },
  });
}

export async function getAuthorById(id: string) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Author');
  return await repository.findOne({ where: { id } });
}

export async function createAuthor(data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Author');
  const author = repository.create(data);
  return await repository.save(author);
}

export async function updateAuthor(id: string, data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Author');
  const author = await repository.findOne({ where: { id } });
  if (!author) return null;
  Object.assign(author, data);
  return await repository.save(author);
}

export async function deleteAuthor(id: string) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Author');
  const author = await repository.findOne({ where: { id } });
  if (!author) return false;
  await repository.remove(author);
  return true;
}
