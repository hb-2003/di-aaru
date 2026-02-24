import { AppDataSource, initializeDatabase } from '../db/config';
import { generateUniqueSlug } from '../utils/slugify';
import { FindOptionsWhere, In } from 'typeorm';
import { Page } from '../db/models/Page';
import { Product } from '../db/models/Product';

// Convert TypeORM entity instances to plain serializable objects
const toPlain = <T>(entity: T): T => JSON.parse(JSON.stringify(entity));

export async function listPages(options: {
  status?: "draft" | "published";
  limit?: number;
  offset?: number;
}) {
  await initializeDatabase();
  const { status, limit, offset } = options;

  const where: FindOptionsWhere<Page> = {};
  if (status !== undefined) where.status = status;

  const repository = AppDataSource.getRepository('Page');
  const [items, total] = await repository.findAndCount({
    where,
    take: limit,
    skip: offset,
    order: { createdAt: "DESC" },
  });

  return { data: toPlain(items), total };
}

export async function getPageBySlug(slug: string, status?: "draft" | "published") {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Page');
  const where: FindOptionsWhere<Page> = { slug };
  if (status !== undefined) where.status = status;

  const page = await repository.findOne({
    where,
    relations: { sections: true },
    order: {
      sections: { order: 'ASC' }
    }
  });
  if (!page) return null;

  // Resolve product-section relations in Dynamic Zones
  if (page.sections && Array.isArray(page.sections)) {
    const productRepository = AppDataSource.getRepository('Product');
    const resolvedSections = await Promise.all(
      page.sections.map(async (section) => {
        // Map relational structure back to what frontend expects if needed,
        // or just resolve nested products.
        // We'll keep the structure consistent for the resolver.
        const sectionData = {
          ...section.content,
          id: section.id,
          type: section.type,
          __component: section.type, // Backwards compatibility for resolver
          isShow: section.isShow
        };

        if (section.type === 'shared.product-section' && sectionData.products && Array.isArray(sectionData.products) && sectionData.products.length > 0) {
          const products = await productRepository.find({
            where: { id: In(sectionData.products) },
          });
          sectionData.products = products;
        }
        return sectionData;
      })
    );
    // @ts-ignore - we're transforming sections for the frontend
    page.sections = resolvedSections;
  }

  return toPlain(page);
}

export async function createPage(data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Page');
  if (!data.slug) {
    data.slug = await generateUniqueSlug(Page, data.title);
  }

  // Transform sections if present
  if (data.sections && Array.isArray(data.sections)) {
    data.sections = data.sections.map((section: any, index: number) => {
      const { type, __component, isShow, id, ...content } = section;
      return {
        id: id && id.length === 36 ? id : undefined, // Only keep valid UUIDs
        type: type || __component,
        isShow: isShow !== undefined ? isShow : true,
        order: index,
        content
      };
    });
  }

  const page = repository.create(data);
  return await repository.save(page);
}

export async function updatePage(slug: string, data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Page');
  const page = await repository.findOne({
    where: { slug },
    relations: { sections: true }
  });
  if (!page) return null;

  if (data.title && !data.slug && data.title !== page.title) {
    data.slug = await generateUniqueSlug(Page, data.title, page.id);
  }

  // Transform sections if present
  if (data.sections && Array.isArray(data.sections)) {
    data.sections = data.sections.map((section: any, index: number) => {
      const { type, __component, isShow, id, ...content } = section;
      return {
        id: id && id.length === 36 ? id : undefined,
        type: type || __component,
        isShow: isShow !== undefined ? isShow : true,
        order: index,
        content
      };
    });
  }

  Object.assign(page, data);
  return await repository.save(page);
}

export async function deletePage(slug: string) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Page');
  const page = await repository.findOne({ where: { slug } });
  if (!page) return false;

  await repository.remove(page);
  return true;
}
