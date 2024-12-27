import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken, generateRefreshToken, setRefreshTokenToCookies } from '@/lib/auth';
import { User } from '@/types/user';

export async function POST(req: NextRequest) {
  // ... 验证用户凭据 ...
  const user: User = { id: 1, username: 'testuser' }; // 假设验证成功

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  setRefreshTokenToCookies(refreshToken);

  return NextResponse.json({ accessToken });
}
