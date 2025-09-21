import { Skeleton } from '@/components/ui/skeleton'

export default function RecentNotesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-3 rounded-lg border border-gray-200 bg-white">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>

              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-3/4 mb-2" />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}
