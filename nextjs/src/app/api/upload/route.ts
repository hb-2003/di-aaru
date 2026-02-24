import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/utils/media';
import { authMiddleware } from '@/lib/utils/auth';
import { Errors } from '@/lib/utils/errors';

export async function POST(req: NextRequest) {
  const authError = authMiddleware(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'diaaru';

    if (!file) {
      return Errors.badRequest('No file uploaded');
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const media = await uploadToCloudinary(fileBase64, folder);

    return NextResponse.json({ data: media });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return Errors.internal(error.message);
  }
}
