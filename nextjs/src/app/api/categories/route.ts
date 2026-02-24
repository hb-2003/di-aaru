import { NextRequest, NextResponse } from 'next/server';
import { listCategories, createCategory } from '@/lib/services/categories';
import { CreateCategorySchema } from '@/lib/validations/category';
import { authMiddleware } from '@/lib/utils/auth';
import { Errors } from '@/lib/utils/errors';

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json({ data: categories });
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
    const result = CreateCategorySchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const category = await createCategory(result.data.data);
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
