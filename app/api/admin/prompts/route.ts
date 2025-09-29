import { NextResponse } from 'next/server'
import { getSupabaseServiceClient, isSupabaseServiceConfigured } from '@/lib/supabase/client'

const REQUIRED_FIELDS = ['slug', 'title', 'template', 'category', 'difficulty'] as const
type RequiredField = (typeof REQUIRED_FIELDS)[number]

export async function POST(request: Request) {
  if (!isSupabaseServiceConfigured) {
    return NextResponse.json({ success: false, message: 'Service role key not configured' }, { status: 500 })
  }

  const adminToken = process.env.ADMIN_ACCESS_TOKEN
  if (!adminToken) {
    return NextResponse.json({ success: false, message: 'ADMIN_ACCESS_TOKEN not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const token = body.token || request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token || token !== adminToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const missingField = REQUIRED_FIELDS.find((field) => !body[field]) as RequiredField | undefined
    if (missingField) {
      return NextResponse.json({ success: false, message: `Missing field: ${missingField}` }, { status: 400 })
    }

    const supabase = getSupabaseServiceClient()

    const { data: categoryData, error: categoryError } = await supabase
      .from('prompt_categories')
      .select('id')
      .eq('slug', body.category)
      .maybeSingle()

    if (categoryError || !categoryData) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 400 })
    }

    const { error } = await supabase.from('prompts').insert({
      slug: body.slug,
      title: body.title,
      description: body.description ?? '',
      template: body.template,
      cover_image: body.coverImage ?? null,
      category_id: categoryData.id,
      use_case: body.useCase ?? null,
      difficulty: body.difficulty,
      tags: Array.isArray(body.tags) ? body.tags : null,
      featured: Boolean(body.featured),
      copy_count: body.copyCount ?? 0
    })

    if (error) {
      console.error('[admin] failed to insert prompt', error)
      return NextResponse.json({ success: false, message: 'Database insert failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin] unexpected error inserting prompt', error)
    return NextResponse.json({ success: false, message: 'Unexpected error' }, { status: 500 })
  }
}
