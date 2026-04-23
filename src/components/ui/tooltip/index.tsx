import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'right',
  className,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  if (disabled) return <>{children}</>;

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 8; // 8px spacing
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 8;
          break;
        case 'top':
          top = rect.top - 8;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;
      }
      setCoords({ top, left });
      setIsVisible(true);
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={clsx('relative flex items-center', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            className="fixed z-9999 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md whitespace-nowrap pointer-events-none"
            style={{
              top: coords.top,
              left: coords.left,
              transform:
                position === 'left'
                  ? 'translate(-100%, -50%)'
                  : position === 'right'
                    ? 'translate(0, -50%)'
                    : position === 'top'
                      ? 'translate(-50%, -100%)'
                      : 'translate(-50%, 0)', // bottom
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
