'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PersonalInfoFieldsProps {
  formData: {
    firstName: string
    lastName: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PersonalInfoFields({ formData, handleChange }: PersonalInfoFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="John"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Doe"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
    </div>
  )
} 