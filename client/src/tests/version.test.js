import { describe, it, expect } from 'vitest';
import { APP_VERSION } from '../version';

describe('APP_VERSION', () => {
  it('is a semantic version string', () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
