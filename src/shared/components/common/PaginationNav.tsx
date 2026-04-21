'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/components/base/Button';
import { cn } from '@/shared/lib/utils';

interface PaginationNavProps {
  readonly page: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly className?: string;
}

export function PaginationNav({ page, totalPages, onPageChange, className }: PaginationNavProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)} aria-label="Pagination">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => {
          onPageChange(page - 1);
        }}
        disabled={page <= 1}
        aria-label="Trang trước"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <div className="flex items-center gap-2">
        {pages.map(pageNumber => (
          <Button
            key={pageNumber}
            type="button"
            variant={pageNumber === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onPageChange(pageNumber);
            }}
          >
            {pageNumber}
          </Button>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => {
          onPageChange(page + 1);
        }}
        disabled={page >= totalPages}
        aria-label="Trang sau"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
