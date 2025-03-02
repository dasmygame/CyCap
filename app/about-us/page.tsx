import { Card, CardContent } from "@/components/ui/card"
import { PageContainer } from "@/components/page-container"

export default function AboutUsPage() {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "15+ years of experience in fintech and trading systems.",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Former lead architect at major trading platforms.",
    },
    {
      name: "Emma Williams",
      role: "Head of Product",
      bio: "Specialized in user-centric trading solutions.",
    },
    {
      name: "David Kim",
      role: "Head of Trading",
      bio: "20+ years of institutional trading experience.",
    },
  ]

  return (
    <PageContainer>
      <div className="space-y-16">
        <section className="text-center">
          <h1 className="text-4xl tracking-tight mb-4">About Traecer</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We&apos;re revolutionizing the trading experience by combining cutting-edge technology 
            with transparent, data-driven solutions. Our mission is to empower traders with 
            the tools they need to succeed in today&apos;s dynamic markets.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl text-center">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-muted-foreground">
                  Pushing the boundaries of trading technology to create better solutions.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">Transparency</h3>
                <p className="text-muted-foreground">
                  Building trust through open and honest trading practices.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">Empowerment</h3>
                <p className="text-muted-foreground">
                  Providing traders with the tools and knowledge to succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent>
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-muted-foreground">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  )
} 