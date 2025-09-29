import { NextResponse } from 'next/server'
import { getSupabaseServiceClient, isSupabaseServiceConfigured } from '@/lib/supabase/client'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function POST(_request: Request, context: RouteParams) {
  const { slug } = await context.params

  if (!isSupabaseServiceConfigured) {
    return NextResponse.json({ success: false, reason: 'supabase service role key not configured' }, { status: 200 })
  }
  if (!slug) {
    return NextResponse.json({ success: false, reason: 'missing slug' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServiceClient()

    const { data, error } = await supabase
      .from('prompts')
      .select('copy_count')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.error('Supabase copy count fetch error:', error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ success: false, reason: 'prompt not found' }, { status: 404 })
    }

    const nextCount = (data.copy_count ?? 0) + 1

    const { error: updateError } = await supabase
      .from('prompts')
      .update({ copy_count: nextCount })
      .eq('slug', slug)

    if (updateError) {
      console.error('Supabase copy count update error:', updateError)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true, copyCount: nextCount })
  } catch (error) {
    console.error('Unexpected copy count error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
