import { NextRequest, NextResponse } from 'next/server';
import { getAuthorById, updateAuthor, deleteAuthor } from '@/lib/services/authors';
import { UpdateAuthorSchema } from '@/lib/validations/author';
import { authMiddleware } from '@/lib/utils/auth';
import { Errors } from '@/lib/utils/errors';

interface IdContext {
  params: { id: string } | Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest,
  context: IdContext
) {
  const { id } = (await context.params) as { id: string };
  try {
    const author = await getAuthorById(id);

    if (!author) {
      return Errors.notFound('Author not found');
    }

    return NextResponse.json({ data: author });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}

export async function PUT(
  req: NextRequest,
  context: IdContext
) {
  const { id } = (await context.params) as { id: string };
  const authError = authMiddleware(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const result = UpdateAuthorSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const author = await updateAuthor(id, result.data.data);
    if (!author) {
      return Errors.notFound('Author not found');
    }

    return NextResponse.json({ data: author });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  context: IdContext
) {
  const { id } = (await context.params) as { id: string };
  const authError = authMiddleware(req);
  if (authError) return authError;

  try {
    const success = await deleteAuthor(id);

    if (!success) {
      return Errors.notFound('Author not found');
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
