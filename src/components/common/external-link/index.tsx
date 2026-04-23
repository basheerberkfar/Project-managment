import { ArrowSquareOut } from '@phosphor-icons/react';
import clsx from 'clsx';

type ExternalLinkProps = {
  href?: string | null;
  label?: string;
  className?: string;
  openInNewTab?: boolean;
};

const normalizeHref = (href?: string | null) => {
  const trimmedHref = href?.trim();
  if (!trimmedHref) return null;

  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmedHref)) {
    return trimmedHref;
  }

  return /^https?:\/\//i.test(trimmedHref)
    ? trimmedHref
    : `https://${trimmedHref}`;
};

export default function ExternalLink({
  href,
  label,
  className,
  openInNewTab = true,
}: ExternalLinkProps) {
  const normalizedHref = normalizeHref(href);

  if (!normalizedHref) {
    return <span>-</span>;
  }

  const displayLabel = label?.trim() || href?.trim() || normalizedHref;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        if (openInNewTab) {
          window.open(normalizedHref, '_blank', 'noopener,noreferrer');
          return;
        }

        window.location.href = normalizedHref;
      }}
      className={clsx(
        'inline-flex max-w-full items-center gap-1 text-sm font-medium text-(--color-focus-primary) transition-colors hover:underline',
        className
      )}
    >
      <span className="truncate">{displayLabel}</span>
      <ArrowSquareOut size={14} className="shrink-0" />
    </button>
  );
}
