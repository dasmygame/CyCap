'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

// Dynamically import heavy components
const Calendar = dynamic(() => import("@/components/ui/calendar").then(mod => mod.Calendar), {
  loading: () => <div className="h-[240px] w-full animate-pulse rounded-lg bg-muted" />,
  ssr: false
})

const Popover = dynamic(() => import("@/components/ui/popover").then(mod => mod.Popover))
const PopoverContent = dynamic(() => import("@/components/ui/popover").then(mod => mod.PopoverContent))
const PopoverTrigger = dynamic(() => import("@/components/ui/popover").then(mod => mod.PopoverTrigger))

// Split the form into smaller components
const PersonalInfoFields = dynamic(() => import('./_components/personal-info-fields'), {
  loading: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="h-[70px] animate-pulse rounded-lg bg-muted" />
        <div className="h-[70px] animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  )
})

const ContactInfoFields = dynamic(() => import('./_components/contact-info-fields'), {
  loading: () => (
    <div className="space-y-4">
      <div className="h-[70px] animate-pulse rounded-lg bg-muted" />
      <div className="h-[70px] animate-pulse rounded-lg bg-muted" />
    </div>
  )
})

const PasswordFields = dynamic(() => import('./_components/password-fields'), {
  loading: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="h-[70px] animate-pulse rounded-lg bg-muted" />
      <div className="h-[70px] animate-pulse rounded-lg bg-muted" />
    </div>
  )
})

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    occupation: '',
    annualIncome: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!date) {
      setError('Please select your birth date')
      setIsLoading(false)
      return
    }

    // Calculate age from birth date
    const today = new Date()
    const birthDate = new Date(date)
    let calculatedAge = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--
    }

    if (calculatedAge < 18) {
      setError('You must be at least 18 years old to register')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          birthDate: date,
          age: calculatedAge,
          phoneNumber: formData.phoneNumber,
          occupation: formData.occupation,
          annualIncome: formData.annualIncome,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // Redirect to sign in page on success
      router.push('/auth/sign-in')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account and start your financial journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Suspense fallback={<div className="h-[70px] animate-pulse rounded-lg bg-muted" />}>
              <PersonalInfoFields formData={formData} handleChange={handleChange} />
            </Suspense>

            <Suspense fallback={<div className="h-[70px] animate-pulse rounded-lg bg-muted" />}>
              <ContactInfoFields formData={formData} handleChange={handleChange} />
            </Suspense>

            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date: Date) => {
                      const today = new Date()
                      const minDate = new Date()
                      minDate.setFullYear(today.getFullYear() - 120) // Max age 120 years
                      return date > today || date < minDate
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Suspense fallback={<div className="h-[70px] animate-pulse rounded-lg bg-muted" />}>
              <PasswordFields formData={formData} handleChange={handleChange} />
            </Suspense>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 