// Font sertifikat ditanam lewat next/font (tidak bergantung font yang terpasang di perangkat pencetak).
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";

export const fontSerif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--ff-sert-serif" });
export const fontSkrip = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--ff-sert-skrip" });
export const KELAS_FONT_SERTIFIKAT = `${fontSerif.variable} ${fontSkrip.variable}`;
