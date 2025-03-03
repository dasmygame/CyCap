import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/page-container"
import { connectDB } from "@/lib/db"
import { Trace, ITrace } from "@/lib/models/Trace"
import Link from "next/link"
import { TagFilter } from "./_components/tag-filter"


type TraceWithPopulatedUser = Omit<ITrace, 'createdBy'> & {
  createdBy: {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
}

// Function to fetch traces with optional tag filter
async function getTraces(selectedTags: string[] = []): Promise<TraceWithPopulatedUser[]> {
  await connectDB()
  
  // Only apply tag filter if there are selected tags
  const query = selectedTags.length > 0 
    ? { tags: { $in: selectedTags } }
    : {}
  
  const traces = await Trace.find(query)
    .populate('createdBy', 'firstName lastName username avatarUrl')
    .sort({ createdAt: -1 })
    .lean()

  return JSON.parse(JSON.stringify(traces))
}

export default async function DiscoverPage({
  searchParams
}: {
  searchParams: { tags?: string | string[] }
}) {
  // Handle undefined or empty tags parameter
  const selectedTags = searchParams.tags 
    ? Array.isArray(searchParams.tags)
      ? searchParams.tags.filter(Boolean) // Remove any empty strings
      : searchParams.tags.length > 0 ? [searchParams.tags] : []
    : []

  const traces = await getTraces(selectedTags)

  // Get unique tags from all traces for the filter
  const allTags = Array.from(new Set(
    traces.flatMap(trace => trace.tags || [])
  )).sort()

  return (
    <PageContainer>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl mb-2">Discover Traces</h1>
        <p className="text-muted-foreground text-lg">
          Find and join trading traces that match your interests
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Input
            placeholder="Search traces..."
            className="pl-10"
          />
        </div>
        <TagFilter allTags={allTags} selectedTags={selectedTags} />
      </div>

      {/* Traces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {traces.map((trace: TraceWithPopulatedUser) => (
          <Link href={`/t/${trace.slug}`} key={trace.slug}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                      {trace.avatar && (
                        <img 
                          src={trace.avatar} 
                          alt={trace.name}
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                    <div>
                      <CardTitle>{trace.name}</CardTitle>
                      <CardDescription>
                        by @{trace.createdBy.username}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {trace.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(trace.tags || []).map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {traces.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No traces found {selectedTags.length > 0 && 'with the selected tags'}
          </div>
        )}
      </div>
    </PageContainer>
  )
} 