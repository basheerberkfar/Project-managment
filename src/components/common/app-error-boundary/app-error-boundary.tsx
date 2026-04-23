// AppErrorBoundary.tsx
import React from 'react';
import * as Sentry from '@sentry/react';
import DefaultErrorFallback from './default-error-fallback';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactElement;
}

const AppErrorBoundary = ({ children, fallback }: Props) => {
  return (
    <Sentry.ErrorBoundary
      fallback={fallback ?? <DefaultErrorFallback />}
      showDialog
      beforeCapture={(scope) => {
        scope.setTag('source', 'react-error-boundary');
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default AppErrorBoundary;
