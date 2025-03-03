'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react'
import { TraceRole } from '@/lib/utils/permissions'

interface JoinButtonProps {
  traceId: string
  isMember: boolean
  userRole: TraceRole
}

export function JoinButton({ traceId, isMember, userRole }: JoinButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${traceId}/members`, {
        method: isMember ? 'DELETE' : 'POST',
      })

      if (!response.ok) {
        throw new Error(isMember ? 'Failed to leave trace' : 'Failed to join trace')
      }

      toast.success(isMember ? 'Successfully left trace' : 'Successfully joined trace')
      router.refresh()
    } catch (error) {
      toast.error(isMember ? 'Failed to leave trace' : 'Failed to join trace')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show leave button for owners
  if (isMember && userRole === 'owner') {
    return null
  }

  if (isMember) {
    return (
      <Button 
        onClick={handleAction}
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        <LogOut className="h-4 w-4 mr-2" />
        {isLoading ? 'Leaving...' : 'Leave Trace'}
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleAction}
      disabled={isLoading}
      size="sm"
    >
      {isLoading ? 'Joining...' : 'Join Trace'}
    </Button>
  )
} 