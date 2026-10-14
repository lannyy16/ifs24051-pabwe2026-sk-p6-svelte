
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import App from './App.svelte';

vi.mock('./helpers/apiHelper.js', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    getToken: () => '',
  };
});

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/auth/login');
  });

  it('shows login for an unauthenticated user on auth route', () => {
    render(App);

    expect(
      screen.getByText('Selamat datang kembali'),
    ).toBeInTheDocument();
  });
});
