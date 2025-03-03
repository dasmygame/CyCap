import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name, description, tags, avatar, coverImage } = body

    if (!name || !description) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    await connectDB()

    // Generate a unique slug
    const baseSlug = generateSlug(name)
    let slug = baseSlug
    let counter = 1
    
    // Check if slug exists and append number if it does
    while (await Trace.exists({ slug })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const trace = await Trace.create({
      name,
      description,
      slug,
      tags: Array.isArray(tags) ? tags : [],
      avatar,
      coverImage,
      createdBy: session.user.id,
      members: [session.user.id], // Add creator as first member
      moderators: [session.user.id], // Add creator as first moderator
    })

    return NextResponse.json(trace)
  } catch (error) {
    console.error('Error creating trace:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 