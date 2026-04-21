'use client';

import * as React from 'react';

import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/shared/lib/utils';

const Progress = React.forwardRef<React.ComponentRef<typeof ProgressPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>>(
  ({ className, value, ...props }, ref) => {
    const percentage = value ?? 0;

    return (
      <ProgressPrimitive.Root ref={ref} className={cn('bg-secondary relative h-4 w-full overflow-hidden rounded-full', className)} {...props}>
        <ProgressPrimitive.Indicator
          className="bg-primary h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${String(100 - percentage)}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
