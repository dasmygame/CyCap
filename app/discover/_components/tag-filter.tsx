'use client'

import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface TagFilterProps {
  allTags: string[]
  selectedTags: string[]
}

export function TagFilter({ allTags, selectedTags }: TagFilterProps) {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter by Tags</SheetTitle>
          <SheetDescription>
            Select tags to filter traces
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link 
                key={tag}
                href={
                  selectedTags.includes(tag) && selectedTags.length === 1
                    ? pathname // Remove all query params when unselecting last tag
                    : {
                        pathname,
                        query: {
                          tags: selectedTags.includes(tag)
                            ? selectedTags.filter(t => t !== tag)
                            : [...selectedTags, tag]
                        }
                      }
                }
              >
                <Button 
                  variant={selectedTags.includes(tag) ? "default" : "outline"} 
                  size="sm"
                >
                  {tag}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 