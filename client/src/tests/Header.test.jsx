import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Header from '../components/Header';
import { APP_VERSION } from '../version';

describe('Header', () => {
  afterEach(cleanup);

  it('shows the RevMatch name', () => {
    render(<Header />);
    expect(screen.getByText('RevMatch')).toBeTruthy();
  });

  it('shows the current app version', () => {
    render(<Header />);
    expect(screen.getByTestId('app-version').textContent).toBe(`v${APP_VERSION}`);
  });
});
