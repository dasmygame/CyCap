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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Settings } from 'lucide-react'
import { toast } from 'sonner'

interface UserSettingsProps {
  traceId: string
  userRole: string
}

export function UserSettings({ traceId, userRole }: UserSettingsProps) {
  const router = useRouter()
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [settings, setSettings] = useState({
    tradeAlerts: true,
    chatMentions: true,
    priceAlerts: true,
    dailyUpdates: false
  })

  const handleSettingChange = async (setting: keyof typeof settings) => {
    try {
      // Update the setting optimistically
      setSettings(prev => ({ ...prev, [setting]: !prev[setting] }))

      // Send the update to the server
      const response = await fetch(`/api/traces/${traceId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          setting,
          value: !settings[setting]
        })
      })

      if (!response.ok) {
        // Revert the setting if the server update failed
        setSettings(prev => ({ ...prev, [setting]: !prev[setting] }))
        const data = await response.json()
        throw new Error(data.error || 'Failed to update setting')
      }

      toast.success('Settings updated')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings'
      toast.error(message)
    }
  }

  const handleLeaveTrace = async () => {
    try {
      // Get the trace slug from the URL
      const slug = window.location.pathname.split('/').pop()
      if (!slug) {
        throw new Error('Invalid trace URL')
      }

      const response = await fetch(`/api/traces/${slug}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to leave trace')
      }

      toast.success('Successfully left the trace')
      // Force a refresh and redirect back to the trace page
      router.refresh()
      router.push(`/t/${slug}`)
      // Force a hard reload after navigation
      window.location.reload()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to leave trace'
      toast.error(message)
    } finally {
      setIsLeaveDialogOpen(false)
    }
  }

  // Don't show leave option for trace owners
  const canLeave = userRole !== 'owner'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">User settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Trade Alerts</span>
              <Switch
                checked={settings.tradeAlerts}
                onCheckedChange={() => handleSettingChange('tradeAlerts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Chat Mentions</span>
              <Switch
                checked={settings.chatMentions}
                onCheckedChange={() => handleSettingChange('chatMentions')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Price Alerts</span>
              <Switch
                checked={settings.priceAlerts}
                onCheckedChange={() => handleSettingChange('priceAlerts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Updates</span>
              <Switch
                checked={settings.dailyUpdates}
                onCheckedChange={() => handleSettingChange('dailyUpdates')}
              />
            </div>
          </div>
          {canLeave && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsLeaveDialogOpen(true)}
              >
                Leave Trace
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Trace</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this trace? You will lose access to all content and need to rejoin to regain access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLeaveTrace}>
              Leave Trace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 