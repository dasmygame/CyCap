'use client'

import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import Link from 'next/link'

interface AdminPanelButtonProps {
  slug: string
}

export function AdminPanelButton({ slug }: AdminPanelButtonProps) {
  return (
    <Button variant="outline" asChild>
      <Link href={`/t/${slug}/admin`}>
        <Settings className="h-4 w-4 mr-2" />
        Admin Panel
      </Link>
    </Button>
  )
} 