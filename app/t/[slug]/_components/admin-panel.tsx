'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TraceRole, hasTracePermission } from '@/lib/utils/permissions'
import { Settings, UserX, Shield, Trash, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminPanelProps {
  traceId: string
  userRole: TraceRole
}

export function AdminPanel({ traceId, userRole }: AdminPanelProps) {
  const router = useRouter()

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="text-lg font-semibold text-primary">Admin Controls</CardTitle>
        <CardDescription>Manage trace settings and members</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 p-6">
        {hasTracePermission('manageSettings', userRole) && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push(`/t/${traceId}/settings`)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Trace Settings
          </Button>
        )}

        {hasTracePermission('manageMembers', userRole) && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push(`/t/${traceId}/members`)}
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Members
          </Button>
        )}

        {hasTracePermission('banMembers', userRole) && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push(`/t/${traceId}/bans`)}
          >
            <UserX className="mr-2 h-4 w-4" />
            Banned Users
          </Button>
        )}

        {hasTracePermission('addModerators', userRole) && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push(`/t/${traceId}/moderators`)}
          >
            <Shield className="mr-2 h-4 w-4" />
            Manage Moderators
          </Button>
        )}

        {hasTracePermission('deleteTrace', userRole) && (
          <Button
            variant="destructive"
            className="w-full justify-start mt-4"
            onClick={() => {
              // TODO: Add confirmation dialog
              // handleDeleteTrace()
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Trace
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 