import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock SweetAlert2 sebelum diimpor oleh file helper
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

import Swal from 'sweetalert2';

import {
  isValidEmail,
  getInitials,
  formatDate,
  unwrapData,
  showErrorDialog,
  showSuccessDialog,
  confirmDialog,
} from './toolsHelper';

// Reset mock sebelum setiap pengujian
beforeEach(() => {
  vi.clearAllMocks();

  // Mencegah tes dialog menunggu interaksi pengguna
  Swal.fire.mockResolvedValue({});
});

// ==========================================
// 1. TEST isValidEmail
// ==========================================
describe('isValidEmail', () => {
  it('harus mengembalikan true untuk email valid', () => {
    expect(isValidEmail('budi@example.com')).toBe(true);
    expect(isValidEmail('  budi@example.com  ')).toBe(true);
  });

  it('harus mengembalikan false untuk email tidak valid', () => {
    expect(isValidEmail('budi')).toBe(false);
    expect(isValidEmail('budi@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('harus mengembalikan false untuk input kosong/null/undefined', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
  });
});

// ==========================================
// 2. TEST getInitials
// ==========================================
describe('getInitials', () => {
  it('harus mengembalikan 2 inisial dari nama lengkap', () => {
    expect(getInitials('Budi Santoso')).toBe('BS');
    expect(getInitials('Ani')).toBe('A');
    expect(getInitials('Budi Santoso Wijaya')).toBe('BS');
  });

  it('harus menangani spasi berlebih', () => {
    expect(getInitials('  Budi   Santoso  ')).toBe('BS');
  });

  it('harus mengembalikan string kosong untuk input kosong', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
    expect(getInitials()).toBe('');
  });
});

// ==========================================
// 3. TEST formatDate
// ==========================================
describe('formatDate', () => {
  it('harus memformat tanggal valid', () => {
    const result = formatDate('2023-10-15');

    expect(result).toContain('2023');
    expect(result).toContain('Okt');
  });

  it('harus mengembalikan "-" untuk input kosong', () => {
    expect(formatDate('')).toBe('-');
    expect(formatDate(null)).toBe('-');
    expect(formatDate(undefined)).toBe('-');
  });

  it('harus mengembalikan "-" untuk tanggal tidak valid', () => {
    expect(formatDate('bukan-tanggal')).toBe('-');
  });
});

// ==========================================
// 4. TEST unwrapData
// ==========================================
describe('unwrapData', () => {
  it('harus mengambil data dari payload', () => {
    const payload = {
      data: {
        user: {
          id: 1,
          name: 'Budi',
        },
      },
    };

    expect(unwrapData(payload, 'user')).toEqual({
      id: 1,
      name: 'Budi',
    });
  });

  it('harus mengembalikan fallback jika key tidak ada', () => {
    const payload = {
      data: {
        user: {
          id: 1,
        },
      },
    };

    expect(unwrapData(payload, 'admin', 'default')).toBe('default');
  });

  it('harus mengembalikan null jika payload kosong', () => {
    expect(unwrapData({}, 'user')).toBeNull();
    expect(unwrapData(null, 'user')).toBeNull();
  });
});

// ==========================================
// 5. TEST Dialogs
// ==========================================
describe('Dialogs', () => {
  it('showErrorDialog harus pakai pesan kustom', async () => {
    await showErrorDialog('Gagal login');

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Terjadi kesalahan',
      text: 'Gagal login',
    });
  });

  it('showErrorDialog harus pakai pesan default', async () => {
    await showErrorDialog();

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Terjadi kesalahan',
      text: 'Silakan coba lagi.',
    });
  });

  it('showErrorDialog harus pakai pesan default jika kosong', async () => {
    await showErrorDialog('');

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Terjadi kesalahan',
      text: 'Silakan coba lagi.',
    });
  });

  it('showSuccessDialog harus pakai pesan kustom', async () => {
    await showSuccessDialog('Data tersimpan');

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'success',
      title: 'Berhasil',
      text: 'Data tersimpan',
    });
  });

  it('showSuccessDialog harus pakai pesan default', async () => {
    await showSuccessDialog();

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'success',
      title: 'Berhasil',
      text: 'Perubahan tersimpan.',
    });
  });

  it('confirmDialog harus mengembalikan true jika dikonfirmasi', async () => {
    Swal.fire.mockResolvedValueOnce({
      isConfirmed: true,
    });

    const result = await confirmDialog('Hapus data?');

    expect(result).toBe(true);
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'warning',
      title: 'Apakah kamu yakin?',
      text: 'Hapus data?',
      showCancelButton: true,
      confirmButtonText: 'Ya, lanjutkan',
      cancelButtonText: 'Batal',
    });
  });

  it('confirmDialog harus mengembalikan false jika dibatalkan', async () => {
    Swal.fire.mockResolvedValueOnce({
      isConfirmed: false,
    });

    const result = await confirmDialog('Hapus data?');

    expect(result).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'warning',
      title: 'Apakah kamu yakin?',
      text: 'Hapus data?',
      showCancelButton: true,
      confirmButtonText: 'Ya, lanjutkan',
      cancelButtonText: 'Batal',
    });
  });
});