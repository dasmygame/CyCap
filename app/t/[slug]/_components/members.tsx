'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Member {
  _id: string
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

interface MembersProps {
  members: Member[]
  moderators: Member[]
  createdBy: Member
}

export function Members({ members, moderators, createdBy }: MembersProps) {
  const getRoleColor = (member: Member) => {
    if (member._id === createdBy._id) return 'default'
    if (moderators.some(mod => mod._id === member._id)) return 'secondary'
    return undefined
  }

  const getRoleLabel = (member: Member) => {
    if (member._id === createdBy._id) return 'Owner'
    if (moderators.some(mod => mod._id === member._id)) return 'Moderator'
    return 'Member'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">@{member.username}</p>
                  </div>
                </div>
                <Badge variant={getRoleColor(member)}>
                  {getRoleLabel(member)}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 