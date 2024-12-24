'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export default function BrokerCredentialsForm() {
  const [broker, setBroker] = useState<'webull' | 'robinhood'>('webull')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (broker !== 'robinhood') {
      toast({
        title: "Unsupported broker",
        description: "Currently, only Robinhood integration is supported.",
        variant: "destructive",
      })
      return
    }
    try {
      const response = await fetch('/api/robinhood/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })
        // Reset form
        setUsername('')
        setPassword('')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect account",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup value={broker} onValueChange={(value: 'webull' | 'robinhood') => setBroker(value)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="webull" id="webull" />
          <Label htmlFor="webull">Webull</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="robinhood" id="robinhood" />
          <Label htmlFor="robinhood">Robinhood</Label>
        </div>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>

      <Button type="submit">Connect Account</Button>
    </form>
  )
}

