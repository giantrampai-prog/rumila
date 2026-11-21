# RINOYA Academy — iOS (Capacitor)

Pembungkus iOS yang membuka `https://kampus.pulaurinoya.com/beranda?mode=app`. Isi aplikasi mengikuti web, jadi
update konten cukup deploy web. `?mode=app` menyembunyikan harga & pembayaran (aturan App Store, lihat `src/lib/mode-app.ts`).

- Bundle ID: `com.pulaurinoya.academy` · nama di layar: **RINOYA** · iPhone (versi 1)
- Tanpa internet: `www/offline.html` ("Belum tersambung" + Coba lagi)
- Screenshot App Store (iPhone 6,9"): `store/iphone-6.9/`

## Build & upload
```bash
cd aplikasi-ios && npm install && npx cap sync ios
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath build/App.xcarchive -allowProvisioningUpdates archive
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build -allowProvisioningUpdates
```
Naikkan `CURRENT_PROJECT_VERSION` (build) tiap upload, dan `MARKETING_VERSION` untuk versi baru.
