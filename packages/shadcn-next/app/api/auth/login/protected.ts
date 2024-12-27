// (受保护的 API 示例):
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const user = verifyAccessToken(token);

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.json({ user });
}
