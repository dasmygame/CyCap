'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, Star } from 'lucide-react'

interface PriceTier {
  name: string
  price: number
  features: string[]
  description: string
}

interface TraceStorefrontProps {
  trace: {
    name: string
    description: string
    features: string[]
    coverImage?: string
    avatar?: string
    stats: {
      memberCount: number
      tradeAlertCount: number
      winRate: number
      profitFactor: number
    }
    owner: {
      name: string
      avatarUrl?: string
    }
    priceTiers?: PriceTier[]
  }
  onJoin: (tierId?: string) => void
}

export function TraceStorefront({ trace, onJoin }: TraceStorefrontProps) {
  // Default free tier if no price tiers are set
  const priceTiers = trace.priceTiers?.length ? trace.priceTiers : [{
    name: 'Free',
    price: 0,
    features: trace.features,
    description: 'Basic membership'
  }]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative min-h-[400px] mb-24">
        {trace.coverImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-xl"
            style={{ 
              backgroundImage: `url(${trace.coverImage})`,
              opacity: 0.1
            }}
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={trace.avatar} />
              <AvatarFallback>{trace.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 text-center">
            {trace.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center">
            {trace.description}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-24">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold">{trace.stats.memberCount}</CardTitle>
            <CardDescription>Active Members</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold">{trace.stats.tradeAlertCount}</CardTitle>
            <CardDescription>Trade Alerts</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold">{trace.stats.winRate}%</CardTitle>
            <CardDescription>Win Rate</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold">{trace.stats.profitFactor}</CardTitle>
            <CardDescription>Profit Factor</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Subscription Tiers */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-8 text-center">Membership Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {priceTiers.map((tier, i) => (
            <Card key={i} className="relative">
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-4xl font-bold">
                    ${tier.price}
                    <span className="text-lg text-muted-foreground">/month</span>
                  </p>
                  <p className="text-muted-foreground">Cancel anytime</p>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => onJoin(i.toString())} 
                  size="lg" 
                  className="w-full"
                >
                  {tier.price === 0 ? 'Join Now' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Star className="h-4 w-4" />
          <span>Managed by {trace.owner.name}</span>
        </div>
      </div>
    </div>
  )
} 