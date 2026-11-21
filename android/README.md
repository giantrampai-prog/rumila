# RINOYA Academy — Android (TWA)

Aplikasi Android ini membungkus web `https://kampus.pulaurinoya.com` (Trusted Web Activity), mulai di `/beranda`.
Isi app ikut web, jadi update konten/fitur cukup deploy web. Build ulang hanya untuk ganti ikon, nama, warna, atau versi.

- Package: `com.pulaurinoya.academy`
- Konfigurasi: `twa-manifest.json` (dibuat dengan @bubblewrap/core)
- Upload key: `~/.rinoya-android/upload.keystore` (alias `upload`, sandi di `~/.rinoya-android/kunci.txt`) — TIDAK di repo, backup aman!
- Verifikasi domain: `public/.well-known/assetlinks.json` (SHA-256 upload key; tambahkan SHA-256 "App signing key" dari Play Console setelah upload pertama)

## Build

```bash
cd android
echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
JAVA_HOME=/opt/homebrew/opt/openjdk@17 ./gradlew bundleRelease assembleRelease
```

Lalu tanda tangani AAB dengan `jarsigner` dan APK dengan `zipalign` + `apksigner` memakai upload key.
Naikkan `appVersionCode`/`appVersionName` (twa-manifest.json dan app/build.gradle) setiap rilis baru.
