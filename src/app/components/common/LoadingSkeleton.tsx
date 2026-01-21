import React from 'react';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Card } from '@/app/components/ui/card';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-64 w-full" />
          </Card>
        ))}
      </div>

      {/* Recent Transactions Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
