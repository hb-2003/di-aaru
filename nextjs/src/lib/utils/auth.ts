import { NextRequest, NextResponse } from 'next/server';

const API_SECRET_KEY = process.env.API_SECRET_KEY;

export function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  return token === API_SECRET_KEY;
}

export function authMiddleware(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json(
      {
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Missing or invalid API key',
        },
      },
      { status: 401 }
    );
  }
  return null;
}
