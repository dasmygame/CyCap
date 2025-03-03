'use client'

import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminPanelButtonProps {
  slug: string
}

export function AdminPanelButton({ slug }: AdminPanelButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      onClick={() => router.push(`/t/${slug}/admin`)}
      className="gap-2"
    >
      <Settings className="h-4 w-4" />
      Admin Panel
    </Button>
  )
} 