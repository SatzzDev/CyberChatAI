# CYON AI 

CYON AI adalah aplikasi chat dengan tema cyber yang menggunakan OpenAI API. Aplikasi ini memiliki fitur tampilan code block yang bagus dengan tombol copy, efek suara notifikasi, dan antarmuka yang menarik dengan desain cyberpunk.

## Fitur Utama

- Antarmuka pengguna dengan tema cyberpunk yang menarik
- Persistensi username untuk pengguna
- Tampilan blok kode dengan syntax highlighting dan tombol copy
- Efek suara untuk notifikasi pesan terkirim dan diterima
- Tampilan pesan pengguna segera setelah pengiriman
- Favicon dan logo custom CYON
- Footer dengan informasi aplikasi

## Teknologi yang Digunakan

- React + Vite untuk frontend
- Express.js untuk backend
- TailwindCSS untuk styling
- OpenAI API untuk integrasi AI
- Vercel untuk deployment

## Cara Deploy ke Vercel

1. Pastikan repository sudah di-push ke GitHub

2. Kunjungi [Vercel](https://vercel.com) dan buat akun baru jika belum memilikinya

3. Klik "New Project" dan import repository GitHub Anda

4. Pada Environment Variables, tambahkan:
   - `OPENAI_API_KEY`: API key dari OpenAI

5. Deploy aplikasi

## Pengaturan Backend

Aplikasi ini menggunakan Node.js dan Express untuk backend. File utama berada di `server/index.ts`.

## Pengaturan Frontend

Frontend aplikasi menggunakan React dan Vite, dengan file utama di `client/src/App.tsx` dan komponen lainnya di `client/src/components/`.

## Cara Menjalankan Aplikasi Secara Lokal

1. Install dependensi:
   ```
   npm install
   ```

2. Jalankan aplikasi dalam mode development:
   ```
   npm run dev
   ```

3. Buka browser dan akses `http://localhost:5000`

## Build untuk Production

Untuk membangun aplikasi untuk production:

```
npm run build
```

Hasil build akan tersedia di folder `dist/`.

## Lisensi

MIT
