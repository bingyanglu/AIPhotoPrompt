import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseServiceClient, isSupabaseServiceConfigured } from '@/lib/supabase/client'
import { getAdminSessionCookieName, verifyAdminSessionToken } from '@/lib/auth/admin-session'

const REQUIRED_FIELDS = ['slug', 'title', 'template', 'category', 'difficulty'] as const
type RequiredField = (typeof REQUIRED_FIELDS)[number]

export async function POST(request: Request) {
  if (!isSupabaseServiceConfigured) {
    return NextResponse.json({ success: false, message: 'Service role key not configured' }, { status: 500 })
  }

  try {
    const sessionCookie = cookies().get(getAdminSessionCookieName())?.value
    const session = await verifyAdminSessionToken(sessionCookie)

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

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
