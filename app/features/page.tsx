import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesPage() {
  const features = [
    {
      title: "Advanced Analytics",
      description: "Get deep insights into market trends with our powerful analytics tools.",
    },
    {
      title: "Real-time Trading",
      description: "Execute trades instantly with our low-latency trading infrastructure.",
    },
    {
      title: "Portfolio Management",
      description: "Manage your investments with our comprehensive portfolio tools.",
    },
    {
      title: "Risk Assessment",
      description: "Stay informed about potential risks with our advanced risk analysis system.",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl  tracking-tight mb-4">Our Features</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the tools and capabilities that make our platform the choice of professional traders.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-2xl text-muted-foreground">Demo Visual</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
} 