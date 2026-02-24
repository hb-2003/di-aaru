import { NextRequest, NextResponse } from 'next/server';
import { listAuthors, createAuthor } from '@/lib/services/authors';
import { CreateAuthorSchema } from '@/lib/validations/author';
import { authMiddleware } from '@/lib/utils/auth';
import { Errors } from '@/lib/utils/errors';

export async function GET() {
  try {
    const authors = await listAuthors();
    return NextResponse.json({ data: authors });
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
    const result = CreateAuthorSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const author = await createAuthor(result.data.data);
    return NextResponse.json({ data: author }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
