import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug, updateCategory, deleteCategory } from '@/lib/services/categories';
import { UpdateCategorySchema } from '@/lib/validations/category';
import { authMiddleware } from '@/lib/utils/auth';
import { Errors } from '@/lib/utils/errors';

// dynamic slug can come as a Promise in Next's context type
interface SlugContext {
  params: { slug: string } | Promise<{ slug: string }>;
}

export async function GET(
  req: NextRequest,
  context: SlugContext
) {
  const { slug } = (await context.params) as { slug: string };
  try {
    const category = await getCategoryBySlug(slug);

    if (!category) {
      return Errors.notFound('Category not found');
    }

    return NextResponse.json({ data: category });
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
    const result = UpdateCategorySchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const category = await updateCategory(slug, result.data.data);
    if (!category) {
      return Errors.notFound('Category not found');
    }

    return NextResponse.json({ data: category });
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
    const success = await deleteCategory(slug);

    if (!success) {
      return Errors.notFound('Category not found');
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
