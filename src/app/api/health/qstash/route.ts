import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.QSTASH_TOKEN || process.env.UPSTASH_QSTASH_TOKEN || process.env.STASH_TOKEN
  const hasToken = !!token
  const tokenPreview = token ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}` : null

  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY

  return NextResponse.json({
    qstash: {
      token: {
        present: hasToken,
        preview: tokenPreview,
        length: token ? token.length : 0,
      },
      signingKeys: {
        currentPresent: !!currentKey,
        nextPresent: !!nextKey,
      },
    },
  })
}
