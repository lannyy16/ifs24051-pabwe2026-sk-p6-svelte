import Swal from 'sweetalert2';
export function isValidEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim()); }
export function getInitials(value = '') { return String(value).trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join(''); }
export function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
}
export function unwrapData(payload, key, fallback = null) { return payload?.data?.[key] ?? fallback; }
export async function showErrorDialog(message) { return Swal.fire({ icon: 'error', title: 'Terjadi kesalahan', text: message || 'Silakan coba lagi.' }); }
export async function showSuccessDialog(message) { return Swal.fire({ icon: 'success', title: 'Berhasil', text: message || 'Perubahan tersimpan.' }); }
export async function confirmDialog(message) {
  const result = await Swal.fire({ icon: 'warning', title: 'Apakah kamu yakin?', text: message, showCancelButton: true, confirmButtonText: 'Ya, lanjutkan', cancelButtonText: 'Batal' });
  return result.isConfirmed;
}
