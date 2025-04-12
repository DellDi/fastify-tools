import { NextRequest, NextResponse } from 'next/server';
import { jwt } from '@/utils/auth/jwt';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

export async function POST(req: NextRequest) {
  const refreshToken = getRefreshTokenFromCookies();

  if (!refreshToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as User;
    const newAccessToken = generateAccessToken(decoded);
    const newRefreshToken = generateRefreshToken(decoded);
    setRefreshTokenToCookies(newRefreshToken);

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
