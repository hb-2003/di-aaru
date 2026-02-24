import { NextRequest, NextResponse } from 'next/server';
import { getAboutContent, updateAboutContent } from '@/lib/services/singleTypes';
import { UpdateAboutSchema } from '@/lib/validations/about';
import { authMiddleware } from '@/lib/utils/auth';
import { Errors } from '@/lib/utils/errors';

export async function GET() {
  try {
    const content = await getAboutContent();
    return NextResponse.json({ data: content });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}

export async function PUT(req: NextRequest) {
  const authError = authMiddleware(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const result = UpdateAboutSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const content = await updateAboutContent(result.data.data);
    return NextResponse.json({ data: content });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
