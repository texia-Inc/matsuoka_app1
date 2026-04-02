import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  year_month: z.string().regex(/^\d{4}-\d{2}$/),
  goal: z.string().max(500).optional().default(''),
  reflection: z.string().max(1000).optional().default(''),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('year_month', { ascending: false })

  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const { year_month, goal, reflection } = parsed.data

  const { data, error } = await supabase
    .from('goals')
    .upsert(
      { user_id: user.id, year_month, goal, reflection, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,year_month' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
