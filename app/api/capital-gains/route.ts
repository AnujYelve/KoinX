import { NextResponse } from 'next/server'


export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({
    capitalGains: {
      stcg: { profits: 4049.48, losses: 32127.03 },
      ltcg: { profits: 0, losses: 0 },
    },
  })
}
