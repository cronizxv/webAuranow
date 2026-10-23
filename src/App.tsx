import {useEffect,useRef} from 'react';
import type {ReactNode,PointerEvent} from 'react';
import {motion,useMotionValue,useSpring,useTransform,useReducedMotion} from 'motion/react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ScrollHero} from './components/ScrollHero';
import {PointerAtmosphere} from './components/pointer-atmosphere';
import {InterfaceSound} from './components/interface-sound';

function MagneticSurface({children,className,href,label}:{children:ReactNode;className:string;href:string;label:string}){
 const reduced=useReducedMotion(),ref=useRef<HTMLAnchorElement>(null);
 const px=useMotionValue(0),py=useMotionValue(0);
 const x=useSpring(px,{stiffness:140,damping:18}),y=useSpring(py,{stiffness:140,damping:18});
 const rotateX=useTransform(y,[-12,12],[3,-3]),rotateY=useTransform(x,[-16,16],[-3,3]);
 function move(event:PointerEvent<HTMLAnchorElement>){if(reduced||event.pointerType==='touch')return;const box=event.currentTarget.getBoundingClientRect(),dx=event.clientX-box.left,dy=event.clientY-box.top;px.set((dx/box.width-.5)*24);py.set((dy/box.height-.5)*16);ref.current?.style.setProperty('--pointer-x',`${dx}px`);ref.current?.style.setProperty('--pointer-y',`${dy}px`);}
 return <motion.a ref={ref} className={`social-surface ${className}`} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" onPointerMove={move} onPointerLeave={()=>{px.set(0);py.set(0);}} style={reduced?{}:{x,y,rotateX,rotateY,transformPerspective:900}}>{children}</motion.a>;
}
export default function App(){
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  const lenis=new Lenis({autoRaf:false,anchors:true,duration:1.05});
  lenis.on('scroll',ScrollTrigger.update);
  const tick=(time:number)=>lenis.raf(time*1000);
  gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
  const context=gsap.context(()=>{gsap.from('.site-header',{y:-15,duration:.9,ease:'power3.out'});gsap.from('.manifesto-image',{scale:1.08,scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:true}});});
  return()=>{context.revert();gsap.ticker.remove(tick);lenis.destroy();};
 },[]);
 return <>
 <PointerAtmosphere/>
 <a href="#links" className="skip-link">Skip to links</a>
 <header className="site-header"><a className="identity" href="#arrival" aria-label="CRONIZXV home"><img src="./assets/brand/mark-topaz.png" alt="" width="28" height="28"/>CRONIZXV</a><div className="header-controls"><InterfaceSound/><a className="nav-links" href="#links">Links <span aria-hidden="true">↗</span></a></div></header>
 <main><ScrollHero/>
 <section id="links" className="connections" aria-label="Social links"><div className="social-layout">
 <MagneticSurface className="x-surface" href="https://x.com/cronizx" label="Follow CRONIZXV on X, @cronizx"><img src="./assets/icons/x-topaz.png" alt=""/><span className="social-copy"><strong>X / Twitter</strong><span>@cronizx</span></span><span className="destination-arrow" aria-hidden="true">↗</span></MagneticSurface>
 <MagneticSurface className="telegram-surface" href="https://t.me/cronizxv" label="Join CRONIZXV on Telegram"><img src="./assets/icons/telegram-topaz.png" alt=""/><span className="social-copy"><strong>Telegram</strong><span>t.me/cronizxv</span></span><span className="destination-arrow" aria-hidden="true">↗</span></MagneticSurface>
 <MagneticSurface className="pump-surface" href="https://pump.fun/profile/cronizxv" label="Visit CRONIZXV on pump.fun"><img src="./assets/icons/pump-topaz.png" alt=""/><span className="social-copy"><strong>pump.fun</strong><span>cronizxv</span></span><span className="destination-arrow" aria-hidden="true">↗</span></MagneticSurface>
 <MagneticSurface className="twitch-surface" href="https://www.twitch.tv/cronizxv_" label="Watch CRONIZXV on Twitch"><img src="./assets/icons/twitch-topaz.png" alt=""/><span className="social-copy"><strong>Twitch</strong><span>cronizxv_</span></span><span className="destination-arrow" aria-hidden="true">↗</span></MagneticSurface>
 </div></section>
 <section className="manifesto" aria-labelledby="manifesto-title"><img className="manifesto-image" src="./assets/material-topaz.webp" alt="" loading="lazy"/><div style={{position:'relative',zIndex:1}}><h2 id="manifesto-title">So run,<br/>that ye may <span>obtain</span></h2><p style={{fontFamily:'IBM Plex Mono, monospace',fontSize:'12px',color:'var(--muted)',margin:'24px 0 0',letterSpacing:'.04em'}}>1 Corinthians 9:24 · KJV</p></div></section>
 </main><footer className="site-footer"><span>CRONIZXV</span><a href="#arrival" aria-label="Back to top">croniz.xyz <span aria-hidden="true">↑</span></a><p>Memecoins are high risk. Nothing here is financial advice.</p></footer>
 </>;
}
