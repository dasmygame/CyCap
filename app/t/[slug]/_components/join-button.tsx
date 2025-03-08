'use client'

import { Button } from '@/components/ui/button'
import { TraceRole } from '@/lib/utils/permissions'

interface JoinButtonProps {
  traceId: string
  isMember: boolean
  userRole: TraceRole
}

export function JoinButton({ traceId, isMember, userRole }: JoinButtonProps) {
  const handleLeave = async () => {
    try {
      const response = await fetch(`/api/traces/${traceId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error leaving trace:', error)
    }
  }

  // Don't render anything for owners
  if (userRole === 'owner') {
    return null
  }

  return (
    <Button 
      variant={isMember ? "destructive" : "default"}
      onClick={isMember ? handleLeave : undefined}
    >
      {isMember ? 'Leave' : 'Join'}
    </Button>
  )
} 