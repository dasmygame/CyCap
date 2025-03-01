import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      birthDate,
      age,
      phoneNumber,
      occupation,
      annualIncome,
    } = await req.json()

    // Validate input
    if (!firstName || !lastName || !email || !username || !password || !birthDate || !age || !phoneNumber || !occupation || !annualIncome) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email or username already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password, // Password will be hashed by the model's pre-save hook
      birthDate,
      age,
      phoneNumber,
      occupation,
      annualIncome,
    })

    // Remove password from response
    const userWithoutPassword = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      birthDate: user.birthDate,
      age: user.age,
      phoneNumber: user.phoneNumber,
      occupation: user.occupation,
      annualIncome: user.annualIncome,
    }

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Signup error:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 