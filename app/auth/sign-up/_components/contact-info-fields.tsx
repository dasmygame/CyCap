'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ContactInfoFieldsProps {
  formData: {
    email: string
    username: string
    phoneNumber: string
    occupation: string
    annualIncome: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ContactInfoFields({ formData, handleChange }: ContactInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="johndoe"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+1 (555) 000-0000"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            type="text"
            placeholder="Software Engineer"
            required
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="annualIncome">Annual Income</Label>
        <Input
          id="annualIncome"
          name="annualIncome"
          type="text"
          placeholder="50,000"
          required
          value={formData.annualIncome}
          onChange={handleChange}
        />
      </div>
    </>
  )
} 