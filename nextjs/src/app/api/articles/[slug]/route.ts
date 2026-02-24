import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug, updateArticle, deleteArticle } from '@/lib/services/articles';
import { UpdateArticleSchema } from '@/lib/validations/article';
import { authMiddleware } from '@/lib/utils/auth';
import { getStatusFilter } from '@/lib/utils/draft-filter';
import { parsePopulate } from '@/lib/utils/populate';
import { Errors } from '@/lib/utils/errors';

// type to capture the dynamic slug param; it may be a Promise in Next's
// generated context type for dynamic routes, so we accept both forms.
interface SlugContext {
  params: { slug: string } | Promise<{ slug: string }>;
}

export async function GET(
  req: NextRequest,
  context: SlugContext
) {
  // normalize params since they might be promised
  const { slug } = (await context.params) as { slug: string };
  try {
    const { searchParams } = new URL(req.url);
    const status = getStatusFilter(req);
    const populate = parsePopulate(searchParams.get('populate'));

    const article = await getArticleBySlug(slug, { status, populate });

    if (!article) {
      return Errors.notFound('Article not found');
    }

    return NextResponse.json({ data: article });
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
    const result = UpdateArticleSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const article = await updateArticle(slug, result.data.data);
    if (!article) {
      return Errors.notFound('Article not found');
    }

    return NextResponse.json({ data: article });
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
    const success = await deleteArticle(slug);

    if (!success) {
      return Errors.notFound('Article not found');
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
