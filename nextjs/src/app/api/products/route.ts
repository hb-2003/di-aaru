import { NextRequest, NextResponse } from 'next/server';
import { listProducts, createProduct } from '@/lib/services/products';
import { CreateProductSchema } from '@/lib/validations/product';
import { authMiddleware } from '@/lib/utils/auth';
import { getStatusFilter } from '@/lib/utils/draft-filter';
import { Errors } from '@/lib/utils/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const isShow = searchParams.get('filters[isShow]') === 'true' ? true :
                   searchParams.get('filters[isShow]') === 'false' ? false : undefined;
    const featured = searchParams.get('filters[featured]') === 'true' ? true :
                     searchParams.get('filters[featured]') === 'false' ? false : undefined;

    const status = getStatusFilter(req);
    const limit = parseInt(searchParams.get('pageSize') || '25');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;
    const sort = searchParams.get('sort') || undefined;

    const { data, total } = await listProducts({
      status,
      isShow,
      featured,
      limit,
      offset,
      sort,
    });

    return NextResponse.json({
      data,
      meta: {
        pagination: {
          page,
          pageSize: limit,
          pageCount: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}

export async function POST(req: NextRequest) {
  const authError = authMiddleware(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const result = CreateProductSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const product = await createProduct(result.data.data);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
