import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchInput } from '@/shared/components/common/SearchInput';

describe('SearchInput', () => {
  it('renders with default placeholder', () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText('Tìm kiếm sản phẩm...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchInput placeholder="Tìm kiếm đơn hàng..." />);
    expect(screen.getByPlaceholderText('Tìm kiếm đơn hàng...')).toBeInTheDocument();
  });

  it('does not show clear button when input is empty', () => {
    render(<SearchInput />);
    expect(screen.queryByRole('button', { name: 'Xóa từ khóa tìm kiếm' })).not.toBeInTheDocument();
  });

  it('shows clear button when input has a value', async () => {
    render(<SearchInput />);
    await userEvent.type(screen.getByRole('textbox'), 'giày');
    expect(screen.getByRole('button', { name: 'Xóa từ khóa tìm kiếm' })).toBeInTheDocument();
  });

  it('clicking clear button empties the input', async () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'giày');
    await userEvent.click(screen.getByRole('button', { name: 'Xóa từ khóa tìm kiếm' }));
    expect(input).toHaveValue('');
  });

  it('clear button disappears after clearing', async () => {
    render(<SearchInput />);
    await userEvent.type(screen.getByRole('textbox'), 'giày');
    await userEvent.click(screen.getByRole('button', { name: 'Xóa từ khóa tìm kiếm' }));
    expect(screen.queryByRole('button', { name: 'Xóa từ khóa tìm kiếm' })).not.toBeInTheDocument();
  });
});

describe('SearchInput — debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onSearch with empty string on mount', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} delay={400} />);
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('does not call onSearch immediately after typing', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} delay={400} />);
    onSearch.mockClear();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'áo' } });
    expect(onSearch).not.toHaveBeenCalledWith('áo');
  });

  it('calls onSearch with trimmed value after debounce delay', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} delay={400} />);
    onSearch.mockClear();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  áo  ' } });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(onSearch).toHaveBeenCalledWith('áo');
  });

  it('resets onSearch to empty string after clear', () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} delay={400} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'giày' } });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    onSearch.mockClear();

    act(() => {
      screen.getByRole('button', { name: 'Xóa từ khóa tìm kiếm' }).click();
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(onSearch).toHaveBeenCalledWith('');
  });
});
