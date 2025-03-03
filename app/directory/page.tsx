import Link from 'next/link'
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { connectDB } from '@/lib/db'
import { Trace, ITrace } from '@/lib/models/Trace'
import { Types } from 'mongoose'

interface TraceDocument extends Omit<ITrace, '_id'> {
  _id: Types.ObjectId
}

async function getTraces(): Promise<TraceDocument[]> {
  await connectDB()
  const traces = await Trace.find({})
    .populate('createdBy', 'firstName lastName')
    .sort({ createdAt: -1 })
    .lean()
  return traces as unknown as TraceDocument[]
}

export default async function DirectoryPage() {
  const traces = await getTraces()

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trading Communities</h2>
          <p className="text-muted-foreground">
            Discover and join trading communities on Traecer.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {traces.map((trace) => (
            <Link key={trace._id.toString()} href={`/t/${trace.slug}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="relative">
                  {trace.coverImage && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center rounded-t-lg h-24"
                      style={{ backgroundImage: `url(${trace.coverImage})` }}
                    />
                  )}
                  <div className="relative z-10 flex items-center space-x-4 pt-16">
                    {trace.avatar && (
                      <div 
                        className="w-16 h-16 rounded-full bg-cover bg-center border-4 border-background"
                        style={{ backgroundImage: `url(${trace.avatar})` }}
                      />
                    )}
                    <div>
                      <CardTitle>{trace.name}</CardTitle>
                      <CardDescription>
                        {trace.stats.memberCount} member{trace.stats.memberCount !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {trace.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trace.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  )
} 