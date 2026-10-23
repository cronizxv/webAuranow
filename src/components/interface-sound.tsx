import { useEffect, useRef, useState } from 'react';

export function InterfaceSound() {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(false);
  const lastPlayed = useRef(0);
  function tone(frequency: number, click = false) {
    const context = contextRef.current;
    if (!enabledRef.current || !context || context.state !== 'running') return;
    const now = context.currentTime;
    if (!click && now - lastPlayed.current < .075) return;
    lastPlayed.current = now;
    const oscillator = context.createOscillator();
    const harmonic = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine'; harmonic.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * .62, now + .09);
    harmonic.frequency.setValueAtTime(frequency * 2.01, now);
    harmonic.frequency.exponentialRampToValueAtTime(frequency * 1.2, now + .1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(click ? .025 : .014, now + .006);
    gain.gain.exponentialRampToValueAtTime(.0001, now + (click ? .18 : .105));
    oscillator.connect(gain); harmonic.connect(gain); gain.connect(context.destination);
    oscillator.start(now); harmonic.start(now);
    oscillator.stop(now + .2); harmonic.stop(now + .2);
    oscillator.onended = () => {oscillator.disconnect(); harmonic.disconnect(); gain.disconnect();};
  }
  useEffect(() => {
    function identify(target: EventTarget | null) {return target instanceof Element ? target.closest<HTMLAnchorElement>('.social-surface') : null;}
    function hover(event: PointerEvent) {
      const surface = identify(event.target);
      if (!surface || (event.relatedTarget instanceof Node && surface.contains(event.relatedTarget))) return;
      const pitch = surface.classList.contains('x-surface') ? 680 : surface.classList.contains('telegram-surface') ? 820 : surface.classList.contains('pump-surface') ? 580 : 740;
      tone(pitch);
    }
    function focus(event: FocusEvent) {if (identify(event.target)) tone(680);}
    function click(event: MouseEvent) {if (identify(event.target)) tone(420, true);}
    document.addEventListener('pointerover', hover);
    document.addEventListener('focusin', focus);
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('pointerover', hover);
      document.removeEventListener('focusin', focus);
      document.removeEventListener('click', click);
      void contextRef.current?.close(); contextRef.current = null;
    };
  }, []);
  async function toggle() {
    if (enabledRef.current) {enabledRef.current = false; setEnabled(false); return;}
    try {
      const context = contextRef.current ?? new AudioContext(); contextRef.current = context;
      await context.resume();
      enabledRef.current = true; setEnabled(true); tone(720);
    } catch {enabledRef.current = false; setEnabled(false);}
  }
  return <button className="sound-toggle" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? 'Mute interface sounds' : 'Enable interface sounds'}><span aria-hidden="true">{enabled ? '◖))' : '◖×'}</span>Sound {enabled ? 'on' : 'off'}</button>;
}
