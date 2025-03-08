'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Settings, UserX, Shield, Trash } from 'lucide-react'
import { TraceRole } from '@/lib/utils/permissions'

interface AdminMenuProps {
  traceId: string
  userRole: TraceRole
}

export function AdminMenu({ traceId, userRole }: AdminMenuProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trace? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${traceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/discover')
      }
    } catch (error) {
      console.error('Error deleting trace:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Only show menu for owners and moderators
  if (userRole !== 'owner' && userRole !== 'moderator') {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {userRole === 'owner' && (
          <>
            <DropdownMenuItem onClick={() => router.push(`/t/${traceId}/settings`)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/t/${traceId}/moderators`)}>
              <Shield className="mr-2 h-4 w-4" />
              Manage Moderators
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem onClick={() => router.push(`/t/${traceId}/members`)}>
          <UserX className="mr-2 h-4 w-4" />
          Manage Members
        </DropdownMenuItem>
        
        {userRole === 'owner' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Trace
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 