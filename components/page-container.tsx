import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn(
      "container mx-auto px-4 min-h-screen pt-24", // pt-24 accounts for header height (h-16) plus extra spacing
      className
    )}>
      {children}
    </main>
  )
} 