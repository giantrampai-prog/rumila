'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { useMe, useRumila } from '@/lib/store';
import {
  STAGES, UMROH_SOURCES, TAWAF_LAP_SECONDS, SAI_LEG_SECONDS, createProgress, completeLesson,
  advancePractice, finishPractice, getStageContent, parseSavedProgress, serializeProgress,
  type UmrohProgress, type UmrohRoute, type UmrohPilgrim,
} from '@/lib/umroh';
import type { UmrohScene } from './scene';
import './umroh.css';

const TOOL_ID = 'petualangan-umroh';
const STAGE_ICONS = ['backpack', 'mosque', 'directions_bus', 'door_open', '360', 'self_improvement', 'water_drop', 'route', 'content_cut', 'check_circle'];
type CameraView = 'walk' | 'follow' | 'overview';
const CAMERA_VIEWS = [
  { id: 'walk', label: 'Jalan kaki', icon: 'directions_walk' },
  { id: 'follow', label: 'Ikuti jamaah', icon: 'person_pin_circle' },
  { id: 'overview', label: 'Lihat kawasan', icon: 'map' },
] as const;
const NABAWI_VISIT = {
  title: 'Mengenal Masjid Nabawi', subtitle: 'Kunjungan pilihan di Madinah',
  instruction: 'Jelajahi halaman, payung peneduh, dan bangunan Masjid Nabawi dari dekat.',
  detail: 'Berkunjung ke Masjid Nabawi bukan rukun umroh dan bukan tempat miqat. Untuk perjalanan dari Madinah, niat ihram dilakukan di Bir Ali sebelum menuju Makkah.',
};

export function UmrohVirtual() {
  const member = useMe();
  return <Journey key={member.id} memberId={member.id} />;
}

function Journey({ memberId }: { memberId: string }) {
  const [progress, setProgress] = useState<UmrohProgress>(() => createProgress());
  const [saved, setSaved] = useState<UmrohProgress | null>(null);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const [showMap, setShowMap] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);
  const [view, setView] = useState<CameraView>('walk');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset'>('day');
  const [practiceSpeed, setPracticeSpeed] = useState<'normal' | 'fast'>('normal');
  const [visit, setVisit] = useState<'nabawi' | null>(null);
  const [landmarks, setLandmarks] = useState<{ id: string; label: string }[]>([]);
  const [sceneError, setSceneError] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(progress.stage);
  const scene = useRef<UmrohScene | null>(null);
  const latest = useRef(progress);
  const pendingLandmark = useRef<string | null>(null);
  const movementPointers = useRef(new Map<number, { forward: number; right: number }>());
  const saveKey = 'rumila-umroh:' + memberId;
  const stageIndex = STAGES.findIndex((s) => s.id === progress.stage);
  const lesson = getStageContent(progress.stage, progress.route, progress.pilgrim);
  const displayedLesson = visit ? NABAWI_VISIT : lesson;
  const dialogOpen = Boolean(saved || showMap || showInfo || showRestart);
  const practice = progress.stage === 'tawaf' || progress.stage === 'sai';
  const practiceDone = practice && progress.count >= 7;
  const finished = progress.stage === 'selesai';
  const duration = progress.stage === 'tawaf' ? TAWAF_LAP_SECONDS : SAI_LEG_SECONDS;
  const practiceRate = progress.stage === 'tawaf' ? (practiceSpeed === 'normal' ? 0.12 : 0.6) : (practiceSpeed === 'normal' ? 0.075 : 0.3);
  latest.current = progress;
  const stopMovement = useCallback(() => {
    movementPointers.current.clear();
    scene.current?.setMovement(0, 0);
  }, []);

  const updateMovement = () => {
    let forward = 0;
    let right = 0;
    movementPointers.current.forEach((direction) => { forward += direction.forward; right += direction.right; });
    scene.current?.setMovement(Math.max(-1, Math.min(1, forward)), Math.max(-1, Math.min(1, right)));
  };

  useEffect(() => {
    try {
      const restored = parseSavedProgress(localStorage.getItem(saveKey));
      if (restored && restored.stage !== 'persiapan') setSaved(restored);
      else if (restored) setProgress(restored);
    } catch { setStorageWarning(true); }
    setReady(true);
    setVoiceAvailable('speechSynthesis' in window);
  }, [saveKey]);

  useEffect(() => {
    if (!ready || saved) return;
    const timer = window.setTimeout(() => {
      try { localStorage.setItem(saveKey, serializeProgress(progress)); }
      catch { setStorageWarning(true); }
    }, 250);
    return () => clearTimeout(timer);
  }, [progress, ready, saved, saveKey]);

  useEffect(() => {
    if (!ready || saved) return;
    const save = () => {
      try { localStorage.setItem(saveKey, serializeProgress(latest.current)); } catch { /* Memory-only when storage is unavailable. */ }
    };
    window.addEventListener('pagehide', save);
    const timer = window.setInterval(save, 1000);
    return () => { save(); window.clearInterval(timer); window.removeEventListener('pagehide', save); };
  }, [ready, saved, saveKey]);

  useEffect(() => {
    let cancelled = false;
    import('./scene').then(({ UmrohScene: Scene }) => {
      if (cancelled || !viewport.current) return;
      try {
        scene.current = new Scene(viewport.current);
        const current = latest.current;
        scene.current.update({ ...current, progress: current.elapsedSeconds / (current.stage === 'tawaf' ? TAWAF_LAP_SECONDS : SAI_LEG_SECONDS), running: false, view: 'walk', timeOfDay: 'day', visit: null });
        setLandmarks(scene.current.getLandmarks());
        setSceneReady(true);
      } catch { setSceneError(true); }
    }).catch(() => { if (!cancelled) setSceneError(true); });
    return () => { cancelled = true; scene.current?.dispose(); scene.current = null; };
  }, []);

  useEffect(() => {
    const currentScene = scene.current;
    if (!currentScene) return;
    currentScene.update({ ...progress, progress: practice ? Math.min(7, progress.elapsedSeconds / duration) : 0, running: running && !visit, view, timeOfDay, visit, paused: dialogOpen });
    if (pendingLandmark.current && !dialogOpen) {
      currentScene.jumpToLandmark(pendingLandmark.current);
      pendingLandmark.current = null;
    }
  }, [progress, practice, duration, running, sceneReady, view, timeOfDay, visit, dialogOpen]);

  useEffect(() => {
    stopMovement();
  }, [dialogOpen, view, visit, progress.stage, stopMovement]);

  useEffect(() => {
    const element = viewport.current;
    const refresh = () => setLandmarks(scene.current?.getLandmarks() ?? []);
    element?.addEventListener('umroh-landmarks-changed', refresh);
    return () => element?.removeEventListener('umroh-landmarks-changed', refresh);
  }, []);

  useEffect(() => {
    setRunning(false);
    setSpeaking(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (previousStage.current !== progress.stage) {
      if (panel.current) panel.current.scrollTop = 0;
      heading.current?.focus({ preventScroll: true });
      previousStage.current = progress.stage;
    }
  }, [progress.stage, visit]);

  useEffect(() => {
    const element = viewport.current;
    const lost = () => { setSceneError(true); setRunning(false); };
    const restored = () => setSceneError(false);
    element?.addEventListener('umroh-context-lost', lost);
    element?.addEventListener('umroh-context-restored', restored);
    return () => { element?.removeEventListener('umroh-context-lost', lost); element?.removeEventListener('umroh-context-restored', restored); };
  }, []);

  useEffect(() => {
    const pause = () => { stopMovement(); setRunning(false); setSpeaking(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', pause);
    return () => { pause(); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', pause); };
  }, [stopMovement]);

  useEffect(() => {
    if (!running || !practice || visit || saved || showMap || showInfo || showRestart) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min((now - previous) / 1000, 0.25);
      previous = now;
      if (document.visibilityState !== 'visible') return;
      const next = advancePractice(latest.current, delta * practiceRate);
      latest.current = next;
      setProgress(next);
      if (next.count >= 7) setRunning(false);
    }, 40);
    return () => clearInterval(timer);
  }, [running, practice, practiceRate, visit, saved, showMap, showInfo, showRestart]);

  const mark = () => useRumila.getState().completeToolItem(memberId, TOOL_ID, 'angkasa', progress.stage);
  const next = () => {
    const updated = practice ? finishPractice(progress) : completeLesson(progress);
    if (updated.stage !== progress.stage) {
      mark();
      setProgress(updated);
      setGuideOpen(true);
      if (updated.stage === 'selesai') useRumila.getState().completeToolItem(memberId, TOOL_ID, 'angkasa', 'rangkaian-selesai');
    }
  };
  const changeSetup = (route: UmrohRoute, pilgrim: UmrohPilgrim) => { setVisit(null); setProgress(createProgress(route, pilgrim)); };
  const reset = () => { const current = saved ?? progress; stopMovement(); setVisit(null); setRunning(false); setSaved(null); setChecks([false, false, false]); setProgress(createProgress(current.route, current.pilgrim)); setShowRestart(false); setGuideOpen(true); };
  const openNabawi = () => { setRunning(false); stopMovement(); setVisit('nabawi'); setShowMap(false); setGuideOpen(true); };
  const returnToLesson = () => { stopMovement(); setVisit(null); setRunning(false); setGuideOpen(true); };
  const jumpTo = (id: string) => {
    pendingLandmark.current = id;
    stopMovement(); setRunning(false); setView('walk'); setShowMap(false);
  };
  const narrate = () => {
    window.speechSynthesis.cancel();
    if (speaking) { setSpeaking(false); return; }
    const speech = new SpeechSynthesisUtterance(displayedLesson.title + '. ' + displayedLesson.instruction + ' ' + displayedLesson.detail);
    speech.lang = 'id-ID'; speech.rate = 0.9;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('id'));
    if (voice) speech.voice = voice;
    speech.onend = speech.onerror = () => setSpeaking(false);
    setSpeaking(true); window.speechSynthesis.speak(speech);
  };
  const primaryAction = visit
    ? <button className="umroh-primary" onClick={returnToLesson}><Icon name="arrow_back" />Kembali ke pelajaran</button>
    : practice && !practiceDone
      ? <button className="umroh-primary" disabled={!ready || (!sceneReady && !sceneError)} onClick={() => setRunning(!running)}><Icon name={running ? 'pause' : 'play_arrow'} />{running ? 'Jeda perjalanan' : progress.elapsedSeconds > 0 ? 'Lanjutkan ' + (progress.stage === 'tawaf' ? 'tawaf' : 'sa’i') : 'Mulai ' + (progress.stage === 'tawaf' ? 'tawaf' : 'sa’i')}</button>
      : finished
        ? <Link className="umroh-primary" href="/beranda/angkasa"><Icon name="home" />Kembali ke Petualangan 3D</Link>
        : <button className="umroh-primary" disabled={!ready || (progress.stage === 'persiapan' && !checks.every(Boolean))} onClick={next}>{lesson.action}<Icon name="arrow_forward" /></button>;

  return (
    <main className={'umroh-app ' + (guideOpen ? 'guide-open' : 'guide-closed')}>
      <header className="umroh-header">
        <Link href="/beranda/angkasa" className="umroh-icon-btn" aria-label="Kembali ke Petualangan 3D"><Icon name="arrow_back" /></Link>
        <div className="umroh-title"><span>JELAJAH & BELAJAR</span><h1>Umroh Virtual</h1></div>
        <div className="umroh-header-actions">
          <button className="umroh-outline-btn" aria-label="Lihat lokasi dan rangkaian umroh" onClick={() => { setRunning(false); setShowMap(true); }}><Icon name="map" /><span>Peta & rangkaian</span></button>
          <button className={'umroh-outline-btn umroh-guide-toggle ' + (guideOpen ? 'selected' : '')} aria-expanded={guideOpen} aria-controls="umroh-guide" onClick={() => { stopMovement(); setGuideOpen(!guideOpen); }}><Icon name="menu_book" /><span>Panduan</span></button>
          <button className="umroh-icon-btn" aria-label="Tentang panduan" onClick={() => { setRunning(false); setShowInfo(true); }}><Icon name="info" /></button>
        </div>
      </header>

      <div className="umroh-layout">
        <section className="umroh-world" aria-label="Dunia umroh tiga dimensi">
          <div ref={viewport} className="umroh-viewport" />
          <div className="umroh-scene-label"><span className="umroh-live-dot" /><div><span>{visit ? 'MASJID NABAWI · MADINAH' : progress.stage === 'persiapan' || progress.stage === 'miqat' ? (progress.route === 'madinah' ? 'BIR ALI · MADINAH' : 'PERJALANAN · PESAWAT') : progress.stage === 'perjalanan' ? 'MENUJU MAKKAH' : progress.stage === 'sai' ? 'SAFA & MARWAH' : progress.stage === 'tahallul' || finished ? 'MENUNTASKAN UMROH' : 'MASJIDIL HARAM'}</span><small>{visit ? 'Kunjungan pilihan · di luar rangkaian umroh' : 'Visualisasi tempat untuk pembelajaran'}</small></div></div>
          {!sceneReady && !sceneError && <div className="umroh-loading" role="status"><Icon name="mosque" size={40} /><span>Menyiapkan perjalanan…</span></div>}
          {sceneError && <div className="umroh-loading"><Icon name="view_in_ar" size={40} /><strong>Tampilan 3D belum bisa dibuka</strong><p>Coba browser yang mendukung WebGL. Panduan langkah tetap bisa dibaca di sini.</p></div>}
          <div className="umroh-camera-toolbar">
            <div className="umroh-segmented" role="group" aria-label="Cara menjelajah">{CAMERA_VIEWS.map((mode) => <button key={mode.id} aria-pressed={view === mode.id} onClick={() => { stopMovement(); setView(mode.id); }}><Icon name={mode.icon} size={18} /><span>{mode.label}</span></button>)}</div>
            <div className="umroh-segmented umroh-time" role="group" aria-label="Suasana cahaya"><button aria-label="Siang" aria-pressed={timeOfDay === 'day'} onClick={() => setTimeOfDay('day')}><Icon name="light_mode" size={17} /><span>Siang</span></button><button aria-label="Senja" aria-pressed={timeOfDay === 'sunset'} onClick={() => setTimeOfDay('sunset')}><Icon name="wb_twilight" size={17} /><span>Senja</span></button></div>
          </div>
          {practice && !visit && <div className="umroh-counter" aria-live="polite"><span>{progress.stage === 'tawaf' ? 'PUTARAN TAWAF' : 'PERJALANAN SA’I'}</span><strong>{progress.count}<small> / 7</small></strong><div>{practiceDone ? (progress.stage === 'tawaf' ? 'Tujuh putaran lengkap' : 'Tujuh perjalanan lengkap') : progress.stage === 'sai' ? (progress.count % 2 === 0 ? 'Safa → Marwah' : 'Marwah → Safa') : 'Ka’bah di sebelah kiri'}</div></div>}
          <button className="umroh-icon-btn umroh-reset-camera" aria-label="Atur ulang kamera" onClick={() => { stopMovement(); scene.current?.resetCamera(); }}><Icon name="center_focus_strong" /></button>
          {view === 'walk' && !dialogOpen && <div className="umroh-dpad" role="group" aria-label="Navigasi jalan kaki">{[
            { id: 'forward', label: 'Maju', icon: 'keyboard_arrow_up', forward: 1, right: 0 },
            { id: 'left', label: 'Ke kiri', icon: 'keyboard_arrow_left', forward: 0, right: -1 },
            { id: 'back', label: 'Mundur', icon: 'keyboard_arrow_down', forward: -1, right: 0 },
            { id: 'right', label: 'Ke kanan', icon: 'keyboard_arrow_right', forward: 0, right: 1 },
          ].map((direction) => <button key={direction.id} className={'umroh-move-' + direction.id} aria-label={direction.label}
            onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); movementPointers.current.set(event.pointerId, direction); updateMovement(); }}
            onPointerUp={(event) => { movementPointers.current.delete(event.pointerId); updateMovement(); }}
            onPointerCancel={(event) => { movementPointers.current.delete(event.pointerId); updateMovement(); }}
            onLostPointerCapture={(event) => { movementPointers.current.delete(event.pointerId); updateMovement(); }}
            onContextMenu={(event) => event.preventDefault()}><Icon name={direction.icon} size={26} /></button>)}</div>}
          <div className="umroh-scene-footer"><Icon name={view === 'walk' ? 'directions_walk' : 'pan_tool_alt'} size={16} /><span className="umroh-desktop-hint">{view === 'walk' ? 'WASD / tombol arah · Geser untuk melihat' : 'Geser untuk melihat · Gulir untuk mendekat'}</span><span className="umroh-touch-hint">{view === 'walk' ? 'Tombol arah untuk berjalan · Geser untuk melihat' : 'Geser untuk melihat · Cubit untuk mendekat'}</span></div>
          <div className="umroh-action-dock"><div className="umroh-dock-caption"><span>{visit ? 'KUNJUNGAN PILIHAN' : finished ? 'PELAJARAN SELESAI' : 'LANGKAH ' + (stageIndex + 1) + ' / ' + (STAGES.length - 1)}</span><strong>{displayedLesson.title}</strong></div>{primaryAction}</div>
        </section>

        <section id="umroh-guide" ref={panel} className="umroh-panel" hidden={!guideOpen} aria-label="Panduan langkah umroh">
          <div className="umroh-panel-top"><span>PANDUAN PERJALANAN</span><button className="umroh-icon-btn" aria-label="Tutup panduan untuk menjelajah" onClick={() => setGuideOpen(false)}><Icon name="close" size={18} /></button></div>
          <div className="umroh-step-heading"><span className="umroh-step-icon"><Icon name={visit ? 'mosque' : STAGE_ICONS[stageIndex]} size={23} /></span><div><span className="umroh-eyebrow">{visit ? 'KUNJUNGAN PILIHAN' : finished ? 'RANGKAIAN TUNTAS' : 'LANGKAH ' + (stageIndex + 1) + ' DARI ' + (STAGES.length - 1)}</span><h2 ref={heading} tabIndex={-1}>{displayedLesson.title}</h2></div></div>
          {!visit && <div className="umroh-progress-track" aria-label="Progres rangkaian" role="progressbar" aria-valuenow={stageIndex} aria-valuemin={0} aria-valuemax={STAGES.length - 1}><span style={{ width: (stageIndex / (STAGES.length - 1)) * 100 + '%' }} /></div>}
          <p className="umroh-subtitle">{displayedLesson.subtitle}</p>
          <p className="umroh-instruction">{displayedLesson.instruction}</p>

          {!visit && progress.stage === 'persiapan' && <div className="umroh-setup">
            <fieldset><legend>Perjalanan kita</legend><div className="umroh-choice-row">{([{ id: 'madinah', name: 'Dari Madinah', sub: 'Miqat di Bir Ali', icon: 'mosque' }, { id: 'pesawat', name: 'Dengan pesawat', sub: 'Bersiap sebelum miqat', icon: 'flight' }] as const).map((r) => <button key={r.id} className={'umroh-choice ' + (progress.route === r.id ? 'selected' : '')} aria-pressed={progress.route === r.id} onClick={() => changeSetup(r.id, progress.pilgrim)}><Icon name={r.icon} /><strong>{r.name}</strong><span>{r.sub}</span></button>)}</div></fieldset>
            <fieldset><legend>Panduan untuk</legend><div className="umroh-choice-row">{(['putra', 'putri'] as const).map((p) => <button key={p} className={'umroh-choice umroh-choice-small ' + (progress.pilgrim === p ? 'selected' : '')} aria-pressed={progress.pilgrim === p} onClick={() => changeSetup(progress.route, p)}>{p === 'putra' ? 'Laki-laki' : 'Perempuan'}</button>)}</div></fieldset>
            {progress.route === 'madinah' && <button className="umroh-visit-button" onClick={openNabawi}><Icon name="mosque" size={22} /><span><strong>Kunjungi Masjid Nabawi</strong><small>Pilihan tambahan, bukan bagian rukun umroh</small></span><Icon name="arrow_outward" size={18} /></button>}
            <div className="umroh-checklist">{['Mengenal pakaian ihram', 'Membaca panduan persiapan di bawah', 'Siap belajar dengan tertib'].map((label, i) => <label key={label}><input type="checkbox" checked={checks[i]} onChange={() => setChecks((v) => v.map((checked, n) => n === i ? !checked : checked))} /><span>{label}</span></label>)}</div>
          </div>}

          <div className="umroh-note"><Icon name="lightbulb" size={19} /><p>{displayedLesson.detail}</p></div>
          {!visit && lesson.dua && <details className="umroh-dua"><summary><Icon name="menu_book" size={18} />Bacaan & arti<Icon name="expand_more" size={18} /></summary><p lang="ar" dir="rtl" className="umroh-arabic">{lesson.dua.arabic}</p><p className="umroh-latin">{lesson.dua.latin}</p><p>{lesson.dua.meaning}</p></details>}

          {!visit && practice && <div className="umroh-practice"><div className="umroh-laps" aria-label={String(progress.count) + ' dari 7 selesai'}>{Array.from({ length: 7 }, (_, i) => <span key={i} className={i < progress.count ? 'done' : i === progress.count ? 'current' : ''}>{i < progress.count ? <Icon name="check" size={16} /> : i + 1}</span>)}</div><p>{progress.stage === 'sai' ? 'Safa → Marwah dihitung satu kali. Pulang ke Safa dihitung satu kali lagi.' : 'Ikuti lintasan berlawanan arah jarum jam, dari garis Hajar Aswad.'}</p><div className="umroh-speed-control"><span>Kecepatan latihan</span><div className="umroh-segmented" role="group" aria-label="Kecepatan latihan"><button aria-pressed={practiceSpeed === 'normal'} onClick={() => setPracticeSpeed('normal')}>Normal</button><button aria-pressed={practiceSpeed === 'fast'} onClick={() => setPracticeSpeed('fast')}>Dipercepat</button></div></div><span className="umroh-sim-note">{practiceSpeed === 'fast' ? 'Gerak dipercepat untuk belajar. Durasi ini bukan durasi ibadah sebenarnya.' : 'Gerak berjalan biasa. Pilih Dipercepat untuk mempersingkat latihan.'}</span></div>}

          {!visit && finished && <div className="umroh-complete"><Icon name="check_circle" size={32} /><strong>Perjalanan belajar selesai</strong><p>Kamu sudah mengenal rangkaian dari miqat sampai tahallul. Ulangi bersama orang tua atau pembimbing agar makin paham.</p></div>}

          <div className="umroh-panel-actions">
            <div className="umroh-secondary-actions">{voiceAvailable && <button onClick={narrate} aria-pressed={speaking}><Icon name={speaking ? 'stop_circle' : 'volume_up'} size={19} />{speaking ? 'Hentikan suara' : 'Bacakan panduan'}</button>}<button onClick={() => { setRunning(false); setShowRestart(true); }}><Icon name="restart_alt" size={19} />Ulangi</button></div>
            <p className="umroh-save-note">{storageWarning ? 'Penyimpanan tidak tersedia; progres hanya tersimpan selama halaman ini terbuka.' : 'Perjalanan tersimpan di perangkat ini untuk profilmu.'}</p>
          </div>
        </section>
      </div>

      {saved && <Modal title="Lanjutkan perjalananmu?" onClose={() => { setProgress(saved); setSaved(null); }}><p>Terakhir kamu sampai di <strong>{getStageContent(saved.stage, saved.route, saved.pilgrim).title}</strong>. Perjalanan dilanjutkan dalam keadaan jeda.</p><button className="umroh-primary" onClick={() => { setProgress(saved); setSaved(null); }}>Lanjutkan perjalanan<Icon name="arrow_forward" /></button><button className="umroh-outline-btn umroh-full" onClick={reset}>Mulai dari persiapan</button></Modal>}
      {showRestart && <Modal title="Mulai dari awal?" onClose={() => setShowRestart(false)}><p>Posisi latihan ini akan kembali ke persiapan. Catatan materi yang sudah dipelajari tetap ada.</p><button className="umroh-primary" onClick={reset}>Ya, ulangi rangkaian</button><button className="umroh-outline-btn umroh-full" onClick={() => setShowRestart(false)}>Kembali ke latihan</button></Modal>}
      {showMap && <Modal title="Peta & rangkaian" onClose={() => setShowMap(false)}>{landmarks.length > 0 && <><h3 className="umroh-dialog-label">Jelajahi lokasi ini</h3><div className="umroh-landmark-list">{landmarks.map((landmark) => <button key={landmark.id} onClick={() => jumpTo(landmark.id)}><Icon name="location_on" size={18} /><span>{landmark.label}</span><Icon name="arrow_forward" size={17} /></button>)}</div></>}{progress.route === 'madinah' && <div className="umroh-map-visit">{visit ? <button className="umroh-outline-btn umroh-full" onClick={() => { returnToLesson(); setShowMap(false); }}><Icon name="arrow_back" size={18} />Kembali ke pelajaran</button> : <button className="umroh-visit-button" onClick={openNabawi}><Icon name="mosque" /><span><strong>Kunjungi Masjid Nabawi</strong><small>Kunjungan pilihan di Madinah</small></span><Icon name="arrow_outward" size={18} /></button>}</div>}<h3 className="umroh-dialog-label">Urutan pelajaran umroh</h3><ol className="umroh-map-list">{STAGES.map((s, i) => <li key={s.id} className={i === stageIndex ? 'active' : ''} aria-current={i === stageIndex ? 'step' : undefined}><span>{i < stageIndex ? <Icon name="check" size={17} /> : i + 1}</span><div><strong>{s.title}</strong><small>{i < stageIndex ? 'Sudah dipelajari' : i === stageIndex ? 'Pelajaranmu saat ini' : 'Langkah berikutnya'}</small></div></li>)}</ol></Modal>}
      {showInfo && <Modal title="Tentang perjalanan ini" onClose={() => setShowInfo(false)}><p>Jelajahi tempat-tempat dalam rangkaian umroh, lalu ikuti panduan langkah demi langkah. Bangunan dan lingkungan dibuat sebagai visualisasi untuk belajar, bukan denah terukur atau petunjuk navigasi di lokasi sebenarnya.</p><p>Kunjungan ke Masjid Nabawi bersifat pilihan dan bukan rukun umroh. Miqat untuk perjalanan dari Madinah berada di Bir Ali.</p><p>Salat setelah tawaf, minum Zamzam, dan bacaan anjuran ditampilkan sebagai panduan, bukan semuanya rukun umroh. Gunakan bersama arahan pembimbing manasik; simulasi tidak menggantikan ibadah dan tidak menilai sahnya ibadah.</p>{UMROH_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}<p className="umroh-asset-note">Tekstur marmer: Rob Tuytel / Poly Haven, CC0. <a href="https://polyhaven.com/a/marble_01" target="_blank" rel="noreferrer">Lihat sumber tekstur ↗</a></p></Modal>}
    </main>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className="umroh-dialog" aria-label={title} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="umroh-dialog-content"><header><h2>{title}</h2><button className="umroh-icon-btn" aria-label="Tutup" onClick={onClose}><Icon name="close" /></button></header>{children}</div></dialog>;
}
