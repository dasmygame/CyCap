'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { TraceRole } from '@/lib/utils/permissions'

interface User {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
  lastActive: string
}

interface BannedUser {
  id: string
  name: string
  email: string
  reason: string
  bannedAt: string
  bannedBy: string
  expiresAt?: string
}

interface ModerationProps {
  trace: {
    _id: string
    members: User[]
    moderators: User[]
    bannedUsers: BannedUser[]
  }
  userRole: TraceRole
}

export function Moderation({ trace, userRole }: ModerationProps) {
  const [selectedTab, setSelectedTab] = useState('members')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModeratorOpen, setIsAddModeratorOpen] = useState(false)
  const [isBanUserOpen, setIsBanUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [banReason, setBanReason] = useState('')
  const [banDuration, setBanDuration] = useState('permanent')
  const [isLoading, setIsLoading] = useState(false)
  const [isTransferOwnershipOpen, setIsTransferOwnershipOpen] = useState(false)

  const filteredMembers = trace.members.filter(member =>
    (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (member.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  const filteredModerators = trace.moderators.filter(mod =>
    (mod.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (mod.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  const filteredBans = trace.bannedUsers.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  async function handleAddModerator(userId: string) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${trace._id}/moderators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) throw new Error('Failed to add moderator')
      
      toast.success('Moderator added successfully')
      setIsAddModeratorOpen(false)
    } catch (error) {
      toast.error('Failed to add moderator')
      console.error('Error adding moderator:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRemoveModerator(userId: string) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${trace._id}/moderators/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove moderator')
      
      toast.success('Moderator removed successfully')
    } catch (error) {
      toast.error('Failed to remove moderator')
      console.error('Error removing moderator:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleBanUser(userId: string) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${trace._id}/bans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          reason: banReason,
          duration: banDuration === 'permanent' ? null : banDuration,
        }),
      })

      if (!response.ok) throw new Error('Failed to ban user')
      
      toast.success('User banned successfully')
      setIsBanUserOpen(false)
      setBanReason('')
      setBanDuration('permanent')
    } catch (error) {
      toast.error('Failed to ban user')
      console.error('Error banning user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUnbanUser(userId: string) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${trace._id}/bans/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to unban user')
      
      toast.success('User unbanned successfully')
    } catch (error) {
      toast.error('Failed to unban user')
      console.error('Error unbanning user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransferOwnership = async (newOwnerId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${trace._id}/transfer-ownership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOwnerId })
      })

      if (!response.ok) {
        throw new Error('Failed to transfer ownership')
      }

      toast.success('Ownership transferred successfully')
      setIsTransferOwnershipOpen(false)
      window.location.reload() // Refresh to update roles
    } catch (error) {
      toast.error('Failed to transfer ownership')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moderation</CardTitle>
          <CardDescription>
            Manage members, moderators, and banned users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              {selectedTab === 'moderators' && userRole === 'owner' && (
                <Button onClick={() => setIsAddModeratorOpen(true)}>
                  Add Moderator
                </Button>
              )}
              {userRole === 'owner' && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsTransferOwnershipOpen(true)}
                >
                  Transfer Ownership
                </Button>
              )}
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="moderators">Moderators</TabsTrigger>
                <TabsTrigger value="bans">Bans</TabsTrigger>
              </TabsList>

              <TabsContent value="members">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(member.lastActive).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(member)
                              setIsBanUserOpen(true)
                            }}
                          >
                            Ban
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="moderators">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModerators.map((mod) => (
                      <TableRow key={mod.id}>
                        <TableCell>{mod.name}</TableCell>
                        <TableCell>{mod.email}</TableCell>
                        <TableCell>{mod.role}</TableCell>
                        <TableCell>
                          {userRole === 'owner' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveModerator(mod.id)}
                              disabled={isLoading}
                            >
                              Remove
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="bans">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Banned By</TableHead>
                      <TableHead>Banned At</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBans.map((ban) => (
                      <TableRow key={ban.id}>
                        <TableCell>{ban.name}</TableCell>
                        <TableCell>{ban.email}</TableCell>
                        <TableCell>{ban.reason}</TableCell>
                        <TableCell>{ban.bannedBy}</TableCell>
                        <TableCell>{new Date(ban.bannedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {ban.expiresAt
                            ? new Date(ban.expiresAt).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbanUser(ban.id)}
                            disabled={isLoading}
                          >
                            Unban
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddModeratorOpen} onOpenChange={setIsAddModeratorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Moderator</DialogTitle>
            <DialogDescription>
              Select a member to promote to moderator
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={(value) => handleAddModerator(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {trace.members
                .filter((member) => !trace.moderators.find((mod) => mod.id === member.id))
                .map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>

      <Dialog open={isBanUserOpen} onOpenChange={setIsBanUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              {selectedUser ? `Ban ${selectedUser.name} from this trace` : 'Ban user'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Input
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter reason for ban"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select value={banDuration} onValueChange={setBanDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ban duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleBanUser(selectedUser.id)}
              disabled={isLoading || !banReason}
            >
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTransferOwnershipOpen} onOpenChange={setIsTransferOwnershipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
            <DialogDescription>
              Select a member to transfer ownership to. You will be made a moderator.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Select
            onValueChange={(value) => handleTransferOwnership(value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {trace.members
                .filter(member => !trace.moderators.some(mod => mod.id === member.id))
                .map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransferOwnershipOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 