# Template email Supabase Auth (RINOYA Academy)

Dipasang manual di Supabase project rumila → Authentication → Emails → Templates (21 Nov 2026).
Pengirim: SMTP Resend `kampus@pulaurinoya.com` ("RINOYA Academy"), domain diverifikasi di Resend (region Tokyo),
DNS di Cloudflare (pulaurinoya.com). Balasan ke kampus@ lewat Cloudflare Email Routing.

| Berkas | Template Supabase | Subjek |
|---|---|---|
| konfirmasi.html | Confirm signup | Konfirmasi akun RINOYA Academy |
| atur-ulang-sandi.html | Reset password | Buat kata sandi baru RINOYA Academy |
| tautan-masuk.html | Magic link | Tautan masuk RINOYA Academy |
| ganti-email.html | Change email address | Konfirmasi email baru RINOYA Academy |

Ubah berkas di sini lalu salin ulang ke dashboard. Tautan reset kembali ke `/masuk/sandi-baru`, jadi
`https://rumila.vercel.app/**` (dan domain Academy nanti) harus ada di Authentication → URL Configuration → Redirect URLs.
