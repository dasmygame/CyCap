'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink } from 'lucide-react'

interface NewsArticle {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
}

const NEWS_SOURCES = ['Yahoo Finance', 'Seeking Alpha', 'MarketWatch']

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

export default function MarketNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [activeSource, setActiveSource] = useState<string>(NEWS_SOURCES[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      // In a real application, you would make an API call here
      // For this example, we'll use dummy data
      const dummyNews: NewsArticle[] = [
        {
          title: "Tesla's Stock Surges on New Battery Technology Announcement",
          description: "Tesla Inc. shares jumped 5% in pre-market trading following the company's announcement of a breakthrough in battery technology...",
          url: "https://finance.yahoo.com/news/teslas-stock-surges-battery-technology-120000777.html",
          source: "Yahoo Finance",
          publishedAt: "2023-06-15T12:00:00Z"
        },
        {
          title: "Apple's Services Revenue Hits All-Time High",
          description: "Apple's services segment, including Apple Music, Apple TV+, and the App Store, reported record-breaking revenue in Q2 2023...",
          url: "https://seekingalpha.com/news/3892939-apples-services-revenue-hits-all-time-high",
          source: "Seeking Alpha",
          publishedAt: "2023-06-15T14:30:00Z"
        },
        {
          title: "Fed Holds Interest Rates Steady, Signals Potential Future Hikes",
          description: "The Federal Reserve maintained its benchmark interest rate on Wednesday but indicated that more increases could be on the horizon...",
          url: "https://www.marketwatch.com/story/fed-holds-interest-rates-steady-signals-potential-future-hikes-1623869400",
          source: "MarketWatch",
          publishedAt: "2023-06-15T18:45:00Z"
        },
      ];
      setNews(dummyNews);
      setIsLoading(false);
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Fetch news every 5 minutes

    return () => clearInterval(interval);
  }, [activeSource]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Market News</h1>
      <Tabs defaultValue={NEWS_SOURCES[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {NEWS_SOURCES.map((source) => (
            <TabsTrigger 
              key={source} 
              value={source}
              onClick={() => setActiveSource(source)}
            >
              {source}
            </TabsTrigger>
          ))}
        </TabsList>
        {NEWS_SOURCES.map((source) => (
          <TabsContent key={source} value={source}>
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              {news
                .filter(article => article.source === source)
                .map((article, index) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors flex items-center"
                        >
                          {article.title}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </CardTitle>
                      <CardDescription>{formatDate(article.publishedAt)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{article.description}</p>
                    </CardContent>
                  </Card>
                ))}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

