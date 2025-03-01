import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BlogPage() {
  const posts = [
    {
      title: "Understanding Market Volatility",
      date: "March 1, 2024",
      description: "Learn how to navigate through volatile market conditions and make informed decisions.",
      readTime: "5 min read",
    },
    {
      title: "Technical Analysis Fundamentals",
      date: "February 28, 2024",
      description: "A comprehensive guide to understanding and applying technical analysis in trading.",
      readTime: "8 min read",
    },
    {
      title: "Risk Management Strategies",
      date: "February 25, 2024",
      description: "Essential risk management techniques every trader should know and implement.",
      readTime: "6 min read",
    },
    {
      title: "The Future of Trading",
      date: "February 20, 2024",
      description: "Exploring emerging trends and technologies shaping the future of trading.",
      readTime: "7 min read",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl  tracking-tight mb-4">Latest Insights</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with our latest articles, analysis, and trading insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {posts.map((post, index) => (
            <Card key={index} className="transition-all hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-2xl text-muted-foreground">Blog Image</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
} 