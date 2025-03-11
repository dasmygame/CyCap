'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, ControllerRenderProps } from "react-hook-form"
import * as z from "zod"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  bio: z.string().max(160, "Bio must not be longer than 160 characters.").optional(),
  avatarUrl: z.string().url("Please enter a valid URL.").optional().or(z.string().length(0)),
})

const socialFormSchema = z.object({
  twitter: z.string().url("Please enter a valid URL.").optional(),
  linkedin: z.string().url("Please enter a valid URL.").optional(),
  tradingview: z.string().url("Please enter a valid URL.").optional(),
})

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  tradeAlerts: z.boolean(),
  communityUpdates: z.boolean(),
  marketNews: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type NotificationFormValues = z.infer<typeof notificationSchema>

type SocialPlatform = 'twitter' | 'linkedin' | 'tradingview'

interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    bio: string
    avatarUrl?: string
    email: string
  }
  social: {
    twitter?: {
      username: string
      profileUrl: string
      verified: boolean
    }
    linkedin?: {
      username: string
      profileUrl: string
      verified: boolean
    }
    tradingview?: {
      username: string
      profileUrl: string
      verified: boolean
    }
  }
  notifications: {
    emailNotifications: boolean
    tradeAlerts: boolean
    communityUpdates: boolean
    marketNews: boolean
  }
  snapTrade: {
    userId: string
    userSecret: string
    registeredAt: Date
    brokerConnections: Array<{
      accountId: string
      authorizationId: string
      brokerName: string
      accountName: string
      status: string
    }>
  }
}

const BROKERS = [
  { name: 'Alpaca', slug: 'ALPACA', region: 'US' },
  { name: 'Coinbase', slug: 'COINBASE', region: 'International' },
  { name: 'E*Trade', slug: 'ETRADE', region: 'US' },
  { name: 'Fidelity', slug: 'FIDELITY', region: 'US' },
  { name: 'Interactive Brokers', slug: 'INTERACTIVE-BROKERS-FLEX', region: 'International' },
  { name: 'Kraken', slug: 'KRAKEN', region: 'International' },
  { name: 'Robinhood', slug: 'ROBINHOOD', region: 'US' },
  { name: 'Charles Schwab', slug: 'SCHWAB', region: 'US' },
  { name: 'TradeStation', slug: 'TRADESTATION', region: 'US' },
  { name: 'Tradier', slug: 'TRADIER', region: 'US' },
  { name: 'Trading212', slug: 'TRADING212', region: 'UK, EU, International' },
  { name: 'Vanguard', slug: 'VANGUARD', region: 'US' },
  { name: 'Webull', slug: 'WEBULL', region: 'US' },
] as const;

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [editMode, setEditMode] = useState({
    profile: false,
    social: false,
    notifications: false,
  })

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      avatarUrl: "",
    },
  })

  const socialForm = useForm<z.infer<typeof socialFormSchema>>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      twitter: "",
      linkedin: "",
      tradingview: "",
    },
  })

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      tradeAlerts: true,
      communityUpdates: true,
      marketNews: false,
    },
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (!response.ok) throw new Error('Failed to fetch settings')
        const data = await response.json()
        console.log('Fetched settings:', data)
        console.log('SnapTrade data:', data.snapTrade)
        setSettings(data)
        
        // If user has SnapTrade configured, fetch latest connections
        if (data.snapTrade?.userId) {
          const connectionsResponse = await fetch('/api/snaptrade/connections')
          if (connectionsResponse.ok) {
            const { connections } = await connectionsResponse.json()
            setSettings(prev => prev ? {
              ...prev,
              snapTrade: {
                ...prev.snapTrade,
                brokerConnections: connections
              }
            } : null)
          }
        }
        
        // Update form default values with fetched data
        profileForm.reset({
          firstName: data.profile.firstName || "",
          lastName: data.profile.lastName || "",
          bio: data.profile.bio || "",
          avatarUrl: data.profile.avatarUrl || session?.user?.image || "",
        })
        
        socialForm.reset({
          twitter: data.social.twitter?.username || "",
          linkedin: data.social.linkedin?.username || "",
          tradingview: data.social.tradingview?.username || "",
        })
        
        notificationForm.reset({
          emailNotifications: data.notifications.emailNotifications,
          tradeAlerts: data.notifications.tradeAlerts,
          communityUpdates: data.notifications.communityUpdates,
          marketNews: data.notifications.marketNews,
        })
      } catch (err) {
        console.error('Error fetching settings:', err)
        toast.error('Failed to load settings')
      }
    }

    if (session) {
      fetchSettings()
    }
  }, [session])

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log("Form submitted with values:", values)
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      console.log("Response status:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(errorText)
      }
      
      const data = await response.json()
      console.log("Success response:", data)
      
      setSettings(prev => prev ? {
        ...prev,
        profile: data.profile
      } : null)
      setEditMode(prev => ({ ...prev, profile: false }))
      toast.success("Settings updated successfully")
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error("Error updating settings")
    } finally {
      setIsLoading(false)
    }
  }

  async function onNotificationSubmit(values: z.infer<typeof notificationSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const data = await response.json()
      setSettings(prev => prev ? {
        ...prev,
        notifications: data.notifications
      } : null)
      setEditMode(prev => ({ ...prev, notifications: false }))
      toast.success("Settings updated successfully")
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error("Error updating settings")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <PageContainer>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">Loading settings...</div>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  if (status === "unauthenticated") {
    router.replace("/auth/sign-in")
    return null
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator />
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="brokers">Trading Accounts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your profile information. Your email and username cannot be changed.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(prev => ({ ...prev, profile: !prev.profile }))}
                >
                  {editMode.profile ? "Cancel" : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={settings?.profile.avatarUrl || session?.user?.image || ""} />
                      <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Click to upload or update your profile picture
                      </p>
                    </div>
                  </div>

                  {editMode.profile ? (
                    <Form {...profileForm}>
                      <form onSubmit={(e) => {
                        console.log("Form submission started")
                        profileForm.handleSubmit(onProfileSubmit)(e)
                      }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }: { field: ControllerRenderProps<ProfileFormValues, "firstName"> }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }: { field: ControllerRenderProps<ProfileFormValues, "lastName"> }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }: { field: ControllerRenderProps<ProfileFormValues, "bio"> }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormDescription>
                                Brief description for your profile. Maximum 160 characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Name</h3>
                        <p>{settings?.profile.firstName} {settings?.profile.lastName}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Bio</h3>
                        <p className="text-sm text-muted-foreground">
                          {settings?.profile.bio || "No bio added yet."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Connect your social media accounts to share your trading journey.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(prev => ({ ...prev, social: !prev.social }))}
                >
                  {editMode.social ? "Cancel" : "Edit Links"}
                </Button>
              </CardHeader>
              <CardContent>
                {editMode.social ? (
                  <div className="space-y-4">
                    {Object.entries({
                      twitter: 'Twitter',
                      linkedin: 'LinkedIn',
                      tradingview: 'TradingView'
                    } as Record<SocialPlatform, string>).map(([platform, label]) => (
                      <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {settings?.social?.[platform as SocialPlatform]?.verified 
                              ? `Connected as ${settings?.social?.[platform as SocialPlatform]?.username || ''}`
                              : 'Not connected'}
                          </p>
                        </div>
                        <Button
                          variant={settings?.social?.[platform as SocialPlatform]?.verified ? "destructive" : "default"}
                          onClick={async () => {
                            if (settings?.social?.[platform as SocialPlatform]?.verified) {
                              // Disconnect account
                              const response = await fetch('/api/settings/social/disconnect', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ platform })
                              })
                              
                              if (response.ok) {
                                setSettings(prev => prev && prev.social ? {
                                  ...prev,
                                  social: {
                                    ...prev.social,
                                    [platform as SocialPlatform]: {
                                      username: '',
                                      profileUrl: '',
                                      verified: false
                                    }
                                  }
                                } : prev)
                                toast.success(`Disconnected ${label}`)
                              } else {
                                toast.error(`Failed to disconnect ${label}`)
                              }
                            } else {
                              // Initiate OAuth flow
                              const response = await fetch('/api/settings/social/connect', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ platform })
                              })
                              
                              if (response.ok) {
                                const { url } = await response.json()
                                window.location.href = url // Redirect to OAuth
                              } else {
                                toast.error(`Failed to connect ${label}`)
                              }
                            }
                          }}
                        >
                          {settings?.social?.[platform as SocialPlatform]?.verified ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries({
                      twitter: 'Twitter',
                      linkedin: 'LinkedIn',
                      tradingview: 'TradingView'
                    } as Record<SocialPlatform, string>).map(([platform, label]) => (
                      <div key={platform}>
                        <h3 className="font-medium">{label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {settings?.social?.[platform as SocialPlatform]?.verified 
                            ? (
                              <a 
                                href={settings?.social?.[platform as SocialPlatform]?.profileUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {settings?.social?.[platform as SocialPlatform]?.username}
                              </a>
                            )
                            : 'Not connected'
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brokers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Accounts</CardTitle>
                <CardDescription>
                  Connect your brokerage accounts via SnapTrade to track your portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!settings?.snapTrade?.userId && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        To connect your brokerage accounts, you first need to register with SnapTrade.
                      </p>
                      <Button
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/snaptrade/register', {
                              method: 'POST',
                            })
                            
                            if (!response.ok) {
                              throw new Error('Failed to register with SnapTrade')
                            }
                            
                            const { redirectUrl } = await response.json()
                            if (redirectUrl) {
                              window.location.href = redirectUrl
                            } else {
                              window.location.reload()
                            }
                          } catch (error) {
                            console.error('Error registering with SnapTrade:', error)
                            toast.error('Failed to register with SnapTrade')
                          }
                        }}
                      >
                        Register with SnapTrade
                      </Button>
                    </div>
                  )}
                  
                  {settings?.snapTrade?.userId && (
                    <div className="space-y-6">
                      <div className="grid gap-4">
                        {BROKERS.map((broker) => {
                          // Find if user has this broker connected
                          const connection = settings.snapTrade.brokerConnections?.find(
                            conn => conn.brokerName.toUpperCase() === broker.slug
                          );

                          return (
                            <div key={broker.slug} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h3 className="font-medium">{broker.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {broker.region}
                                  {connection && ` • ${connection.accountName}`}
                                </p>
                              </div>
                              <Button
                                variant={connection ? "destructive" : "outline"}
                                onClick={async () => {
                                  if (connection) {
                                    try {
                                      const response = await fetch('/api/snaptrade/disconnect', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          authorizationId: connection.authorizationId,
                                        }),
                                      })
                                      
                                      if (!response.ok) {
                                        throw new Error('Failed to disconnect account')
                                      }
                                      
                                      // Refresh the connections list
                                      const connectionsResponse = await fetch('/api/snaptrade/connections')
                                      if (connectionsResponse.ok) {
                                        const { connections } = await connectionsResponse.json()
                                        setSettings(prev => prev ? {
                                          ...prev,
                                          snapTrade: {
                                            ...prev.snapTrade,
                                            brokerConnections: connections
                                          }
                                        } : null)
                                        toast.success('Successfully disconnected account')
                                      }
                                    } catch (error) {
                                      console.error('Error disconnecting account:', error)
                                      toast.error('Failed to disconnect account')
                                    }
                                  } else {
                                    try {
                                      const response = await fetch('/api/snaptrade/connect', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          broker: broker.slug,
                                          immediateRedirect: true,
                                          customRedirect: `${window.location.origin}/settings?tab=brokers`
                                        }),
                                      })
                                      
                                      if (!response.ok) {
                                        throw new Error('Failed to get connection URL')
                                      }
                                      
                                      const { redirectUrl } = await response.json()
                                      if (redirectUrl) {
                                        window.location.href = redirectUrl
                                      } else {
                                        toast.error('No redirect URL received')
                                      }
                                    } catch (error) {
                                      console.error('Error connecting account:', error)
                                      toast.error('Failed to connect account')
                                    }
                                  }
                                }}
                              >
                                {connection ? 'Disconnect' : 'Connect'}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Powered by SnapTrade. Your credentials are never stored on our servers.
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(prev => ({ ...prev, notifications: !prev.notifications }))}
                >
                  {editMode.notifications ? "Cancel" : "Edit Preferences"}
                </Button>
              </CardHeader>
              <CardContent>
                {editMode.notifications ? (
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "emailNotifications"> }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="tradeAlerts"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "tradeAlerts"> }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Trade Alerts</FormLabel>
                              <FormDescription>
                                Get notified about important trading activities
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="communityUpdates"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "communityUpdates"> }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Community Updates</FormLabel>
                              <FormDescription>
                                Stay informed about your communities
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationForm.control}
                        name="marketNews"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "marketNews"> }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Market News</FormLabel>
                              <FormDescription>
                                Receive important market news and updates
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(settings?.notifications || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                          <p className="text-sm text-muted-foreground">
                            {value ? "Enabled" : "Disabled"}
                          </p>
                        </div>
                        <Switch checked={value} disabled />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
} 