import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../lib/i18n';

const SRC = '/assets/audio/slow-arabic-nights.mp3';
const TARGET_VOLUME = 0.32;
/**
 * Looping ambient soundtrack with a floating toggle.
 * On by default on every visit: playback is attempted at once and, because
 * browsers only allow sound after a user gesture, otherwise starts on the first
 * click, tap, key press or scroll. The toggle only silences the current visit.
 */
export const BackgroundMusic: React.FC = () => {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false);

  const fadeTo = useCallback((target: number, ms: number, done?: () => void) => {
    const a = audioRef.current;
    if (!a) return;
    cancelAnimationFrame(fadeRef.current);
    const from = a.volume;
    const start = performance.now();
    const tick = (now: number) => {
      // rAF timestamps can precede performance.now() captured above, so clamp.
      const p = Math.min(1, Math.max(0, (now - start) / ms));
      const eased = 1 - Math.pow(1 - p, 2);
      a.volume = Math.min(1, Math.max(0, from + (target - from) * eased));
      if (p < 1) fadeRef.current = requestAnimationFrame(tick);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return false;
    try {
      a.volume = 0;
      await a.play();
      fadeTo(TARGET_VOLUME, 2500);
      setPlaying(true);
      setArmed(false);
      return true;
    } catch {
      return false;
    }
  }, [fadeTo]);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    fadeTo(0, 600, () => a.pause());
    setPlaying(false);
  }, [fadeTo]);

  useEffect(() => {
    let disposed = false;
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'];
    const remove = () => events.forEach((e) => window.removeEventListener(e, onGesture));
    const onGesture = () => {
      start().then((ok) => {
        if (ok || disposed) remove();
      });
    };
    const retry = () => {
      if (!document.hidden) onGesture();
    };
    start().then((ok) => {
      if (ok || disposed) return;
      setArmed(true);
      events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
      // Some browsers allow sound once the tab is focused or after a delay; keep trying quietly.
      window.addEventListener('focus', retry);
      document.addEventListener('visibilitychange', retry);
      window.setTimeout(retry, 1500);
      window.setTimeout(retry, 4000);
    });
    return () => {
      disposed = true;
      remove();
      window.removeEventListener('focus', retry);
      document.removeEventListener('visibilitychange', retry);
    };
  }, [start]);

  // Pause when the tab is hidden, resume when it comes back.
  useEffect(() => {
    const onVis = () => {
      const a = audioRef.current;
      if (!a || !playing) return;
      if (document.hidden) a.pause();
      else a.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [playing]);

  const toggle = () => {
    if (playing) stop();
    else start();
  };

  // While the browser is still holding playback back, the player is still "on": it
  // starts the moment the visitor touches the page.
  const label = playing || armed ? t('music.on', 'Music on') : t('music.off', 'Music off');

  return (
    <>
      <audio ref={audioRef} src={SRC} loop autoPlay preload="auto" playsInline />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={label}
        title={playing ? t('music.pause', 'Pause the music') : t('music.play', 'Play the music')}
        className={`fixed bottom-5 start-5 z-40 inline-flex items-center gap-2.5 h-11 ps-3.5 pe-4 rounded-full border bg-white/95 backdrop-blur text-[12px] font-semibold uppercase tracking-[1.5px] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 ${
          playing || armed ? 'border-accent/40 text-accent' : 'border-line text-ink-2'
        }`}
      >
        <span className={`eq ${playing ? 'is-playing' : ''} ${armed && !playing ? 'is-armed' : ''}`} aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="hidden sm:inline">{label}</span>
      </button>
    </>
  );
};
