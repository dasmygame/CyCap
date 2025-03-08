'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PasswordFieldsProps {
  formData: {
    password: string
    confirmPassword: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PasswordFields({ formData, handleChange }: PasswordFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </div>
  )
} 