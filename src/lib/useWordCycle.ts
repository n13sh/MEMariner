import { useEffect, useRef, useState } from 'react';

export type WordPhase = 'in' | 'hold' | 'out' | 'gap';

interface Options {
  inMs?: number;
  holdMs?: number;
  outMs?: number;
  gapMs?: number;
}

/**
 * Cycles through `words` the way the reference clip does: each word fades in,
 * holds, shrinks and fades out, then the next one appears after a short gap.
 * With prefers-reduced-motion the first word is shown statically.
 */
export function useWordCycle(words: string[], opts: Options = {}) {
  const { inMs = 240, holdMs = 1700, outMs = 540, gapMs = 120 } = opts;
  const key = words.join('|');
  const wordsRef = useRef(words);
  wordsRef.current = words;

  const [reduced, setReduced] = useState(false);
  const [state, setState] = useState<{ index: number; phase: WordPhase }>({ index: 0, phase: 'in' });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (reduced) {
      setState({ index: 0, phase: 'hold' });
      return;
    }
    let index = 0;
    let timer = 0;
    const go = (phase: WordPhase, after: number, next: () => void) => {
      setState({ index, phase });
      timer = window.setTimeout(next, after);
    };
    const cycle = () => {
      go('in', inMs, () =>
        go('hold', holdMs, () =>
          go('out', outMs, () =>
            go('gap', gapMs, () => {
              index = (index + 1) % wordsRef.current.length;
              cycle();
            })
          )
        )
      );
    };
    cycle();
    return () => window.clearTimeout(timer);
  }, [key, reduced, inMs, holdMs, outMs, gapMs]);

  return { word: words[state.index] ?? '', phase: state.phase, reduced };
}
