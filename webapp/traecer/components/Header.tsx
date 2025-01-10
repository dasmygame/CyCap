import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-background z-50 border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold">
            CYCAP
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <button className="flex items-center text-sm hover:text-primary transition-colors">
              What We Offer <ChevronDown className="ml-1 w-4 h-4" />
            </button>
            <Link href="/communities" className="text-sm hover:text-primary transition-colors">
              Communities
            </Link>
            <Link href="/learn" className="text-sm hover:text-primary transition-colors">
              Learn
            </Link>
            <Link href="/support" className="text-sm hover:text-primary transition-colors">
              Support
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="text-sm hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}

