import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PaginationNav } from '@/shared/components/common/PaginationNav';

describe('PaginationNav', () => {
  it('returns null when totalPages is 1', () => {
    const { container } = render(<PaginationNav page={1} totalPages={1} onPageChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when totalPages is 0', () => {
    const { container } = render(<PaginationNav page={1} totalPages={0} onPageChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders page buttons for all pages', () => {
    render(<PaginationNav page={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('prev button is disabled on first page', () => {
    render(<PaginationNav page={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Trang trước' })).toBeDisabled();
  });

  it('next button is disabled on last page', () => {
    render(<PaginationNav page={3} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Trang sau' })).toBeDisabled();
  });

  it('prev button is enabled when not on first page', () => {
    render(<PaginationNav page={2} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Trang trước' })).not.toBeDisabled();
  });

  it('next button is enabled when not on last page', () => {
    render(<PaginationNav page={2} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Trang sau' })).not.toBeDisabled();
  });

  it('clicking prev calls onPageChange with page - 1', async () => {
    const onPageChange = vi.fn();
    render(<PaginationNav page={2} totalPages={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Trang trước' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('clicking next calls onPageChange with page + 1', async () => {
    const onPageChange = vi.fn();
    render(<PaginationNav page={2} totalPages={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Trang sau' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('clicking a page number calls onPageChange with that number', async () => {
    const onPageChange = vi.fn();
    render(<PaginationNav page={1} totalPages={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
