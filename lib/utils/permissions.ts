import { ITrace } from '@/lib/models/Trace'
import { Types } from 'mongoose'

interface MongoDocument {
  _id: Types.ObjectId | string
  toString(): string
}

export type TraceRole = 'owner' | 'moderator' | 'member' | 'none'

export function getUserTraceRole(userId: string, trace: ITrace): TraceRole {
  if (!userId || !trace) {
    // console.log('Debug - Early return:', { userId, hasTrace: !!trace })
    return 'none'
  }

  // Handle createdBy field
  if (!trace.createdBy) {
    // console.log('Debug - No createdBy:', { trace })
    return 'none'
  }

  // console.log('Debug - Checking createdBy:', {
  //   userId,
  //   createdBy: trace.createdBy,
  //   type: typeof trace.createdBy,
  //   hasToString: 'toString' in trace.createdBy,
  //   hasId: '_id' in trace.createdBy
  // })

  const createdById = typeof trace.createdBy === 'string' ? 
    trace.createdBy : 
    '_id' in trace.createdBy ? trace.createdBy._id.toString() :
    (trace.createdBy as MongoDocument).toString()

  // console.log('Debug - IDs:', { userId, createdById })

  if (createdById === userId) return 'owner'
  
  // Handle moderators array
  // console.log('Debug - Moderators:', trace.moderators)

  const moderatorIds = trace.moderators?.map(mod => 
    typeof mod === 'string' ? mod : 
    '_id' in mod ? mod._id.toString() :
    (mod as MongoDocument).toString()
  ).filter(Boolean) || []

  // console.log('Debug - ModeratorIds:', moderatorIds)

  if (moderatorIds.includes(userId)) return 'moderator'

  // Handle members array
  // console.log('Debug - Members:', trace.members)

  const memberIds = trace.members?.map(member => 
    typeof member === 'string' ? member : 
    '_id' in member ? member._id.toString() :
    (member as MongoDocument).toString()
  ).filter(Boolean) || []

  // console.log('Debug - MemberIds:', memberIds)

  if (memberIds.includes(userId)) return 'member'

  return 'none'
}

export const TRACE_PERMISSIONS = {
  editTrace: ['owner', 'moderator'],
  deleteTrace: ['owner'],
  manageMembers: ['owner', 'moderator'],
  manageSettings: ['owner'],
  createAlerts: ['owner', 'moderator', 'member'],
  deleteAlerts: ['owner', 'moderator'],
  banMembers: ['owner', 'moderator'],
  kickMembers: ['owner', 'moderator'],
  addModerators: ['owner'],
  removeModerators: ['owner'],
} as const

export function hasTracePermission(
  permission: keyof typeof TRACE_PERMISSIONS,
  role: TraceRole
): boolean {
  return TRACE_PERMISSIONS[permission].includes(role as any)
} 