import { defineConfig } from 'orval';

export default defineConfig({
  nutritionApi: {
    input: {
      target: 'http://localhost:8000/openapi.json',
    },
    output: {
      mode: 'split',
      target: './src/api/generated',
      client: 'react-query',
      schemas: './src/api/generated/model',
      prettier: true,
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'page',
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
}); 