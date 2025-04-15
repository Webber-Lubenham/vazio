import type { Config } from 'orval';

const config: Config = {
  api: {
    output: {
      mode: 'split',
      target: 'src/api/generated',
      schemas: 'src/api/model',
      client: 'react-query',
      mock: true,
      prettier: true,
      clean: true,
    },
    input: {
      target: './openapi.json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};

export default config; 