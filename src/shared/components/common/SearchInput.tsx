'use client';

import { useEffect, useState } from 'react';

import { Search, X } from 'lucide-react';

import { Button } from '@/shared/components/base/Button';
import { Input } from '@/shared/components/base/Input';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { cn } from '@/shared/lib/utils';

interface SearchInputProps {
  readonly value?: string;
  readonly placeholder?: string;
  readonly delay?: number;
  readonly className?: string;
  readonly onSearch?: (value: string) => void;
}

export function SearchInput({
  value = '',
  placeholder = 'Tìm kiếm sản phẩm...',
  delay = 400,
  className,
  onSearch,
}: SearchInputProps): React.JSX.Element {
  const [query, setQuery] = useState(() => value);
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    onSearch?.(debouncedQuery.trim());
  }, [debouncedQuery, onSearch]);

  return (
    <div className={cn('relative', className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        value={query}
        onChange={event => {
          setQuery(event.target.value);
        }}
        placeholder={placeholder}
        className="pr-10 pl-9"
      />
      {query.length > 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
          onClick={() => {
            setQuery('');
          }}
          aria-label="Xóa từ khóa tìm kiếm"
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
