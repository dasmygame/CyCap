export type TraceRole = 'owner' | 'moderator' | 'member' | 'none'

interface TraceWithMembers {
  createdBy: { _id: string } | string
  moderators: ({ _id: string } | string)[]
  members: ({ _id: string } | string)[]
}

export function getUserTraceRole(userId: string, trace: TraceWithMembers | null | undefined): TraceRole {
  if (!userId || !trace || !trace.createdBy) return 'none'

  // Check if user is the owner
  const ownerId = typeof trace.createdBy === 'string' ? trace.createdBy : trace.createdBy._id
  if (ownerId === userId) {
    return 'owner'
  }

  // Check if user is a moderator
  if (Array.isArray(trace.moderators)) {
    const isModerator = trace.moderators.some(mod => {
      if (!mod) return false
      const modId = typeof mod === 'string' ? mod : mod._id
      return modId === userId
    })
    if (isModerator) {
      return 'moderator'
    }
  }

  // Check if user is a member
  if (Array.isArray(trace.members)) {
    const isMember = trace.members.some(member => {
      if (!member) return false
      const memberId = typeof member === 'string' ? member : member._id
      return memberId === userId
    })
    if (isMember) {
      return 'member'
    }
  }

  return 'none'
}

type Permission = 
  | 'edit'
  | 'delete'
  | 'manage_members'
  | 'manage_settings'
  | 'create_alerts'
  | 'delete_alerts'
  | 'ban_members'
  | 'kick_members'
  | 'add_moderators'
  | 'remove_moderators'

export const TRACE_PERMISSIONS: Record<TraceRole, Permission[]> = {
  owner: ['edit', 'delete', 'manage_members', 'manage_settings', 'create_alerts', 'delete_alerts', 'ban_members', 'kick_members', 'add_moderators', 'remove_moderators'],
  moderator: ['edit', 'manage_members', 'create_alerts', 'delete_alerts', 'ban_members', 'kick_members'],
  member: ['create_alerts'],
  none: []
}

export function hasTracePermission(userRole: TraceRole | undefined | null, permission: Permission): boolean {
  if (!userRole || !(userRole in TRACE_PERMISSIONS)) {
    return false
  }
  return TRACE_PERMISSIONS[userRole].includes(permission)
} 