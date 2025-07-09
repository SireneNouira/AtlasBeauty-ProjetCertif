// app/api/auth/check/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('BEARER')?.value // Modification ici

  return NextResponse.json({
    authenticated: !!token
  })
}

