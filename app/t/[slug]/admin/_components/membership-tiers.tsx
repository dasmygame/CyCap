'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { TraceRole } from '@/lib/utils/permissions'

const tierSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.number().min(0),
  description: z.string().max(500),
  features: z.array(z.string()),
  maxMembers: z.number().min(0).optional(),
  isActive: z.boolean(),
  trialPeriodDays: z.number().min(0).optional(),
})

const formSchema = z.object({
  tiers: z.array(tierSchema),
  enableSubscriptions: z.boolean(),
  customPricing: z.boolean(),
  minimumSubscriptionMonths: z.number().min(1),
})

interface MembershipTiersProps {
  trace: {
    _id: string
    subscriptionSettings?: {
      tiers: Array<{
        name: string
        price: number
        description: string
        features: string[]
        maxMembers?: number
        isActive: boolean
        trialPeriodDays?: number
      }>
      enableSubscriptions: boolean
      customPricing: boolean
      minimumSubscriptionMonths: number
    }
  }
  userRole: TraceRole
}

export function MembershipTiers({ trace, userRole }: MembershipTiersProps) {
  const [isLoading, setIsLoading] = useState(false)

  const defaultTier = {
    name: '',
    price: 0,
    description: '',
    features: [''],
    maxMembers: undefined,
    isActive: true,
    trialPeriodDays: 0,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tiers: trace.subscriptionSettings?.tiers || [defaultTier],
      enableSubscriptions: trace.subscriptionSettings?.enableSubscriptions || false,
      customPricing: trace.subscriptionSettings?.customPricing || false,
      minimumSubscriptionMonths: trace.subscriptionSettings?.minimumSubscriptionMonths || 1,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tiers',
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${trace._id}/subscription-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error('Failed to update subscription settings')
      
      toast.success('Subscription settings updated successfully')
    } catch (error) {
      toast.error('Something went wrong')
      console.error('Error updating subscription settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Membership Tiers</CardTitle>
          <CardDescription>
            Configure your subscription tiers and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="enableSubscriptions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Subscriptions</FormLabel>
                      <FormDescription>
                        Allow users to subscribe to your trace
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

              {form.watch('enableSubscriptions') && (
                <>
                  <FormField
                    control={form.control}
                    name="customPricing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Custom Pricing</FormLabel>
                          <FormDescription>
                            Allow custom pricing for individual subscribers
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
                    control={form.control}
                    name="minimumSubscriptionMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Subscription Period (months)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum number of months a user must subscribe for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Subscription Tiers</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append(defaultTier)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tier
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-base">
                            Tier {index + 1}
                          </CardTitle>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`tiers.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tiers.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price (USD/month)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tiers.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tiers.${index}.maxMembers`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Members (optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Leave empty for unlimited members
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tiers.${index}.trialPeriodDays`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trial Period (days)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Set to 0 for no trial period
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tiers.${index}.isActive`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Active</FormLabel>
                                  <FormDescription>
                                    Allow new subscribers to select this tier
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 