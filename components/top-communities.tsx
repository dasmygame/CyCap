import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const topCommunities = [
  {
    name: "Crypto Wizards",
    performance: "+32.5%",
    members: 1250,
    winRate: 68,
    moneyEarned: 1500000,
    trades: 5280,
  },
  {
    name: "Stock Market Pros",
    performance: "+28.7%",
    members: 980,
    winRate: 65,
    moneyEarned: 1200000,
    trades: 4150,
  },
  {
    name: "Forex Masters",
    performance: "+25.1%",
    members: 1100,
    winRate: 62,
    moneyEarned: 980000,
    trades: 6300,
  },
  {
    name: "Options Elite",
    performance: "+22.3%",
    members: 750,
    winRate: 59,
    moneyEarned: 850000,
    trades: 3900,
  },
]

export default function TopCommunities() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {topCommunities.map((community, index) => (
        <Card key={index} className="rounded-none border overflow-hidden transition-all hover:shadow-lg">
          <CardHeader className="bg-primary/10 dark:bg-primary/20">
            <CardTitle>{community.name}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Performance</p>
                <p className="text-2xl font-bold text-primary">{community.performance}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Win Rate</p>
                <div className="flex items-center space-x-2">
                  <Progress value={community.winRate} className="w-full" />
                  <span className="text-sm font-medium">{community.winRate}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Money Earned</p>
                <p className="text-lg font-semibold">${community.moneyEarned.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Members</p>
                  <p className="text-lg font-semibold">{community.members}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Trades</p>
                  <p className="text-lg font-semibold">{community.trades}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

