'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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
  const saveKey = 'rumila-umroh:' + memberId;
  const stageIndex = STAGES.findIndex((s) => s.id === progress.stage);
  const lesson = getStageContent(progress.stage, progress.route, progress.pilgrim);
  const practice = progress.stage === 'tawaf' || progress.stage === 'sai';
  const practiceDone = practice && progress.count >= 7;
  const finished = progress.stage === 'selesai';
  const duration = progress.stage === 'tawaf' ? TAWAF_LAP_SECONDS : SAI_LEG_SECONDS;
  latest.current = progress;

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
        scene.current.update({ ...current, progress: current.elapsedSeconds / (current.stage === 'tawaf' ? TAWAF_LAP_SECONDS : SAI_LEG_SECONDS), running: false });
        setSceneReady(true);
      } catch { setSceneError(true); }
    }).catch(() => { if (!cancelled) setSceneError(true); });
    return () => { cancelled = true; scene.current?.dispose(); scene.current = null; };
  }, []);

  useEffect(() => {
    scene.current?.update({ ...progress, progress: practice ? Math.min(7, progress.elapsedSeconds / duration) : 0, running });
  }, [progress, practice, duration, running, sceneReady]);

  useEffect(() => {
    setRunning(false);
    setSpeaking(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (previousStage.current !== progress.stage) {
      if (panel.current) panel.current.scrollTop = 0;
      if (window.matchMedia('(max-width: 800px)').matches) window.scrollTo({ top: 0, behavior: 'instant' });
      heading.current?.focus({ preventScroll: true });
      previousStage.current = progress.stage;
    }
  }, [progress.stage]);

  useEffect(() => {
    const element = viewport.current;
    const lost = () => { setSceneError(true); setRunning(false); };
    const restored = () => setSceneError(false);
    element?.addEventListener('umroh-context-lost', lost);
    element?.addEventListener('umroh-context-restored', restored);
    return () => { element?.removeEventListener('umroh-context-lost', lost); element?.removeEventListener('umroh-context-restored', restored); };
  }, []);

  useEffect(() => {
    const pause = () => { setRunning(false); setSpeaking(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', pause);
    return () => { pause(); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', pause); };
  }, []);

  useEffect(() => {
    if (!running || !practice || saved || showMap || showInfo || showRestart) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min((now - previous) / 1000, 0.25);
      previous = now;
      if (document.visibilityState !== 'visible') return;
      const next = advancePractice(latest.current, delta);
      latest.current = next;
      setProgress(next);
      if (next.count >= 7) setRunning(false);
    }, 40);
    return () => clearInterval(timer);
  }, [running, practice, saved, showMap, showInfo, showRestart]);

  const mark = () => useRumila.getState().completeToolItem(memberId, TOOL_ID, 'angkasa', progress.stage);
  const next = () => {
    const updated = practice ? finishPractice(progress) : completeLesson(progress);
    if (updated.stage !== progress.stage) {
      mark();
      setProgress(updated);
      if (updated.stage === 'selesai') useRumila.getState().completeToolItem(memberId, TOOL_ID, 'angkasa', 'rangkaian-selesai');
    }
  };
  const changeSetup = (route: UmrohRoute, pilgrim: UmrohPilgrim) => setProgress(createProgress(route, pilgrim));
  const reset = () => { const current = saved ?? progress; setRunning(false); setSaved(null); setChecks([false, false, false]); setProgress(createProgress(current.route, current.pilgrim)); setShowRestart(false); };
  const narrate = () => {
    window.speechSynthesis.cancel();
    if (speaking) { setSpeaking(false); return; }
    const speech = new SpeechSynthesisUtterance(lesson.title + '. ' + lesson.instruction + ' ' + lesson.detail);
    speech.lang = 'id-ID'; speech.rate = 0.9;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('id'));
    if (voice) speech.voice = voice;
    speech.onend = speech.onerror = () => setSpeaking(false);
    setSpeaking(true); window.speechSynthesis.speak(speech);
  };

  return (
    <main className="umroh-app">
      <header className="umroh-header">
        <Link href="/beranda/angkasa" className="umroh-icon-btn" aria-label="Kembali ke Petualangan 3D"><Icon name="arrow_back" /></Link>
        <div className="umroh-title"><span>PETUALANGAN 3D</span><h1>Umroh Virtual</h1></div>
        <div className="umroh-header-actions">
          <button className="umroh-outline-btn" aria-label="Lihat rangkaian umroh" onClick={() => { setRunning(false); setShowMap(true); }}><Icon name="route" /><span>Rangkaian</span></button>
          <button className="umroh-icon-btn" aria-label="Tentang panduan" onClick={() => { setRunning(false); setShowInfo(true); }}><Icon name="info" /></button>
        </div>
      </header>

      <div className="umroh-layout">
        <section className="umroh-world" aria-label="Dunia umroh tiga dimensi">
          <div ref={viewport} className="umroh-viewport" />
          <div className="umroh-scene-label"><span className="umroh-live-dot" /><span>{progress.stage === 'persiapan' || progress.stage === 'miqat' ? (progress.route === 'madinah' ? 'MIQAT • BIR ALI' : 'PERJALANAN • PESAWAT') : progress.stage === 'perjalanan' ? 'MENUJU MAKKAH' : progress.stage === 'sai' ? 'SAFA & MARWAH' : progress.stage === 'tahallul' || finished ? 'MENUNTASKAN UMROH' : 'MASJIDIL HARAM'}</span></div>
          {!sceneReady && !sceneError && <div className="umroh-loading" role="status"><Icon name="mosque" size={40} /><span>Menyiapkan perjalanan…</span></div>}
          {sceneError && <div className="umroh-loading"><Icon name="view_in_ar" size={40} /><strong>Tampilan 3D belum bisa dibuka</strong><p>Coba browser yang mendukung WebGL. Panduan langkah tetap bisa dibaca di sini.</p></div>}
          <div className="umroh-camera-tools">
            <span>Geser untuk melihat · Cubit untuk zoom</span>
            <button className="umroh-icon-btn" aria-label="Atur ulang kamera" onClick={() => scene.current?.resetCamera()}><Icon name="center_focus_strong" /></button>
          </div>
          {practice && <div className="umroh-counter" aria-live="polite"><span>{progress.stage === 'tawaf' ? 'PUTARAN TAWAF' : 'PERJALANAN SA’I'}</span><strong>{progress.count}<small> / 7</small></strong><div>{practiceDone ? 'Lengkap, alhamdulillah' : progress.stage === 'sai' ? (progress.count % 2 === 0 ? 'Safa → Marwah' : 'Marwah → Safa') : 'Ka’bah di sebelah kiri'}</div></div>}
          <div className="umroh-scene-footer"><Icon name="auto_stories" size={18} /><span>Belajar bersama, selangkah demi selangkah.</span></div>
        </section>

        <section ref={panel} className="umroh-panel" aria-label="Panduan langkah umroh">
          <div className="umroh-step-heading"><span className="umroh-step-icon"><Icon name={STAGE_ICONS[stageIndex]} size={27} /></span><div><span className="umroh-eyebrow">{finished ? 'RANGKAIAN TUNTAS' : 'LANGKAH ' + (stageIndex + 1) + ' DARI ' + (STAGES.length - 1)}</span><h2 ref={heading} tabIndex={-1}>{lesson.title}</h2></div></div>
          <div className="umroh-progress-track" aria-label="Progres rangkaian" role="progressbar" aria-valuenow={stageIndex} aria-valuemin={0} aria-valuemax={STAGES.length - 1}><span style={{ width: (stageIndex / (STAGES.length - 1)) * 100 + '%' }} /></div>
          <p className="umroh-subtitle">{lesson.subtitle}</p>
          <p className="umroh-instruction">{lesson.instruction}</p>

          {progress.stage === 'persiapan' && <div className="umroh-setup">
            <fieldset><legend>Perjalanan kita</legend><div className="umroh-choice-row">{([{ id: 'madinah', name: 'Dari Madinah', sub: 'Miqat di Bir Ali', icon: 'mosque' }, { id: 'pesawat', name: 'Dengan pesawat', sub: 'Bersiap sebelum miqat', icon: 'flight' }] as const).map((r) => <button key={r.id} className={'umroh-choice ' + (progress.route === r.id ? 'selected' : '')} aria-pressed={progress.route === r.id} onClick={() => changeSetup(r.id, progress.pilgrim)}><Icon name={r.icon} /><strong>{r.name}</strong><span>{r.sub}</span></button>)}</div></fieldset>
            <fieldset><legend>Panduan untuk</legend><div className="umroh-choice-row">{(['putra', 'putri'] as const).map((p) => <button key={p} className={'umroh-choice umroh-choice-small ' + (progress.pilgrim === p ? 'selected' : '')} aria-pressed={progress.pilgrim === p} onClick={() => changeSetup(progress.route, p)}>{p === 'putra' ? 'Laki-laki' : 'Perempuan'}</button>)}</div></fieldset>
            <div className="umroh-checklist">{['Mengenal pakaian ihram', 'Membaca panduan persiapan di bawah', 'Siap belajar dengan tertib'].map((label, i) => <label key={label}><input type="checkbox" checked={checks[i]} onChange={() => setChecks((v) => v.map((checked, n) => n === i ? !checked : checked))} /><span>{label}</span></label>)}</div>
          </div>}

          <div className="umroh-note"><Icon name="lightbulb" size={21} /><p>{lesson.detail}</p></div>
          {lesson.dua && <details className="umroh-dua"><summary><Icon name="menu_book" size={20} />Bacaan & arti<Icon name="expand_more" size={20} /></summary><p lang="ar" dir="rtl" className="umroh-arabic">{lesson.dua.arabic}</p><p className="umroh-latin">{lesson.dua.latin}</p><p>{lesson.dua.meaning}</p></details>}

          {practice && <div className="umroh-practice"><div className="umroh-laps" aria-label={String(progress.count) + ' dari 7 selesai'}>{Array.from({ length: 7 }, (_, i) => <span key={i} className={i < progress.count ? 'done' : i === progress.count ? 'current' : ''}>{i < progress.count ? <Icon name="check" size={16} /> : i + 1}</span>)}</div><p>{progress.stage === 'sai' ? 'Safa → Marwah dihitung satu kali. Pulang ke Safa dihitung satu kali lagi.' : 'Ikuti lintasan berlawanan arah jarum jam, dari garis Hajar Aswad.'}</p><span className="umroh-sim-note">Gerak dipercepat untuk belajar. Durasi ini bukan durasi ibadah sebenarnya.</span></div>}

          {finished && <div className="umroh-complete"><Icon name="check_circle" size={44} /><strong>Perjalanan belajar selesai!</strong><p>Kamu sudah mengenal rangkaian dari miqat sampai tahallul. Ulangi bersama orang tua atau pembimbing agar makin paham.</p></div>}

          <div className="umroh-panel-actions">
            {practice && !practiceDone ? <button className="umroh-primary" disabled={!ready || (!sceneReady && !sceneError)} onClick={() => setRunning(!running)}><Icon name={running ? 'pause' : 'play_arrow'} />{running ? 'Jeda perjalanan' : progress.elapsedSeconds > 0 ? 'Lanjutkan ' + (progress.stage === 'tawaf' ? 'tawaf' : 'sa’i') : 'Mulai ' + (progress.stage === 'tawaf' ? 'tawaf' : 'sa’i')}</button> : finished ? <Link className="umroh-primary" href="/beranda/angkasa"><Icon name="home" />Kembali ke Petualangan 3D</Link> : <button className="umroh-primary" disabled={!ready || (progress.stage === 'persiapan' && !checks.every(Boolean))} onClick={next}>{lesson.action}<Icon name="arrow_forward" /></button>}
            <div className="umroh-secondary-actions">{voiceAvailable && <button onClick={narrate} aria-pressed={speaking}><Icon name={speaking ? 'stop_circle' : 'volume_up'} size={19} />{speaking ? 'Hentikan suara' : 'Bacakan panduan'}</button>}<button onClick={() => { setRunning(false); setShowRestart(true); }}><Icon name="restart_alt" size={19} />Ulangi</button></div>
            <p className="umroh-save-note">{storageWarning ? 'Penyimpanan tidak tersedia; progres hanya tersimpan selama halaman ini terbuka.' : 'Perjalanan tersimpan di perangkat ini untuk profilmu.'}</p>
          </div>
        </section>
      </div>

      <nav className="umroh-journey-strip" aria-label="Urutan rangkaian">{STAGES.map((s, i) => <div key={s.id} className={i < stageIndex ? 'done' : i === stageIndex ? 'active' : ''} aria-current={i === stageIndex ? 'step' : undefined}><span><Icon name={i < stageIndex ? 'check' : STAGE_ICONS[i]} size={19} /></span><small>{s.title}</small></div>)}</nav>

      {saved && <Modal title="Lanjutkan perjalananmu?" onClose={() => { setProgress(saved); setSaved(null); }}><p>Terakhir kamu sampai di <strong>{getStageContent(saved.stage, saved.route, saved.pilgrim).title}</strong>. Perjalanan dilanjutkan dalam keadaan jeda.</p><button className="umroh-primary" onClick={() => { setProgress(saved); setSaved(null); }}>Lanjutkan perjalanan<Icon name="arrow_forward" /></button><button className="umroh-outline-btn umroh-full" onClick={reset}>Mulai dari persiapan</button></Modal>}
      {showRestart && <Modal title="Mulai dari awal?" onClose={() => setShowRestart(false)}><p>Posisi latihan ini akan kembali ke persiapan. Catatan materi yang sudah dipelajari tetap ada.</p><button className="umroh-primary" onClick={reset}>Ya, ulangi rangkaian</button><button className="umroh-outline-btn umroh-full" onClick={() => setShowRestart(false)}>Kembali ke latihan</button></Modal>}
      {showMap && <Modal title="Rangkaian Umroh Virtual" onClose={() => setShowMap(false)}><ol className="umroh-map-list">{STAGES.map((s, i) => <li key={s.id} className={i === stageIndex ? 'active' : ''}><span>{i < stageIndex ? <Icon name="check" size={18} /> : i + 1}</span><div><strong>{s.title}</strong><small>{i < stageIndex ? 'Sudah dipelajari' : i === stageIndex ? 'Kamu di sini' : 'Langkah berikutnya'}</small></div></li>)}</ol></Modal>}
      {showInfo && <Modal title="Tentang perjalanan ini" onClose={() => setShowInfo(false)}><p>Umroh Virtual membantu mengenal urutan, tempat, dan bacaan umroh. Model tempat dan gerakan disederhanakan untuk belajar bersama keluarga.</p><p>Persiapan dan niat ihram mengikuti jalur perjalanan. Salat setelah tawaf, minum Zamzam, dan bacaan anjuran ditampilkan sebagai panduan, bukan semuanya rukun umroh.</p><p>Gunakan bersama arahan pembimbing manasik. Simulasi ini tidak menggantikan ibadah dan tidak menilai sahnya ibadah.</p>{UMROH_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</Modal>}
    </main>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className="umroh-dialog" aria-label={title} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="umroh-dialog-content"><header><h2>{title}</h2><button className="umroh-icon-btn" aria-label="Tutup" onClick={onClose}><Icon name="close" /></button></header>{children}</div></dialog>;
}
