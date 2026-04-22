import { useState } from 'react';

export interface PaginationResult {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function usePagination(total: number, pageSize: number): PaginationResult {
  const [page, setPageState] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function setPage(nextPage: number) {
    setPageState(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return {
    page,
    setPage,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
