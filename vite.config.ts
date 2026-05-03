import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      include: [
        'src/components/common/input.tsx',
        'src/features/login/components/login-form.tsx',
        'src/constants/regex.ts',
        'src/constants/routes.ts',
        'src/features/projects/pages/index.tsx',
      ],
    },
  },
});
