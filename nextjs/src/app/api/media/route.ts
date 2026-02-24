import { NextResponse } from 'next/server';
import cloudinary from '@/lib/utils/media';

export async function GET() {
    try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            return NextResponse.json({
                data: [],
                message: 'Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file.',
            });
        }

        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'diaaru',
            max_results: 100,
        });

        const data = result.resources.map((r: any) => ({
            id: r.asset_id,
            publicId: r.public_id,
            url: r.secure_url,
            format: r.format,
            width: r.width,
            height: r.height,
            bytes: r.bytes,
            resourceType: r.resource_type,
            createdAt: r.created_at,
        }));

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Media API Error:', error?.message || error);
        return NextResponse.json({
            data: [],
            message: error?.message || 'Failed to fetch media',
        });
    }
}
