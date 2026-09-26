#!/usr/bin/env python3
"""Pasang narasi Tur terbang dari SATU file audio.

Pakai:  python3 scripts/angkasa-cue-tur.py <file audio> [--first N] [--stops M] [--naskah JSON] [--out M4A]
  Roket: python3 scripts/angkasa-cue-tur.py <audio> --naskah docs/roket/naskah-misi-roket.json --out public/roket/voice/misi-01.m4a
  --first N  nomor persinggahan pertama di audio (1 = Briefing misi, default 1)
  --stops M  jumlah persinggahan di audio (default: sampai akhir naskah)

1. Konversi ke public/angkasa/voice/tur-NN.m4a (AAC 64 kbps, macOS afconvert).
2. Cari jeda hening, lalu pilih jeda yang paling cocok sebagai awal tiap persinggahan & tiap kalimat
   (perkiraan posisi = sebanding panjang teks naskah, docs/angkasa/naskah-tur-terbang.json).
3. Cetak isi TOUR_AUDIO untuk src/lib/angkasa/tourVoice.ts.
"""
import json, subprocess, sys, tempfile, wave, array, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("audio")
ap.add_argument("--first", type=int, default=1)
ap.add_argument("--stops", type=int, default=0)
ap.add_argument("--naskah", default="docs/angkasa/naskah-tur-terbang.json", help="naskah JSON [{id, lines}]")
ap.add_argument("--out", default="", help="berkas m4a keluaran (default public/angkasa/voice/tur-NN.m4a)")
args = ap.parse_args()
src = args.audio
first = args.first - 1
name = f"tur-{args.first:02d}.m4a"
out_m4a = os.path.join(ROOT, args.out) if args.out else os.path.join(ROOT, "public/angkasa/voice", name)
os.makedirs(os.path.dirname(out_m4a), exist_ok=True)
subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "64000", src, out_m4a], check=True)

with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, "a.wav")
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@16000", "-c", "1", src, wav], check=True)
    with wave.open(wav) as w:
        rate = w.getframerate()
        pcm = array.array("h", w.readframes(w.getnframes()))

FR = int(rate * 0.02)  # jendela 20 ms
rms = [math.sqrt(sum(x * x for x in pcm[i:i + FR]) / FR) for i in range(0, len(pcm) - FR, FR)]
dur = len(pcm) / rate
voiced = sorted(r for r in rms if r > 0)
thr = max(voiced[int(len(voiced) * 0.5)] * 0.12, 30) if voiced else 30

# rentang hening ≥ 0,18 s → (tengah, panjang)
sil, start = [], None
for i, r in enumerate(rms + [thr * 10]):
    if r < thr and start is None:
        start = i
    elif r >= thr and start is not None:
        if (i - start) * 0.02 >= 0.18:
            sil.append(((start + i) / 2 * 0.02, (i - start) * 0.02))
        start = None

import re

stops = json.load(open(os.path.join(ROOT, args.naskah)))
stops = stops[first : first + args.stops] if args.stops else stops[first:]
# kalimat berurutan: (persinggahan, baris, panjang)
sents = []
for k, s in enumerate(stops):
    for j, line in enumerate(s["lines"]):
        for part in re.split(r"(?<=[.!?])\s+", line.strip()):
            if part:
                sents.append((k, j, len(part)))

lead = next((c + ln / 2 for c, ln in sil if c - ln / 2 <= 0.05), 0.0)  # hening di awal file
tail = next((ln / 2 for c, ln in sil if c + ln / 2 >= dur - 0.05), 0.0)  # hening di akhir file
end = dur - tail
rate = sum(n for _, _, n in sents) / max(1.0, end - lead)  # karakter per detik rata-rata

# Pencocokan global (DP): setiap akhir kalimat = satu jeda, berurutan. Biaya = selisih durasi kalimat dari
# perkiraan (panjang teks / kecepatan) dikurangi bonus jeda panjang. Tahan terhadap jeda koma & tempo berubah.
cand = [c for c, _ in sil if lead + 0.3 < c < end - 0.3]
clen = [ln for c, ln in sil if lead + 0.3 < c < end - 0.3]
S, N, INF = len(sents), len(cand), float("inf")

def cost(t0, t1, n):
    e = n / rate
    return ((t1 - t0) - e) ** 2 / e

dp = [[INF] * N for _ in range(S - 1)]
bk = [[-1] * N for _ in range(S - 1)]
for c in range(N):
    dp[0][c] = cost(lead, cand[c], sents[0][2]) - 2.0 * clen[c]
for i in range(1, S - 1):
    n = sents[i][2]
    for c in range(i, N):
        best, arg = INF, -1
        for p in range(i - 1, c):
            if dp[i - 1][p] < INF:
                v = dp[i - 1][p] + cost(cand[p], cand[c], n)
                if v < best:
                    best, arg = v, p
        if arg >= 0:
            dp[i][c] = best - 2.0 * clen[c]
            bk[i][c] = arg
last = min(range(N), key=lambda c: dp[S - 2][c] + cost(cand[c], end, sents[-1][2]) if dp[S - 2][c] < INF else INF)
ends = [0.0] * (S - 1)
c = last
for i in range(S - 2, -1, -1):
    ends[i] = cand[c]
    c = bk[i][c]

starts = [0.0] + [round(c, 2) for c in ends]  # detik mulai tiap kalimat
cues, line_cues = [], []
for i, (k, j, _) in enumerate(sents):
    if len(cues) <= k:
        cues.append(starts[i])
        line_cues.append([])
    if len(line_cues[k]) <= j:
        line_cues[k].append(starts[i])

print(f"// durasi {dur:.1f} s · {len(sil)} jeda terdeteksi · ambang {thr:.0f}")
ids = ", ".join(s["id"] for s in stops)
print(f"// bagian untuk TOUR_AUDIO di src/lib/angkasa/tourVoice.ts — persinggahan: {ids}")
print("{")
print(f'  src: "/{os.path.relpath(out_m4a, os.path.join(ROOT, "public"))}",')
print(f"  first: {first},")
print(f"  cues: {json.dumps(cues)},")
print(f"  lineCues: {json.dumps(line_cues)},")
print("},")
