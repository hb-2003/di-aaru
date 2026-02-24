import { NextRequest, NextResponse } from 'next/server';
import { listPages, createPage } from '@/lib/services/pages';
import { CreatePageSchema } from '@/lib/validations/page';
import { authMiddleware } from '@/lib/utils/auth';
import { getStatusFilter } from '@/lib/utils/draft-filter';
import { Errors } from '@/lib/utils/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = getStatusFilter(req);
    const limit = parseInt(searchParams.get('pageSize') || '25');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    const { data, total } = await listPages({
      status,
      limit,
      offset,
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
    const result = CreatePageSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const page = await createPage(result.data.data);
    return NextResponse.json({ data: page }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
