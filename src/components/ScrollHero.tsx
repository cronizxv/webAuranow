import {useEffect,useRef} from 'react';

const desktop='./assets/world/after-hours-scrub-v2.mp4';
const mobile='./assets/world/after-hours-mobile-scrub-v2.mp4';
const desktopPoster='./assets/world/after-hours-topaz-poster.webp';
const mobilePoster='./assets/world/after-hours-mobile-topaz-poster.webp';

export function ScrollHero(){
 const rootRef=useRef<HTMLElement>(null),stageRef=useRef<HTMLDivElement>(null),videoRef=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const root=rootRef.current,stage=stageRef.current,video=videoRef.current;
  if(!root||!stage||!video)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow=window.matchMedia('(max-width: 860px)');
  let raf=0,disposed=false,enabled=false,failed=false,ready=false;
  let start=0,travel=1,target=0,current=0,source='';
  function queue(){if(!raf&&!disposed&&enabled&&!failed)raf=window.requestAnimationFrame(update);}
  function measure(){
   if(!root||!stage)return;
   start=root.getBoundingClientRect().top+window.scrollY;
   travel=Math.max(1,root.getBoundingClientRect().height-stage.getBoundingClientRect().height);
   readScroll();
  }
  function readScroll(){target=Math.max(0,Math.min(1,(window.scrollY-start)/travel));queue();}
  function update(){
   raf=0;
   if(!video||!enabled||disposed||failed)return;
   current=Math.abs(target-current)<.003?target:current+(target-current)*.4;
   if(ready&&Number.isFinite(video.duration)&&video.duration>0&&!video.seeking){
    const requested=current*Math.max(0,video.duration-1/24);
    if(Math.abs(video.currentTime-requested)>.022){try{video.currentTime=requested;}catch{}}
   }
   if(Math.abs(target-current)>.0005||video.seeking)queue();
  }
  function reveal(){if(video&&!disposed&&enabled){video.style.opacity='1';queue();}}
  function loaded(){ready=true;reveal();readScroll();}
  function metadata(){ready=true;readScroll();}
  function error(){failed=true;ready=false;if(video)video.style.opacity='0';}
  function choose(){
   if(!video)return;
   enabled=!reduced.matches;
   if(!enabled){window.cancelAnimationFrame(raf);raf=0;video.pause();video.removeAttribute('src');video.load();source='';ready=false;video.style.opacity='0';return;}
   const next=narrow.matches?mobile:desktop;
   if(next!==source){source=next;ready=false;failed=false;video.style.opacity='0';video.src=next;video.preload='auto';video.load();}
   measure();
  }
  function gesture(){if(video&&enabled&&video.readyState>=2&&narrow.matches){void video.play().then(()=>{video.pause();readScroll();}).catch(()=>{});}}
  function visible(){if(!document.hidden){measure();queue();}}
  const resize=new ResizeObserver(measure);resize.observe(root);resize.observe(stage);
  video.addEventListener('loadedmetadata',metadata);video.addEventListener('loadeddata',loaded);video.addEventListener('seeked',reveal);video.addEventListener('error',error);
  window.addEventListener('scroll',readScroll,{passive:true});window.addEventListener('resize',measure);
  window.addEventListener('pointerdown',gesture,{once:true,passive:true});
  document.addEventListener('visibilitychange',visible);reduced.addEventListener('change',choose);narrow.addEventListener('change',choose);
  void document.fonts.ready.then(()=>{if(!disposed)measure();});
  choose();
  return()=>{
   disposed=true;window.cancelAnimationFrame(raf);resize.disconnect();video.pause();
   video.removeEventListener('loadedmetadata',metadata);video.removeEventListener('loadeddata',loaded);video.removeEventListener('seeked',reveal);video.removeEventListener('error',error);
   window.removeEventListener('scroll',readScroll);window.removeEventListener('resize',measure);window.removeEventListener('pointerdown',gesture);
   document.removeEventListener('visibilitychange',visible);reduced.removeEventListener('change',choose);narrow.removeEventListener('change',choose);
   video.removeAttribute('src');video.load();
  };
 },[]);
 return <section className="scroll-scrub arrival" ref={rootRef} id="arrival" aria-label="CRONIZXV">
  <div className="scroll-scrub__stage" ref={stageRef}><div className="scroll-scrub__media" aria-hidden="true"><picture><source media="(max-width: 860px)" srcSet={mobilePoster}/><img className="hero-poster" src={desktopPoster} alt="" fetchPriority="high"/></picture><video ref={videoRef} className="hero-film" muted playsInline preload="none" disablePictureInPicture/></div></div>
  <article className="hero-story"><div className="hero-pin"><div className="scroll-scrub__copy"><h1 className="scroll-scrub__title">CRONIZXV</h1><p className="scroll-scrub__body">dreams come true when you dont sleep</p><div className="scroll-scrub__actions"><a className="arrival-link" href="#links">Socials <span aria-hidden="true">↘</span></a></div></div></div></article>
 </section>;
}
