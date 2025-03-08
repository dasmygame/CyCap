import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import MarketOverview from "@/components/market-overview"
import TopTraces from "@/components/top-traces"
import AnimatedStockLine from "@/components/AnimatedStockLine"
import AnimatedStep from "@/components/AnimatedStep"

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 pt-20 bg-gradient-to-b from-[#d4fcec] via-background to-background dark:from-[#052e22] dark:via-background dark:to-background overflow-hidden">
        <AnimatedStockLine key={Date.now()} />
        <div className="flex flex-col items-center text-center max-w-4xl relative z-10">
          <div className="mb-8 p-4">
            <Image
              src="/image-vzXu5LZ4AlMNOPucuouhPfuDvoholx-removebg-preview_enhanced.png"
              alt="Traecer Logo"
              width={80}
              height={80}
              className="h-[100px] w-[100px]"
            />
          </div>
          <h1 className="mb-4 text-center text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Trade Smarter, <br />
            Execute Faster
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl">
            Real-time trading platform for your community. Portfolio tracking, transparency, and one-click copy trades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Market Overview Section */}
      <section className="w-full py-16 bg-card">
        <div className="container">
          <h2 className="text-3xl  mb-8 text-center">Market Overview</h2>
          <MarketOverview />
        </div>
      </section>

      {/* Top Performing Traces Section */}
      <section className="w-full py-16 bg-accent/20 dark:bg-accent/5">
        <div className="container">
          <h2 className="text-3xl mb-8 text-center">Top Performing Traces</h2>
          <TopTraces />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-32 bg-card">
        <div className="container flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl sm:text-4xl">Get Started in 3 Simple Steps</h2>
          <p className="mb-12 text-muted-foreground max-w-2xl">
            Join thousands of traders who are already using Traecer to enhance their trading experience
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Create Your Account",
                description: "Sign up in minutes with our streamlined onboarding process.",
              },
              { 
                title: "Connect Your Broker", 
                description: "Seamlessly link your existing brokerage account." 
              },
              {
                title: "Start Trading",
                description: "Copy top traders or execute your own strategies with one click.",
              },
            ].map((step, index) => (
              <AnimatedStep
                key={step.title}
                index={index}
                title={step.title}
                description={step.description}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-32 bg-gradient-to-b from-background to-accent/30 dark:from-background dark:to-accent/5">
        <div className="container flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl  sm:text-4xl">Ready to Transform Your Trading?</h2>
          <p className="mb-8 text-muted-foreground max-w-2xl">
            Join the future of retail trading with Traecer&apos;s innovative platform
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Trading Now
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </main>
  )
}

