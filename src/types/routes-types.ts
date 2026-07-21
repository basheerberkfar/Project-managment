import type React from 'react';

export type Routes = {
  readonly path?: string; // optional if it's an index route
  readonly index?: boolean;
  readonly element: React.ReactElement;
  readonly children?: Routes[];
};
