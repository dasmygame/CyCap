'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const AVAILABLE_TAGS = [
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'futures', label: 'Futures' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'forex', label: 'Forex' },
  { value: 'options', label: 'Options' },
  { value: 'scalping', label: 'Scalping' },
  { value: 'swing-trading', label: 'Swing Trading' },
  { value: 'day-trading', label: 'Day Trading' },
  { value: 'position-trading', label: 'Position Trading' },
  { value: 'algorithmic', label: 'Algorithmic Trading' },
] as const

const traceFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.array(z.string()).min(1, 'Select at least one tag'),
  avatar: z.string().url('Must be a valid URL').optional(),
  coverImage: z.string().url('Must be a valid URL').optional(),
})

type TraceFormValues = z.infer<typeof traceFormSchema>

interface CreateTraceFormProps {
  userId: string
}

export function CreateTraceForm({ userId }: CreateTraceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const form = useForm<TraceFormValues>({
    resolver: zodResolver(traceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: [],
      avatar: '',
      coverImage: '',
    },
  })

  async function onSubmit(data: TraceFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch('/api/traces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          createdBy: userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create trace')
      }

      const trace = await response.json()
      toast.success('Trace created successfully!')
      router.push(`/t/${trace.slug}`)
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Error creating trace:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Trading Strategy" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed to other users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share details about your trading strategy and what makes it unique..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Help others understand your trading approach and what they can learn from you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <Button
                    key={tag.value}
                    type="button"
                    variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newTags = selectedTags.includes(tag.value)
                        ? selectedTags.filter((t) => t !== tag.value)
                        : [...selectedTags, tag.value]
                      setSelectedTags(newTags)
                      field.onChange(newTags)
                    }}
                  >
                    {tag.label}
                  </Button>
                ))}
              </div>
              <FormDescription>
                Select the tags that best describe your trading approach.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} />
              </FormControl>
              <FormDescription>
                A square image that represents your trace (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/cover.png" {...field} />
              </FormControl>
              <FormDescription>
                A banner image for your trace page (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Trace'}
        </Button>
      </form>
    </Form>
  )
} 