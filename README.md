# Delcom Link Tree — Studi Kasus 1 PABWE 2026

Aplikasi Svelte 5 + Vite (JavaScript) untuk mengelola kumpulan tautan melalui Delcom Open API.

## Kebutuhan
- Bun
- Akses jaringan ke `https://open-api.delcom.org/api/v1`

## Menjalankan di Windows PowerShell
```powershell
cd E:\Semester 5\PABWE
Expand-Archive .\ifs24051-pabwe2026-sk-p6-svelte.zip -DestinationPath .
cd .\ifs24051-pabwe2026-sk-p6-svelte
bun install
bun run dev
```
Buka `http://localhost:3004`.

## Perintah pemeriksaan
```powershell
bun run test
bun run test:coverage
bun run build
bun run preview
```

## Catatan implementasi penting
- Status respons API yang dianggap berhasil harus `"success"`.
- `apiHelper.js` otomatis menambahkan `Authorization: Bearer <token>` bila token tersedia.
- Endpoint modul Link Tree dikumpulkan di `src/features/linktrees/api/linkTreeApi.js`.
- Router menggunakan History API dan store Svelte, mengikuti latihan 2.1.
- Konfigurasi threshold coverage 100% sudah disiapkan. Jalankan tes dan gunakan laporan coverage untuk menutup cabang yang belum diuji; karena endpoint dan skema respons API perlu diverifikasi terhadap server Delcom aktif, jangan menganggap coverage atau integrasi sudah lulus sebelum menjalankan perintah di lingkunganmu.
