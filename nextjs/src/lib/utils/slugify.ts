import slugify from 'slugify';
import { EntityTarget, Not, ObjectLiteral } from 'typeorm';
import { AppDataSource } from '../db/config';

export async function generateUniqueSlug(
  entity: EntityTarget<ObjectLiteral>,
  source: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(source, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  const repository = AppDataSource.getRepository(entity);

  while (true) {
    const where: any = { slug };
    if (excludeId) {
      where.id = Not(excludeId);
    }

    const existing = await repository.findOne({ where });
    if (!existing) {
      break;
    }

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}
