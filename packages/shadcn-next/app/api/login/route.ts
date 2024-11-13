import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🚀 ~ file:route.ts, line:4-----', request.method)
  return NextResponse.json({ message: 'Hello, World!' })
}
