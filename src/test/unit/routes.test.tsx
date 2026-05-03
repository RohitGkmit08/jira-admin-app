import { describe, test, expect } from 'vitest';

import { ROUTES } from '../../constants/routes';

describe('Routes constants', () => {
  test('projects route exists', () => {
    expect(ROUTES.APP.PROJECTS).toBe('/projects');
  });
});
