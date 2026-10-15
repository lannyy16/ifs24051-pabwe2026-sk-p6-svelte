import { vi, beforeEach } from 'vitest';

// Mock SweetAlert2 secara global agar tidak error di setiap test
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true })
  }
}));

// Reset semua mock sebelum setiap test
beforeEach(() => {
  vi.clearAllMocks();
});