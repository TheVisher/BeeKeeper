import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton rounded-md bg-muted',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="perspective-1000 rounded-2xl overflow-hidden w-full h-full min-h-[320px]">
      <div className="relative preserve-3d w-full h-full bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
        {/* Image skeleton */}
        <Skeleton className="rounded-t-lg w-full h-40" />
        
        <div className="p-3 flex flex-col flex-grow">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 mb-2" />
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-3 flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Footer skeleton */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
