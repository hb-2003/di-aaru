import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, updateProduct, deleteProduct } from '@/lib/services/products';
import { UpdateProductSchema } from '@/lib/validations/product';
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
    const product = await getProductBySlug(slug, status);

    if (!product) {
      return Errors.notFound('Product not found');
    }

    return NextResponse.json({ data: product });
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
    const result = UpdateProductSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const product = await updateProduct(slug, result.data.data);
    if (!product) {
      return Errors.notFound('Product not found');
    }

    return NextResponse.json({ data: product });
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
    const success = await deleteProduct(slug);

    if (!success) {
      return Errors.notFound('Product not found');
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
