'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { useMe, useRumila } from '@/lib/store';
import {
  STAGES, UMROH_SOURCES, TAWAF_LAP_SECONDS, SAI_LEG_SECONDS, completeLesson,
  advancePractice, finishPractice, getStageContent,
  JOURNEY_CHAPTERS, createJourneyProgress, advanceJourneyTravel, nextJourneyChapter,
  updateJourneyUmroh, parseJourneyProgress, serializeJourneyProgress, getJourneyChapter,
  type JourneyProgress, type UmrohPilgrim,
} from '@/lib/umroh';
import type { UmrohScene } from './scene';
import { getFlightPov, isFlightChapter, type FlightCameraMode } from './flight-camera';
import { getBoardingStep, getFlightState } from './flight-profile';
import './umroh.css';

const TOOL_ID = 'petualangan-umroh';
const STAGE_ICONS = ['backpack', 'mosque', 'directions_bus', 'door_open', '360', 'self_improvement', 'water_drop', 'route', 'content_cut', 'check_circle'];
type CameraView = 'walk' | 'follow' | 'overview';
const CAMERA_VIEWS = [
  { id: 'walk', label: 'Jalan kaki', icon: 'directions_walk' },
  { id: 'follow', label: 'Ikuti jamaah', icon: 'person_pin_circle' },
  { id: 'overview', label: 'Lihat kawasan', icon: 'map' },
] as const;
const FLIGHT_VIEWS = [
  { id: 'auto', label: 'Otomatis', icon: 'autorenew' },
  { id: 'cabin', label: 'Dalam kabin', icon: 'airline_seat_recline_normal' },
  { id: 'exterior', label: 'Luar pesawat', icon: 'flight' },
] as const;
const HUMAN_MODEL_CREDIT = {
  title: 'Muslim and hajj man',
  creator: 'Mostafa 1001 / Mostafa Ebrahim',
  source: 'https://www.fab.com/listings/90d395a5-a805-4193-855c-61179178b3be',
  license: 'https://creativecommons.org/licenses/by/4.0/',
};
const PREPARATION_STEPS = ['Mengenal pakaian ihram', 'Membaca panduan persiapan di bawah', 'Siap belajar dengan tertib'];
const BOARDING_PASS_CHAPTERS = ['cgk_imigrasi', 'cgk_keamanan', 'cgk_gate', 'cgk_boarding'];
const NABAWI_VISIT = {
  title: 'Mengenal Masjid Nabawi', subtitle: 'Kunjungan pilihan di Madinah',
  instruction: 'Jelajahi halaman, payung peneduh, dan bangunan Masjid Nabawi dari dekat.',
  detail: 'Berkunjung ke Masjid Nabawi bukan rukun umroh dan bukan tempat miqat. Untuk perjalanan dari Madinah, niat ihram dilakukan di Bir Ali sebelum menuju Makkah.',
};

export function UmrohVirtual() {
  const member = useMe();
  return <Journey key={member.id} memberId={member.id} memberName={member.name} />;
}

function Journey({ memberId, memberName }: { memberId: string; memberName: string }) {
  const [journey, setJourney] = useState<JourneyProgress>(() => createJourneyProgress());
  const [saved, setSaved] = useState<JourneyProgress | null>(null);
  const progress = journey.umroh;
  const chapter = getJourneyChapter(journey.chapter);
  const chapterIndex = JOURNEY_CHAPTERS.findIndex((item) => item.id === journey.chapter);
  const inUmroh = journey.chapter === 'umroh';
  const travelling = chapter.kind === 'travel';
  const travelFraction = travelling ? Math.min(1, journey.travelSeconds / (chapter.durationSeconds ?? 1)) : 0;
  const travelDone = travelling && travelFraction >= 1;
  const storyElapsed = Math.round((chapter.storyMinutes ?? 0) * travelFraction);
  const storyClock = `${Math.floor(storyElapsed / 60)}j ${String(storyElapsed % 60).padStart(2, '0')}m`;
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  // Hides every overlay so the scenery can be enjoyed; one button brings it back.
  const [hudHidden, setHudHidden] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);
  const [view, setView] = useState<CameraView>('walk');
  const [flightCamera, setFlightCamera] = useState<FlightCameraMode>('auto');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset'>('day');
  const [practiceSpeed, setPracticeSpeed] = useState<'normal' | 'fast'>('normal');
  const [visit, setVisit] = useState<'nabawi' | null>(null);
  const flying = !visit && isFlightChapter(journey.chapter);
  const flightPov = getFlightPov(travelFraction, flightCamera, reducedMotion);
  const flightState = flying ? getFlightState(travelFraction) : null;
  const boardingStep = journey.chapter === 'cgk_boarding' && !visit ? getBoardingStep(travelFraction) : null;
  const [landmarks, setLandmarks] = useState<{ id: string; label: string }[]>([]);
  const [sceneError, setSceneError] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(journey.chapter + progress.stage);
  const scene = useRef<UmrohScene | null>(null);
  const latest = useRef(journey);
  const pendingLandmark = useRef<string | null>(null);
  const movementPointers = useRef(new Map<number, { forward: number; right: number }>());
  const saveKey = 'rumila-umroh:' + memberId;
  const stageIndex = STAGES.findIndex((s) => s.id === progress.stage);
  const lesson = getStageContent(progress.stage, progress.route, progress.pilgrim);
  const displayedLesson = visit ? NABAWI_VISIT : inUmroh ? progress.stage === 'selesai' ? { ...lesson, title: 'Rangkaian umroh selesai', instruction: 'Kamu sudah mempelajari rangkaian dari miqat sampai tahallul. Kini bersiap untuk perjalanan pulang melalui Jeddah.', detail: 'Periksa barang bawaan bersama rombongan, lalu lanjutkan perjalanan darat menuju bandara.' } : lesson : chapter;
  const dialogOpen = Boolean(saved || showMap || showInfo || showRestart);
  const practice = inUmroh && (progress.stage === 'tawaf' || progress.stage === 'sai');
  const practiceDone = practice && progress.count >= 7;
  const tawaf = inUmroh && progress.stage === 'tawaf' && !visit;
  const cameraView = tawaf && reducedMotion ? 'overview' : view;
  const guidedTawaf = tawaf && running && !practiceDone && cameraView !== 'overview';
  const tawafHint = tawaf && reducedMotion ? 'Kamera tetap · Gerak dikurangi mengikuti pengaturan perangkat'
    : guidedTawaf ? cameraView === 'follow' ? 'Kamera mengikuti jamaah · Jeda untuk mengubah sudut pandang'
      : 'POV mengikuti putaran · Geser untuk melihat sekeliling' : null;
  const finished = journey.chapter === 'rumah_selesai';
  const duration = progress.stage === 'tawaf' ? TAWAF_LAP_SECONDS : SAI_LEG_SECONDS;
  const practiceRate = progress.stage === 'tawaf' ? (practiceSpeed === 'normal' ? 0.12 : 0.6) : (practiceSpeed === 'normal' ? 0.075 : 0.3);
  const stepLabels = visit ? [] : inUmroh ? (progress.stage === 'persiapan' ? PREPARATION_STEPS : []) : chapter.steps ?? [];
  const needsChecklist = stepLabels.length > 0;
  const choosePilgrim = !visit && (journey.chapter === 'rumah' || (inUmroh && progress.stage === 'persiapan'));
  // Steps are ticked in order; the 3D scene acts out each one as it is reached.
  const doneSteps = stepLabels.findIndex((_, i) => !checks[i]) === -1 ? stepLabels.length : stepLabels.findIndex((_, i) => !checks[i]);
  const showBoardingPass = !visit && (BOARDING_PASS_CHAPTERS.includes(journey.chapter) || (journey.chapter === 'cgk' && doneSteps >= 4));
  latest.current = journey;
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
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    try {
      const restored = parseJourneyProgress(localStorage.getItem(saveKey));
      if (restored && restored.chapter !== 'rumah') setSaved(restored);
      else if (restored) setJourney(restored);
    } catch { setStorageWarning(true); }
    setReady(true);
    setVoiceAvailable('speechSynthesis' in window);
  }, [saveKey]);

  useEffect(() => {
    if (!ready || saved) return;
    const timer = window.setTimeout(() => {
      try { localStorage.setItem(saveKey, serializeJourneyProgress(journey)); }
      catch { setStorageWarning(true); }
    }, 250);
    return () => clearTimeout(timer);
  }, [journey, ready, saved, saveKey]);

  useEffect(() => {
    if (!ready || saved) return;
    const save = () => {
      try { localStorage.setItem(saveKey, serializeJourneyProgress(latest.current)); } catch { /* Memory-only when storage is unavailable. */ }
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
        scene.current.update({ ...current.umroh, chapter: current.chapter, travelProgress: 0, progress: current.umroh.elapsedSeconds / (current.umroh.stage === 'tawaf' ? TAWAF_LAP_SECONDS : SAI_LEG_SECONDS), running: false, view: 'walk', timeOfDay: 'day', visit: null });
        setLandmarks(scene.current.getLandmarks());
        setSceneReady(true);
      } catch { setSceneError(true); }
    }).catch(() => { if (!cancelled) setSceneError(true); });
    return () => { cancelled = true; scene.current?.dispose(); scene.current = null; };
  }, []);

  useEffect(() => {
    const currentScene = scene.current;
    if (!currentScene) return;
    currentScene.update({ ...progress, chapter: journey.chapter, travelProgress: travelFraction, progress: practice ? Math.min(7, progress.elapsedSeconds / duration) : 0, running: running && !visit, view, flightCamera, reducedMotion, guideOpen, timeOfDay, visit, paused: dialogOpen, step: doneSteps });
    if (pendingLandmark.current && !dialogOpen) {
      currentScene.jumpToLandmark(pendingLandmark.current);
      pendingLandmark.current = null;
    }
  }, [progress, journey.chapter, travelFraction, practice, duration, running, sceneReady, view, flightCamera, reducedMotion, guideOpen, timeOfDay, visit, dialogOpen, doneSteps]);

  useEffect(() => { scene.current?.setSound(soundOn); }, [soundOn, sceneReady]);

  useEffect(() => {
    stopMovement();
  }, [dialogOpen, view, flightCamera, visit, progress.stage, journey.chapter, stopMovement]);

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
    if (previousStage.current !== journey.chapter + progress.stage) {
      if (panel.current) panel.current.scrollTop = 0;
      heading.current?.focus({ preventScroll: true });
      previousStage.current = journey.chapter + progress.stage;
    }
  }, [progress.stage, journey.chapter, visit]);

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
    if (!running || (!practice && !travelling) || visit || saved || showMap || showInfo || showRestart) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min((now - previous) / 1000, 0.25);
      previous = now;
      if (document.visibilityState !== 'visible') return;
      const current = latest.current;
      const next = travelling ? advanceJourneyTravel(current, delta) : updateJourneyUmroh(current, advancePractice(current.umroh, delta * practiceRate));
      latest.current = next;
      setJourney(next);
      if (travelling ? next.travelSeconds >= (chapter.durationSeconds ?? 0) : next.umroh.count >= 7) setRunning(false);
    }, 40);
    return () => clearInterval(timer);
  }, [running, practice, travelling, chapter.durationSeconds, practiceRate, visit, saved, showMap, showInfo, showRestart]);

  const next = () => {
    let updated = journey;
    if (inUmroh && progress.stage !== 'selesai') {
      const ritual = practice ? finishPractice(progress) : completeLesson(progress);
      if (ritual.stage === progress.stage) return;
      useRumila.getState().completeToolItem(memberId, TOOL_ID, 'angkasa', progress.stage);
      updated = updateJourneyUmroh(journey, ritual);
      if (ritual.stage === 'selesai') useRumila.getState().completeToolItem(memberId, TOOL_ID, 'angkasa', 'rangkaian-selesai');
    } else {
      updated = nextJourneyChapter(journey);
      if (updated.chapter === journey.chapter) return;
      useRumila.getState().completeToolItem(memberId, TOOL_ID, 'angkasa', 'perjalanan-' + journey.chapter);
    }
    stopMovement(); setRunning(false); setJourney(updated); setGuideOpen(true); setChecks([]);
    if (updated.chapter !== journey.chapter) { setView('walk'); setFlightCamera('auto'); }
  };
  const changePilgrim = (pilgrim: UmrohPilgrim) => setJourney((current) => ({ ...current, umroh: { ...current.umroh, pilgrim } }));
  const reset = () => { const current = saved ?? journey; stopMovement(); setVisit(null); setRunning(false); setSaved(null); setChecks([]); setJourney(createJourneyProgress(current.umroh.pilgrim)); setShowRestart(false); setGuideOpen(true); setView('walk'); setFlightCamera('auto'); };
  const finishTravel = () => { setRunning(false); setJourney((current) => advanceJourneyTravel(current, chapter.durationSeconds ?? 0)); };
  const openNabawi = () => { setRunning(false); stopMovement(); setVisit('nabawi'); setShowMap(false); setGuideOpen(true); };
  const returnToLesson = () => { stopMovement(); setVisit(null); setRunning(false); setGuideOpen(true); };
  const jumpTo = (id: string) => {
    pendingLandmark.current = id;
    if (flying) setFlightCamera(flightPov);
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
  const caption = visit ? 'KUNJUNGAN PILIHAN' : finished ? 'SUDAH KEMBALI DI RUMAH' : `PERJALANAN ${chapterIndex + 1} / ${JOURNEY_CHAPTERS.length}`;
  const primaryAction = visit
    ? <button className="umroh-primary" onClick={returnToLesson}><Icon name="arrow_back" />Kembali ke perjalanan</button>
    : (practice && !practiceDone) || (travelling && !travelDone)
      ? <button className="umroh-primary" disabled={!ready || (!sceneReady && !sceneError)} onClick={() => {
        if (!running) {
          scene.current?.unlockAudio();
          // Give the moving scenery the whole screen on wide layouts; the guide reopens from its button.
          if (travelling && window.matchMedia('(min-width: 761px)').matches) setGuideOpen(false);
        }
        setRunning(!running);
      }}><Icon name={running ? 'pause' : 'play_arrow'} />{running ? 'Jeda perjalanan' : travelling ? journey.travelSeconds > 0 ? 'Lanjutkan perjalanan' : 'Mulai perjalanan' : progress.elapsedSeconds > 0 ? 'Lanjutkan ' + (progress.stage === 'tawaf' ? 'tawaf' : 'sa’i') : 'Mulai ' + (progress.stage === 'tawaf' ? 'tawaf' : 'sa’i')}</button>
      : finished
        ? <Link className="umroh-primary" href="/beranda/angkasa"><Icon name="home" />Kembali ke Petualangan 3D</Link>
        : <button className="umroh-primary" disabled={!ready || (needsChecklist && doneSteps < stepLabels.length)} onClick={next}>{inUmroh ? progress.stage === 'selesai' ? 'Mulai perjalanan pulang' : lesson.action : chapter.action}<Icon name="arrow_forward" /></button>;

  return (
    <main className={'umroh-app ' + (guideOpen ? 'guide-open' : 'guide-closed') + (hudHidden ? ' hud-hidden' : '') + (running ? ' is-running' : '')}>
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
          <div className="umroh-scene-label"><span className="umroh-live-dot" /><div><span>{visit ? 'MASJID NABAWI · MADINAH' : !inUmroh ? chapter.location : progress.stage === 'persiapan' || progress.stage === 'miqat' ? (progress.route === 'madinah' ? 'BIR ALI · MADINAH' : 'PERJALANAN · PESAWAT') : progress.stage === 'perjalanan' ? 'MENUJU MAKKAH' : progress.stage === 'sai' ? 'SAFA & MARWAH' : progress.stage === 'tahallul' || finished ? 'MENUNTASKAN UMROH' : 'MASJIDIL HARAM'}</span>{!travelling && <small>{visit ? 'Kunjungan pilihan · di luar rangkaian umroh' : 'Visualisasi tempat untuk pembelajaran'}</small>}</div></div>
          <button className="umroh-icon-btn umroh-hud-toggle" aria-pressed={hudHidden} aria-label={hudHidden ? 'Tampilkan teks dan tombol' : 'Sembunyikan teks agar pemandangan terlihat penuh'} title={hudHidden ? 'Tampilkan teks' : 'Sembunyikan teks'} onClick={() => { const hide = !hudHidden; setHudHidden(hide); if (hide) setGuideOpen(false); }}><Icon name={hudHidden ? 'visibility' : 'visibility_off'} /></button>
          {!sceneReady && !sceneError && <div className="umroh-loading" role="status"><Icon name="mosque" size={40} /><span>Menyiapkan perjalanan…</span></div>}
          {sceneError && <div className="umroh-loading"><Icon name="view_in_ar" size={40} /><strong>Tampilan 3D belum bisa dibuka</strong><p>Coba browser yang mendukung WebGL. Panduan langkah tetap bisa dibaca di sini.</p></div>}
          <div className="umroh-camera-toolbar">
            {flying ? <><div className="umroh-segmented" role="group" aria-label="Sudut pandang penerbangan">{FLIGHT_VIEWS.map((mode) => <button key={mode.id} aria-pressed={flightCamera === mode.id} onClick={() => { stopMovement(); setFlightCamera(mode.id); }}><Icon name={mode.icon} size={18} /><span>{mode.label}</span></button>)}</div>
              <div className="umroh-segmented umroh-time" role="group" aria-label="Suara pesawat"><button aria-pressed={soundOn} aria-label={soundOn ? 'Matikan suara pesawat' : 'Nyalakan suara pesawat'} onClick={() => { const on = !soundOn; setSoundOn(on); if (on) scene.current?.unlockAudio(); }}><Icon name={soundOn ? 'volume_up' : 'volume_off'} size={17} /><span className="umroh-sr-label">Suara</span></button></div></> : <div className="umroh-segmented" role="group" aria-label="Cara menjelajah">{CAMERA_VIEWS.map((mode) => <button key={mode.id} aria-pressed={cameraView === mode.id} disabled={tawaf && reducedMotion && mode.id !== 'overview'} onClick={() => { stopMovement(); setView(mode.id); }}><Icon name={mode.icon} size={18} /><span>{travelling && mode.id === 'follow' ? 'Dalam kendaraan' : tawaf && mode.id === 'walk' ? 'POV tawaf' : mode.label}</span></button>)}</div>}
            <div className="umroh-segmented umroh-time" role="group" aria-label="Suasana cahaya"><button aria-label="Siang" aria-pressed={timeOfDay === 'day'} onClick={() => setTimeOfDay('day')}><Icon name="light_mode" size={17} /><span>Siang</span></button><button aria-label="Senja" aria-pressed={timeOfDay === 'sunset'} onClick={() => setTimeOfDay('sunset')}><Icon name="wb_twilight" size={17} /><span>Senja</span></button></div>
          </div>
          {practice && !visit && <div className="umroh-counter" aria-live="polite"><span>{progress.stage === 'tawaf' ? 'PUTARAN TAWAF' : 'PERJALANAN SA’I'}</span><strong>{progress.count}<small> / 7</small></strong><div>{practiceDone ? (progress.stage === 'tawaf' ? 'Tujuh putaran lengkap' : 'Tujuh perjalanan lengkap') : progress.stage === 'sai' ? (progress.count % 2 === 0 ? 'Safa → Marwah' : 'Marwah → Safa') : 'Ka’bah di sebelah kiri'}</div></div>}
          {travelling && !visit && <div className="umroh-counter umroh-transport-counter"><span>{travelDone ? 'SUDAH TIBA' : running ? 'DALAM PERJALANAN' : journey.travelSeconds > 0 ? 'DIJEDA' : 'SIAP BERANGKAT'} · {Math.round(travelFraction * 100)}%{chapter.storyMinutes ? ' · ' + storyClock : ''}</span>
            <progress aria-label="Progres perjalanan" value={travelFraction} max={1} />
            {flightState && <div className="umroh-flight-phase"><strong>{flightState.phase.label}</strong><span>{flightState.onGround ? `${Math.round(Math.abs(flightState.speed) * 3.6)} km/jam di darat` : `${(Math.round(flightState.altitude / 100) * 100).toLocaleString('id-ID')} m · ${Math.round(flightState.speed * 3.6)} km/jam`}{flightState.seatbelt ? ' · ' : ''}{flightState.seatbelt && <Icon name="airline_seat_recline_extra" size={13} />}</span></div>}
            {boardingStep && <div className="umroh-flight-phase"><strong>{boardingStep.label}</strong><span>Langkah {boardingStep.index + 1} dari 5 · kursi 32A</span></div>}
            {!flightState && !boardingStep && <div>{chapter.subtitle}</div>}</div>}
          <button className="umroh-icon-btn umroh-reset-camera" aria-label="Atur ulang kamera" onClick={() => { stopMovement(); scene.current?.resetCamera(); }}><Icon name="center_focus_strong" /></button>
          {!flying && journey.chapter !== 'cgk_boarding' && cameraView === 'walk' && !guidedTawaf && !dialogOpen && <div className="umroh-dpad" role="group" aria-label="Navigasi jalan kaki">{[
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
          {!running && <div className="umroh-scene-footer"><Icon name={guidedTawaf ? '360' : !flying && cameraView === 'walk' ? 'directions_walk' : 'pan_tool_alt'} size={16} /><span className="umroh-desktop-hint">{tawafHint ?? (flying ? flightCamera === 'auto' && !reducedMotion ? 'POV berganti otomatis · Pilih POV untuk menjelajah' : flightPov === 'cabin' ? 'Geser untuk melihat kabin dan penumpang' : 'Geser untuk mengitari pesawat · Gulir untuk mendekat' : travelling && view === 'follow' ? 'Geser untuk melihat dari dalam kendaraan' : view === 'walk' ? 'WASD / tombol arah · Geser untuk melihat' : 'Geser untuk melihat · Gulir untuk mendekat')}</span><span className="umroh-touch-hint">{tawafHint ?? (flying ? flightCamera === 'auto' && !reducedMotion ? 'POV berganti otomatis · Pilih POV untuk menjelajah' : flightPov === 'cabin' ? 'Geser untuk melihat kabin dan penumpang' : 'Geser untuk mengitari pesawat · Cubit untuk mendekat' : travelling && view === 'follow' ? 'Geser untuk melihat dari dalam kendaraan' : view === 'walk' ? 'Tombol arah untuk berjalan · Geser untuk melihat' : 'Geser untuk melihat · Cubit untuk mendekat')}</span></div>}
          <div className="umroh-action-dock"><div className="umroh-dock-caption"><span>{caption}</span><strong>{displayedLesson.title}</strong></div>{primaryAction}</div>
        </section>

        <section id="umroh-guide" ref={panel} className="umroh-panel" hidden={!guideOpen} aria-label="Panduan langkah umroh">
          <div className="umroh-panel-top"><span>PANDUAN PERJALANAN</span><button className="umroh-icon-btn" aria-label="Tutup panduan untuk menjelajah" onClick={() => setGuideOpen(false)}><Icon name="close" size={18} /></button></div>
          <div className="umroh-step-heading"><span className="umroh-step-icon"><Icon name={visit ? 'mosque' : inUmroh ? STAGE_ICONS[stageIndex] : chapter.icon} size={23} /></span><div><span className="umroh-eyebrow">{visit ? 'KUNJUNGAN PILIHAN' : inUmroh ? 'MANASIK · LANGKAH ' + (stageIndex + 1) + ' / ' + STAGES.length : caption}</span><h2 ref={heading} tabIndex={-1}>{displayedLesson.title}</h2></div></div>
          {!visit && <div className="umroh-progress-track" aria-label="Progres rangkaian" role="progressbar" aria-valuenow={chapterIndex} aria-valuemin={0} aria-valuemax={JOURNEY_CHAPTERS.length - 1}><span style={{ width: (chapterIndex / (JOURNEY_CHAPTERS.length - 1)) * 100 + '%' }} /></div>}
          <p className="umroh-subtitle">{displayedLesson.subtitle}</p>
          <p className="umroh-instruction">{displayedLesson.instruction}</p>

          {needsChecklist && <div className="umroh-setup">
            {choosePilgrim && <fieldset><legend>Panduan untuk</legend><div className="umroh-choice-row">{(['putra', 'putri'] as const).map((p) => <button key={p} className={'umroh-choice umroh-choice-small ' + (progress.pilgrim === p ? 'selected' : '')} aria-pressed={progress.pilgrim === p} onClick={() => changePilgrim(p)}>{p === 'putra' ? 'Laki-laki' : 'Perempuan'}</button>)}</div></fieldset>}
            {!choosePilgrim && <p className="umroh-step-hint">Centang langkah satu per satu. Lihat apa yang terjadi di layar 3D setiap kali satu langkah selesai.</p>}
            <div className="umroh-checklist">{stepLabels.map((label, i) => <label key={label} className={i === doneSteps ? 'current' : ''}><input type="checkbox" checked={Boolean(checks[i])} disabled={choosePilgrim ? false : i > doneSteps || (i < doneSteps - 1)} onChange={() => setChecks((v) => { const next = stepLabels.map((_, n) => Boolean(v[n])); next[i] = !next[i]; return next; })} /><span>{!choosePilgrim && <b>{i + 1}</b>}{label}</span></label>)}</div>
          </div>}
          {showBoardingPass && <BoardingPass name={memberName} boarding={journey.chapter === 'cgk_boarding' || (journey.chapter === 'cgk_gate' && doneSteps >= 3)} />}

          {!visit && travelling && <div className="umroh-travel-card">
            <div><Icon name={chapter.icon} size={26} /><strong>{travelDone ? 'Sudah tiba' : running ? 'Dalam perjalanan' : 'Siap melanjutkan'}</strong><span>{Math.round(travelFraction * 100)}%</span></div>
            <progress aria-label="Progres perjalanan kendaraan" value={travelFraction} max={1} />
            <p>{chapter.storyMinutes === 540 ? (journey.chapter === 'garuda_cgk' ? 'Jeddah → Jakarta · sekitar 9 jam dalam cerita' : 'Jakarta → Jeddah · sekitar 9 jam dalam cerita') : chapter.storyMinutes ? `Sekitar ${chapter.storyMinutes >= 60 ? Math.floor(chapter.storyMinutes / 60) + ' jam' + (chapter.storyMinutes % 60 ? ' ' + chapter.storyMinutes % 60 + ' menit' : '') : chapter.storyMinutes + ' menit'} dalam cerita` : 'Nikmati pemandangan perjalanan'}</p>
            <small>Waktu dipercepat untuk simulasi. Durasi nyata mengikuti kondisi dan jadwal perjalanan.</small>
            {!travelDone && <button className="umroh-outline-btn umroh-full" onClick={finishTravel}><Icon name="fast_forward" size={18} />Singkatkan perjalanan</button>}
          </div>}

          <div className="umroh-note"><Icon name="lightbulb" size={19} /><p>{displayedLesson.detail}</p></div>
          {!visit && inUmroh && lesson.dua && <details className="umroh-dua"><summary><Icon name="menu_book" size={18} />Bacaan & arti<Icon name="expand_more" size={18} /></summary><p lang="ar" dir="rtl" className="umroh-arabic">{lesson.dua.arabic}</p><p className="umroh-latin">{lesson.dua.latin}</p><p>{lesson.dua.meaning}</p></details>}

          {!visit && practice && <div className="umroh-practice"><div className="umroh-laps" aria-label={String(progress.count) + ' dari 7 selesai'}>{Array.from({ length: 7 }, (_, i) => <span key={i} className={i < progress.count ? 'done' : i === progress.count ? 'current' : ''}>{i < progress.count ? <Icon name="check" size={16} /> : i + 1}</span>)}</div><p>{progress.stage === 'sai' ? 'Safa → Marwah dihitung satu kali. Pulang ke Safa dihitung satu kali lagi.' : 'POV tawaf dan Ikuti jamaah bergerak mengitari Ka’bah saat latihan berjalan. Mulai dan akhiri sejajar Hajar Aswad.'}</p><div className="umroh-speed-control"><span>Kecepatan latihan</span><div className="umroh-segmented" role="group" aria-label="Kecepatan latihan"><button aria-pressed={practiceSpeed === 'normal'} onClick={() => setPracticeSpeed('normal')}>Normal</button><button aria-pressed={practiceSpeed === 'fast'} onClick={() => setPracticeSpeed('fast')}>Dipercepat</button></div></div><span className="umroh-sim-note">{practiceSpeed === 'fast' ? 'Gerak dipercepat untuk belajar. Durasi ini bukan durasi ibadah sebenarnya.' : 'Gerak berjalan biasa. Pilih Dipercepat untuk mempersingkat latihan.'}</span></div>}

          {!visit && finished && <div className="umroh-complete"><Icon name="check_circle" size={32} /><strong>Perjalanan belajar selesai</strong><p>Kamu sudah kembali ke rumah setelah perjalanan Indonesia–Madinah–Makkah. Ceritakan kembali pengalamanmu bersama pendamping.</p></div>}

          <div className="umroh-panel-actions">
            <div className="umroh-secondary-actions">{voiceAvailable && <button onClick={narrate} aria-pressed={speaking}><Icon name={speaking ? 'stop_circle' : 'volume_up'} size={19} />{speaking ? 'Hentikan suara' : 'Bacakan panduan'}</button>}<button onClick={() => { setRunning(false); setShowRestart(true); }}><Icon name="restart_alt" size={19} />Ulangi</button></div>
            <p className="umroh-save-note">{storageWarning ? 'Penyimpanan tidak tersedia; progres hanya tersimpan selama halaman ini terbuka.' : 'Perjalanan tersimpan di perangkat ini untuk profilmu.'}</p>
          </div>
        </section>
      </div>

      {saved && <Modal title="Lanjutkan perjalananmu?" onClose={() => { setJourney(saved); setSaved(null); }}><p>Terakhir kamu sampai di <strong>{saved.chapter === 'umroh' ? getStageContent(saved.umroh.stage, saved.umroh.route, saved.umroh.pilgrim).title : getJourneyChapter(saved.chapter).title}</strong>. Perjalanan dilanjutkan dalam keadaan jeda.</p><button className="umroh-primary" onClick={() => { setJourney(saved); setSaved(null); }}>Lanjutkan perjalanan<Icon name="arrow_forward" /></button><button className="umroh-outline-btn umroh-full" onClick={reset}>Mulai dari rumah</button></Modal>}
      {showRestart && <Modal title="Mulai dari awal?" onClose={() => setShowRestart(false)}><p>Posisi perjalanan ini akan kembali ke rumah di Indonesia. Catatan materi yang sudah dipelajari tetap ada.</p><button className="umroh-primary" onClick={reset}>Ya, ulangi rangkaian</button><button className="umroh-outline-btn umroh-full" onClick={() => setShowRestart(false)}>Kembali ke latihan</button></Modal>}
      {showMap && <Modal title="Peta & rangkaian" onClose={() => setShowMap(false)}>
        {landmarks.length > 0 && <><h3 className="umroh-dialog-label">Jelajahi lokasi ini</h3><div className="umroh-landmark-list">{landmarks.map((landmark) => <button key={landmark.id} onClick={() => jumpTo(landmark.id)}><Icon name="location_on" size={18} /><span>{landmark.label}</span><Icon name="arrow_forward" size={17} /></button>)}</div></>}
        {(inUmroh || visit) && <div className="umroh-map-visit">{visit ? <button className="umroh-outline-btn umroh-full" onClick={() => { returnToLesson(); setShowMap(false); }}><Icon name="arrow_back" size={18} />Kembali ke perjalanan</button> : <button className="umroh-visit-button" onClick={openNabawi}><Icon name="mosque" /><span><strong>Kunjungi kembali Masjid Nabawi</strong><small>Tur tambahan tanpa mengubah progres</small></span><Icon name="arrow_outward" size={18} /></button>}</div>}
        <h3 className="umroh-dialog-label">Dari rumah sampai kembali ke rumah</h3>
        <ol className="umroh-map-list">{JOURNEY_CHAPTERS.map((item, i) => <li key={item.id} className={i === chapterIndex ? 'active' : ''} aria-current={i === chapterIndex ? 'step' : undefined}><span>{i < chapterIndex ? <Icon name="check" size={17} /> : i + 1}</span><div><strong>{item.title}</strong><small>{i < chapterIndex ? 'Sudah dilalui' : i === chapterIndex ? 'Lokasimu saat ini' : 'Perjalanan berikutnya'}</small></div></li>)}</ol>
        {inUmroh && <><h3 className="umroh-dialog-label">Rangkaian manasik</h3><ol className="umroh-map-list">{STAGES.map((s, i) => <li key={s.id} className={i === stageIndex ? 'active' : ''} aria-current={i === stageIndex ? 'step' : undefined}><span>{i < stageIndex ? <Icon name="check" size={17} /> : i + 1}</span><div><strong>{s.title}</strong><small>{i < stageIndex ? 'Sudah dipelajari' : i === stageIndex ? 'Pelajaranmu saat ini' : 'Langkah berikutnya'}</small></div></li>)}</ol></>}
      </Modal>}

      {showInfo && <Modal title="Tentang perjalanan ini" onClose={() => setShowInfo(false)}>
        <p>Jelajahi tempat-tempat dalam rangkaian umroh, lalu ikuti panduan langkah demi langkah. Bangunan dan lingkungan dibuat sebagai visualisasi untuk belajar, bukan denah terukur atau petunjuk navigasi di lokasi sebenarnya.</p>
        <p>Rute cerita: rumah di Indonesia, taksi, Soekarno–Hatta, Garuda ke Jeddah, kereta Haramain ke Madinah, Uber ke Masjid Nabawi, lalu Bir Ali dan rangkaian umroh. Kepulangan melalui Jeddah dan Soekarno–Hatta sampai rumah.</p>
        <p>Tur Nabawi, Raudhah, dan ziarah salam bukan rukun umroh. Raudhah berbeda dari area makam; kunjungan nyata mengikuti ketentuan Nusuk dan petugas. Visualisasi salam berada di luar pembatas ruang makam.</p>
        <p>Nama layanan transportasi dipakai sebagai bagian cerita. Modul tidak melakukan pemesanan, menerbitkan tiket/izin, atau mewakili operator. Durasi penerbangan sekitar 9 jam adalah ilustrasi cerita yang dipercepat.</p>
        <a href="https://www.nusuk.sa/rawdah/" target="_blank" rel="noreferrer">Panduan resmi kunjungan Raudhah · Nusuk ↗</a>
        <p>Salat setelah tawaf, minum Zamzam, dan bacaan anjuran ditampilkan sebagai panduan, bukan semuanya rukun umroh. Gunakan bersama arahan pembimbing manasik; simulasi tidak menggantikan ibadah dan tidak menilai sahnya ibadah.</p>
        {UMROH_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}
        <h3 className="umroh-dialog-label">Kredit aset</h3>
        <p className="umroh-asset-note">
          Model pria: <strong>{HUMAN_MODEL_CREDIT.title}</strong> oleh {HUMAN_MODEL_CREDIT.creator}.
          {' '}Diadaptasi untuk web: geometri dan tekstur dioptimalkan, pakaian dipisah, serta kopiah dihapus pada versi ihram.
          <a href={HUMAN_MODEL_CREDIT.source} target="_blank" rel="noreferrer">Model asli di Fab ↗</a>
          <a href={HUMAN_MODEL_CREDIT.license} target="_blank" rel="noreferrer">Lisensi Creative Commons Attribution 4.0 (CC BY 4.0) ↗</a>
        </p>
        <p className="umroh-asset-note">Tekstur marmer: Rob Tuytel / Poly Haven, CC0. <a href="https://polyhaven.com/a/marble_01" target="_blank" rel="noreferrer">Lihat sumber tekstur ↗</a></p>
      </Modal>}
    </main>
  );
}

/** Illustrative boarding pass; fields are examples for learning, not a ticket. */
function BoardingPass({ name, boarding }: { name: string; boarding: boolean }) {
  return <div className="umroh-boarding-pass" aria-label="Contoh boarding pass">
    <div className="umroh-bp-head"><span>Garuda Indonesia</span><small>BOARDING PASS · CONTOH</small></div>
    <div className="umroh-bp-route"><div><strong>CGK</strong><small>Jakarta</small></div><Icon name="flight" size={22} /><div><strong>JED</strong><small>Jeddah</small></div></div>
    <dl><div><dt>Nama</dt><dd>{name}</dd></div><div><dt>Kursi</dt><dd>32A · jendela</dd></div><div><dt>Gerbang</dt><dd>7</dd></div><div><dt>Kelompok</dt><dd>3</dd></div></dl>
    <div className="umroh-bp-foot"><span className="umroh-bp-code" aria-hidden="true" /><em className={boarding ? 'boarding' : ''}>{boarding ? 'Boarding dibuka' : 'Simpan bersama paspor'}</em></div>
  </div>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className="umroh-dialog" aria-label={title} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="umroh-dialog-content"><header><h2>{title}</h2><button className="umroh-icon-btn" aria-label="Tutup" onClick={onClose}><Icon name="close" /></button></header>{children}</div></dialog>;
}
