'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

const newsItems = [
  {
    title: "Tech Stocks Surge as AI Optimism Grows",
    source: "Financial Times",
    time: "2 hours ago",
    sentiment: "positive"
  },
  {
    title: "Federal Reserve Signals Potential Rate Cut",
    source: "Wall Street Journal",
    time: "4 hours ago",
    sentiment: "neutral"
  },
  {
    title: "Oil Prices Tumble Amid Global Demand Concerns",
    source: "Reuters",
    time: "6 hours ago",
    sentiment: "negative"
  },
  {
    title: "Retail Sales Beat Expectations in Q4",
    source: "CNBC",
    time: "8 hours ago",
    sentiment: "positive"
  },
  {
    title: "Cryptocurrency Market Faces Regulatory Scrutiny",
    source: "Bloomberg",
    time: "10 hours ago",
    sentiment: "negative"
  },
]

export function NewsAndSentiment() {
  //const [activeTab, setActiveTab] = useState('all')

  const filteredNews = newsItems;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">News & Sentiment</h2>
      <Tabs defaultValue="all" className="w-full" >
        <TabsList>
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Latest Market News</CardTitle>
              <CardDescription>Stay updated with the most recent market developments</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                {filteredNews.map((item, index) => (
                  <div key={index} className="mb-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold">{item.title}</h3>
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                    <div className={`text-sm mt-2 ${
                      item.sentiment === 'positive' ? 'text-green-500' :
                      item.sentiment === 'negative' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      Sentiment: {item.sentiment}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

