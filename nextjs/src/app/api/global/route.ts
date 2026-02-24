import { NextRequest, NextResponse } from 'next/server';
import { getGlobalSettings, updateGlobalSettings } from '@/lib/services/singleTypes';
import { UpdateGlobalSchema } from '@/lib/validations/global';
import { authMiddleware } from '@/lib/utils/auth';
import { Errors } from '@/lib/utils/errors';

export async function GET() {
  try {
    const settings = await getGlobalSettings();
    return NextResponse.json({ data: settings });
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
    const result = UpdateGlobalSchema.safeParse(body);

    if (!result.success) {
      return Errors.validation(result.error.flatten());
    }

    const settings = await updateGlobalSettings(result.data.data);
    return NextResponse.json({ data: settings });
  } catch (error: any) {
    console.error('API Error:', error);
    return Errors.internal(error.message);
  }
}
