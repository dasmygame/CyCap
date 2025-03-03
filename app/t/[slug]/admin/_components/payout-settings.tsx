'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { TraceRole } from '@/lib/utils/permissions'

const formSchema = z.object({
  payoutMethod: z.enum(['stripe', 'paypal', 'bank_transfer']),
  stripeConnectId: z.string().optional(),
  paypalEmail: z.string().email().optional(),
  bankDetails: z.object({
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    bankName: z.string().optional(),
    swiftCode: z.string().optional(),
  }).optional(),
  payoutSchedule: z.enum(['weekly', 'biweekly', 'monthly']),
  minimumPayoutAmount: z.number().min(0),
  automaticPayouts: z.boolean(),
  currency: z.string(),
  taxInformation: z.object({
    taxId: z.string().optional(),
    vatNumber: z.string().optional(),
    businessName: z.string().optional(),
    businessAddress: z.string().optional(),
  }).optional(),
})

interface PayoutSettingsProps {
  trace: {
    _id: string
    payoutSettings?: z.infer<typeof formSchema>
  }
  userRole: TraceRole
}

export function PayoutSettings({ trace, userRole }: PayoutSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payoutMethod: trace.payoutSettings?.payoutMethod || 'stripe',
      stripeConnectId: trace.payoutSettings?.stripeConnectId || '',
      paypalEmail: trace.payoutSettings?.paypalEmail || '',
      bankDetails: trace.payoutSettings?.bankDetails || {
        accountName: '',
        accountNumber: '',
        routingNumber: '',
        bankName: '',
        swiftCode: '',
      },
      payoutSchedule: trace.payoutSettings?.payoutSchedule || 'monthly',
      minimumPayoutAmount: trace.payoutSettings?.minimumPayoutAmount || 100,
      automaticPayouts: trace.payoutSettings?.automaticPayouts || true,
      currency: trace.payoutSettings?.currency || 'USD',
      taxInformation: trace.payoutSettings?.taxInformation || {
        taxId: '',
        vatNumber: '',
        businessName: '',
        businessAddress: '',
      },
    },
  })

  const payoutMethod = form.watch('payoutMethod')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/traces/${trace._id}/payout-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error('Failed to update payout settings')
      
      toast.success('Payout settings updated successfully')
    } catch (error) {
      toast.error('Something went wrong')
      console.error('Error updating payout settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
          <CardDescription>
            Configure how you receive payments from your subscribers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="payoutMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payout method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe Connect</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how you want to receive your earnings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {payoutMethod === 'stripe' && (
                <FormField
                  control={form.control}
                  name="stripeConnectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stripe Connect Account</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input {...field} placeholder="Connect your Stripe account" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              // TODO: Implement Stripe Connect OAuth
                              toast.info('Stripe Connect integration coming soon')
                            }}
                          >
                            Connect
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {payoutMethod === 'paypal' && (
                <FormField
                  control={form.control}
                  name="paypalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PayPal Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="your@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {payoutMethod === 'bank_transfer' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bankDetails.accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankDetails.accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankDetails.routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankDetails.bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankDetails.swiftCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SWIFT/BIC Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="payoutSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Schedule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payout frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often you want to receive payouts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumPayoutAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Payout Amount (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum amount required for a payout to be processed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="automaticPayouts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Automatic Payouts</FormLabel>
                      <FormDescription>
                        Automatically process payouts when minimum amount is reached
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

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tax Information</h3>
                <FormField
                  control={form.control}
                  name="taxInformation.taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxInformation.vatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxInformation.businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxInformation.businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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