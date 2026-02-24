import { AppDataSource, initializeDatabase } from '../db/config';
import { Global } from '../db/models/Global';
import { About } from '../db/models/About';

// Convert TypeORM entity instances to plain serializable objects
const toPlain = <T>(entity: T): T => JSON.parse(JSON.stringify(entity));

export async function getGlobalSettings() {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Global');
  let settings = await repository.findOne({ where: { id: 1 } });

  if (!settings) {
    settings = repository.create({
      id: 1,
      siteName: 'Diaaru',
      siteDescription: 'Diaaru Diamond Jewelry',
    });
    await repository.save(settings);
  }

  return toPlain(settings);
}

export async function updateGlobalSettings(data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('Global');
  const settings = await getGlobalSettings();
  Object.assign(settings, data);
  return await repository.save(settings);
}

export async function getAboutContent() {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('About');
  let content = await repository.findOne({
    where: { id: 1 },
    relations: { blocks: true }, // Load blocks relation
    order: {
      blocks: { order: 'ASC' } // Order blocks by order field
    }
  });

  if (!content) {
    content = repository.create({
      id: 1,
      title: 'About Us',
      blocks: [],
    });
    await repository.save(content);
  } else {
    // Map blocks to the format expected by the frontend
    content.blocks = content.blocks.map((block: any) => ({
      ...block.content,
      id: block.id,
      type: block.type,
      isShow: block.isShow,
      order: block.order,
      __component: block.type, // For frontend compatibility
    }));
  }

  return toPlain(content);
}

export async function updateAboutContent(data: any) {
  await initializeDatabase();
  const repository = AppDataSource.getRepository('About');
  const content = await getAboutContent();

  // Transform blocks if they are provided in the input data
  if (data.blocks && Array.isArray(data.blocks)) {
    data.blocks = data.blocks.map((block: any, index: number) => {
      const { type, __component, isShow, id, ...contentData } = block;
      return {
        id: id && id.length === 36 ? id : undefined, // Keep existing UUIDs, generate new ones if missing
        type: type || __component, // Use type or __component for compatibility
        isShow: isShow !== undefined ? isShow : true,
        order: index,
        content: contentData,
      };
    });
  }

  Object.assign(content, data);
  return await repository.save(content);
}
