import { NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/utils/auth';
import { initializeDatabase, AppDataSource } from '@/lib/db/config';
import { Product } from '@/lib/db/models/Product';
import { Page } from '@/lib/db/models/Page';
import { Media } from '@/lib/db/models/Media';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const authError = authMiddleware(req);
  if (authError) return authError;

  try {
    await initializeDatabase();

    const [
      productCount,
      publishedProducts,
      pageCount,
      publishedPages,
      mediaCount,
    ] = await Promise.all([
      AppDataSource.getRepository('Product').count(),
      AppDataSource.getRepository('Product').count({ where: { status: 'published' } }),
      AppDataSource.getRepository('Page').count(),
      AppDataSource.getRepository('Page').count({ where: { status: 'published' } }),
      AppDataSource.getRepository('Media').count(),
    ]);

    const recentProducts = await AppDataSource.getRepository('Product').find({
      order: { updatedAt: 'DESC' },
      take: 5,
    });

    const recentPages = await AppDataSource.getRepository('Page').find({
      order: { updatedAt: 'DESC' },
      take: 5,
    });

    return NextResponse.json({
      data: {
        counts: {
          products: { total: productCount, published: publishedProducts },
          pages: { total: pageCount, published: publishedPages },
          media: { total: mediaCount },
        },
        recent: {
          products: recentProducts,
          pages: recentPages,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { status: 500, message: error.message } },
      { status: 500 }
    );
  }
}
