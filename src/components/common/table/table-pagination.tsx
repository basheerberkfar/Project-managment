import type { TablePaginationProps } from './types';
import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGE_SIZE_OPTIONS as DEFAULT_PAGE_SIZE_OPTIONS } from '@/constants/constants';

export function TablePagination({
  pageIndex,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
}: TablePaginationProps) {
  const { t } = useTranslation('common');
  const totalPages = Math.ceil(totalCount / pageSize);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (pageIndex <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (pageIndex >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', pageIndex, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePrev = () => {
    if (pageIndex > 1) onPageChange(pageIndex - 1);
  };

  const handleNext = () => {
    if (pageIndex < totalPages) onPageChange(pageIndex + 1);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-2 select-none shrink-0 py-2">
      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={pageIndex === 1}
          className="flex cursor-pointer h-9 items-center justify-center rounded-[var(--rounded-1)] border dark:border-dark-card-border border-gray-light-500 dark:bg-dark-card-background bg-white px-3 text-sm dark:text-gray-dark-200 text-gray-light-800 transition-colors hover:border-[var(--color-primary-dark-500)] hover:text-[var(--color-primary-dark-500)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('pagination-prev')}
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            <button
              key={idx}
              disabled={page === '...'}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={clsx(
                'flex h-9 cursor-pointer min-w-[36px] items-center justify-center rounded-[var(--rounded-1)] border text-sm transition-colors px-2',
                page === pageIndex
                  ? 'border-[var(--color-primary-dark-500)] bg-[var(--color-primary-dark-500)]/10 text-[var(--color-primary-dark-500)] font-normal'
                  : 'dark:text-gray-dark-200 text-gray-light-800 rounded-[var(--rounded-1)] border dark:border-dark-card-border border-gray-light-500 dark:bg-dark-card-background bg-white',
                page === '...' &&
                  'cursor-default border-none bg-transparent hover:border-none'
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={pageIndex === totalPages || totalPages === 0}
          className="flex cursor-pointer h-9 items-center justify-center rounded-[var(--rounded-1)] rounded-[var(--rounded-1)] border dark:border-dark-card-border border-gray-light-500 dark:bg-dark-card-background bg-white px-3 text-sm dark:text-gray-dark-200 text-gray-light-800 transition-colors hover:border-[var(--color-primary-dark-500)] hover:text-[var(--color-primary-dark-500)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('pagination-next')}
        </button>
      </div>

      {/* Rows Per Page */}
      <div className="flex items-center gap-3 text-sm dark:text-gray-dark-200 text-gray-light-800">
        <span>{t('pagination-show')}</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer h-9 md:w-16 w-[70vw] items-center justify-between rounded-[var(--rounded-1)] border dark:border-dark-card-border border-gray-light-500 dark:bg-dark-card-background bg-white px-2 dark:text-gray-dark-200 text-gray-light-800 transition-colors hover:border-[var(--color-primary-dark-500)] focus:border-[var(--color-primary-dark-500)] focus:outline-none"
          >
            <span>{pageSize}</span>
            <CaretDown
              size={14}
              className={clsx('transition-transform', isOpen && 'rotate-180')}
            />
          </button>

          {isOpen && (
            <div className="absolute bottom-full mb-1 left-0 w-full overflow-hidden rounded-[var(--rounded-1)] border dark:border-dark-card-border border-gray-light-500 dark:bg-dark-card-background bg-white shadow-lg z-50">
              {pageSizeOptions.map((size) => (
                <div
                  key={size}
                  onClick={() => {
                    onPageSizeChange(size);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    'cursor-pointer px-2 py-1.5 text-center transition-colors hover:bg-[var(--color-primary-dark-500)] hover:text-white',
                    size === pageSize &&
                      'bg-[var(--color-primary-dark-500)]/20 text-[var(--color-primary-dark-500)]'
                  )}
                >
                  {size}
                </div>
              ))}
            </div>
          )}
        </div>
        <span>{t('pagination-row')}</span>
      </div>
    </div>
  );
}
