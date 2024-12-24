import { NextResponse } from 'next/server'
import RobinhoodClient from 'robinhood-node'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
  }

  try {
    const client = new RobinhoodClient({
      username: username,
      password: password,
    })

    await client.authenticate()

    // Here you would typically save the authenticated client or its token
    // For this example, we'll just return a success message
    return NextResponse.json({ message: 'Successfully connected to Robinhood' })
  } catch (error) {
    console.error('Error connecting to Robinhood:', error)
    return NextResponse.json({ error: 'Failed to connect to Robinhood' }, { status: 500 })
  }
}

