'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Star, Filter } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Slider
} from "@/components/ui/slider"
import { PageContainer } from "@/components/page-container"

// Mock data for demonstration
const topTraders = [
  {
    name: "Sarah Johnson",
    handle: "@sarahj_trades",
    roi: "+45.8%",
    followers: "12.5K",
    winRate: "78%",
    tags: ["Crypto", "Forex"],
    avatar: "/avatars/sarah.jpg"
  },
  {
    name: "Michael Chen",
    handle: "@mchentrader",
    roi: "+38.2%",
    followers: "8.2K",
    winRate: "72%",
    tags: ["Stocks", "Options"],
    avatar: "/avatars/michael.jpg"
  },
  // Add more traders...
]

const topCommunities = [
  {
    name: "Crypto Elite",
    members: "25.4K",
    performance: "+32.5%",
    description: "Leading crypto trading community with daily signals and education",
    tags: ["Crypto", "Education"],
    avatar: "/communities/crypto-elite.jpg"
  },
  {
    name: "Stock Masters",
    members: "18.7K",
    performance: "+28.9%",
    description: "Focus on long-term stock investments and market analysis",
    tags: ["Stocks", "Analysis"],
    avatar: "/communities/stock-masters.jpg"
  },
  // Add more communities...
]

export default function DiscoverPage() {
  return (
    <PageContainer>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl mb-2">Discover</h1>
        <p className="text-muted-foreground text-lg">
          Find top-performing traders and communities to follow
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search traders or communities..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="performance">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with specific criteria
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Asset Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Stocks", "Crypto", "Forex", "Options", "Futures"].map((asset) => (
                      <Button key={asset} variant="outline" size="sm">
                        {asset}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Minimum ROI</h4>
                  <Slider
                    defaultValue={[0]}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Trading Style</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Day Trading", "Swing Trading", "Long Term", "Scalping"].map((style) => (
                      <Button key={style} variant="outline" size="sm">
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="traders" className="space-y-6">
        <TabsList className="border-0 bg-transparent">
          <TabsTrigger value="traders" className="border-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <Users className="h-4 w-4 mr-2" />
            Traders
          </TabsTrigger>
          <TabsTrigger value="communities" className="border-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <Star className="h-4 w-4 mr-2" />
            Communities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traders" className="space-y-6 border-0">
          {/* Trending Traders */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Trending Traders</h2>
              <Button variant="link">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topTraders.map((trader) => (
                <Card key={trader.handle} className="rounded-none border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-muted" />
                        <div>
                          <CardTitle>{trader.name}</CardTitle>
                          <CardDescription>{trader.handle}</CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Follow</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">ROI</p>
                        <p className="font-semibold text-green-500">{trader.roi}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="font-semibold">{trader.winRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="font-semibold">{trader.followers}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trader.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="communities" className="space-y-6 border-0">
          {/* Top Communities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Top Communities</h2>
              <Button variant="link">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCommunities.map((community) => (
                <Card key={community.name} className="rounded-none border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-muted" />
                        <div>
                          <CardTitle>{community.name}</CardTitle>
                          <CardDescription>{community.members} members</CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {community.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Performance</span>
                      <span className="font-semibold text-green-500">{community.performance}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {community.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
} 