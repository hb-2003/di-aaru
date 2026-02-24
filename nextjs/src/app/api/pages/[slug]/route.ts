import { NextRequest, NextResponse } from 'next/server';
import { getPageBySlug, updatePage, deletePage } from '@/lib/services/pages';
import { UpdatePageSchema } from '@/lib/validations/page';
import { authMiddleware } from '@/lib/utils/auth';
import { getStatusFilter } from '@/lib/utils/draft-filter';
import { Errors } from '@/lib/utils/errors';

interface SlugContext {
  params: { slug: string } | Promise<{ slug: string }>;
}

export async function GET(
  req: NextRequest,
  context: SlugContext
) {
  const { slug } = (await context.params) as { slug: string };
  try {
    const status = getStatusFilter(req);
    const page = await getPageBySlug(slug, status);

    if (!page) {
      return Errors.notFound('Page not found');
    }

    return NextResponse.json({ data: page });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}

export async function PUT(
  req: NextRequest,
  context: SlugContext
) {
  const { slug } = (await context.params) as { slug: string };
  const authError = authMiddleware(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const result = UpdatePageSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const page = await updatePage(slug, result.data.data);
    if (!page) {
      return Errors.notFound('Page not found');
    }

    return NextResponse.json({ data: page });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  context: SlugContext
) {
  const { slug } = (await context.params) as { slug: string };
  const authError = authMiddleware(req);
  if (authError) return authError;

  try {
    const success = await deletePage(slug);

    if (!success) {
      return Errors.notFound('Page not found');
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
