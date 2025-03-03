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
import { MoreHorizontal, Settings, UserX, Shield, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { TraceRole, hasTracePermission } from '@/lib/utils/permissions'

interface AdminMenuProps {
  traceId: string
  userRole: TraceRole
  onAction?: () => void
}

export function AdminMenu({ traceId, userRole, onAction }: AdminMenuProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: string, userId?: string) => {
    try {
      setIsLoading(true)
      let response

      switch (action) {
        case 'delete':
          response = await fetch(`/api/traces/${traceId}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            toast.success('Trace deleted successfully')
            router.push('/')
          }
          break

        case 'kick':
          if (!userId) return
          response = await fetch(`/api/traces/${traceId}/members/${userId}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            toast.success('Member removed successfully')
            onAction?.()
          }
          break

        case 'ban':
          if (!userId) return
          response = await fetch(`/api/traces/${traceId}/bans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          })
          if (response.ok) {
            toast.success('Member banned successfully')
            onAction?.()
          }
          break

        case 'mod':
          if (!userId) return
          response = await fetch(`/api/traces/${traceId}/moderators`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          })
          if (response.ok) {
            toast.success('Moderator added successfully')
            onAction?.()
          }
          break
      }

      if (!response?.ok) {
        throw new Error('Action failed')
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.error('Error performing action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {hasTracePermission('manageSettings', userRole) && (
          <DropdownMenuItem onClick={() => router.push(`/t/${traceId}/settings`)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        )}
        
        {hasTracePermission('manageMembers', userRole) && (
          <DropdownMenuItem onClick={() => router.push(`/t/${traceId}/members`)}>
            <UserX className="mr-2 h-4 w-4" />
            Manage Members
          </DropdownMenuItem>
        )}
        
        {hasTracePermission('addModerators', userRole) && (
          <DropdownMenuItem onClick={() => router.push(`/t/${traceId}/moderators`)}>
            <Shield className="mr-2 h-4 w-4" />
            Manage Moderators
          </DropdownMenuItem>
        )}
        
        {hasTracePermission('deleteTrace', userRole) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleAction('delete')}
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