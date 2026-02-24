import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Admin credentials from environment or defaults
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (!username || !password || username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: { status: 401, message: 'Invalid username or password' } },
        { status: 401 }
      );
    }

    // Generate a simple session token
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

    return NextResponse.json({ data: { authenticated: true, token } });
  } catch {
    return NextResponse.json(
      { error: { status: 400, message: 'Bad request' } },
      { status: 400 }
    );
  }
}
