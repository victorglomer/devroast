import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
      },
    },
  });
}

export const getQueryClient = cache(makeQueryClient);
