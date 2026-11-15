// Font sertifikat ditanam dari berkas di repo (next/font/local, lisensi SIL OFL) — build tidak bergantung pada
// unduhan Google Fonts dan dokumen tidak bergantung font yang terpasang di perangkat pencetak.
import localFont from "next/font/local";

export const fontSerif = localFont({
  src: [
    { path: "../../fonts/sertifikat/CormorantGaramond-var.woff2", weight: "500 700", style: "normal" },
    { path: "../../fonts/sertifikat/CormorantGaramond-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--ff-sert-serif",
  display: "swap",
});
export const fontSkrip = localFont({ src: "../../fonts/sertifikat/GreatVibes-400.woff2", weight: "400", variable: "--ff-sert-skrip", display: "swap" });
export const KELAS_FONT_SERTIFIKAT = `${fontSerif.variable} ${fontSkrip.variable}`;
