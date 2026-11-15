"use client";

// Mode ujian: presenter permainan menyembunyikan semua tombol bantuan (Bantu, Lihat lagi) selama ujian.

import { createContext, useContext } from "react";

const ModeUjian = createContext(false);
export const ModeUjianProvider = ModeUjian.Provider;
export const useModeUjian = () => useContext(ModeUjian);
