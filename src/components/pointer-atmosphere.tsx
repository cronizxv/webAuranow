import { useEffect, useRef } from 'react';
import '@/pointer-atmosphere.css';
import '@/starfield.css';
type Mote = {x:number;y:number;vx:number;vy:number;life:number;radius:number;burst?:boolean};
type Ring = {x:number;y:number;life:number;radius:number};
export function PointerAtmosphere() {
  const canvasRef=useRef<HTMLCanvasElement>(null),lightRef=useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = document.querySelector('.arrival .scroll-scrub__stage');
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const decoration = document.createElement('div');
    decoration.className = 'scene-depth-decoration';
    decoration.setAttribute('aria-hidden', 'true');
    for (const name of ['depth-haze depth-haze--far', 'depth-haze depth-haze--near', 'depth-glints', 'subtle-stars subtle-stars--far', 'subtle-stars subtle-stars--near']) {
      const layer = document.createElement('div'); layer.className = name;
      if (name === 'depth-glints') for (let i = 0; i < 4; i++) layer.appendChild(document.createElement('span'));
      if (name.startsWith('subtle-stars')) {
        const near = name.endsWith('--near');
        for (let i = 0; i < (near ? 7 : 15); i++) {
          const star = document.createElement('span');
          star.style.left = `${5 + ((i * 37 + (near ? 23 : 9)) % 90)}%`;
          star.style.top = `${8 + ((i * 29 + (near ? 17 : 3)) % 61)}%`;
          star.style.setProperty('--star-size', `${near ? 1.3 : .7 + (i % 3) * .22}px`);
          star.style.setProperty('--star-time', `${10 + (i * 7) % 13}s`);
          star.style.setProperty('--star-delay', `${-i * 2.7}s`);
          layer.appendChild(star);
        }
      }
      decoration.appendChild(layer);
    }
    stage.appendChild(decoration);
    return () => decoration.remove();
  }, []);
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(reduced.matches)return;
    const canvas=canvasRef.current,context=canvas?.getContext('2d');
    if(!canvas||!context)return;
    const root=document.documentElement;
    let width=window.innerWidth,height=window.innerHeight;
    let targetX=width/2,targetY=height/2,x=targetX,y=targetY,farX=x,farY=y,oldX=x,oldY=y;
    let frame=0,lastTime=0,active=false;
    const motes:Mote[]=[],rings:Ring[]=[];
    function resize(){if(!canvas||!context)return;width=window.innerWidth;height=window.innerHeight;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;context.setTransform(dpr,0,0,dpr,0,0);}
    function schedule(){if(!frame&&!reduced.matches)frame=window.requestAnimationFrame(paint);}
    function paint(time:number){
      if(!context)return;
      const delta=Math.min((time-lastTime)/16.67||1,2);lastTime=time;
      const ease=1-Math.pow(.82,delta),farEase=1-Math.pow(.94,delta);
      x+=(targetX-x)*ease;y+=(targetY-y)*ease;farX+=(targetX-farX)*farEase;farY+=(targetY-farY)*farEase;
      root.style.setProperty('--look-x',`${(x/width-.5)*64}px`);root.style.setProperty('--look-y',`${(y/height-.5)*44}px`);
      root.style.setProperty('--far-x',`${(farX/width-.5)*28}px`);root.style.setProperty('--far-y',`${(farY/height-.5)*20}px`);
      lightRef.current?.style.setProperty('transform',`translate3d(${x-320}px,${y-320}px,0)`);
      context.clearRect(0,0,width,height);context.globalCompositeOperation='lighter';
      for(let i=motes.length-1;i>=0;i--){const m=motes[i];m.life-=(m.burst?.019:.025)*delta;m.x+=m.vx*delta;m.y+=m.vy*delta;m.vx*=.967;m.vy*=.967;if(m.life<=0){motes.splice(i,1);continue;}context.beginPath();context.strokeStyle=m.burst?`rgba(213,191,248,${m.life*.85})`:`rgba(174,143,221,${m.life*.5})`;context.lineWidth=m.radius*m.life;context.moveTo(m.x,m.y);context.lineTo(m.x-m.vx*(m.burst?2.7:5),m.y-m.vy*(m.burst?2.7:5));context.stroke();}
      for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.life-=.035*delta;r.radius+=2.4*delta;if(r.life<=0){rings.splice(i,1);continue;}context.beginPath();context.arc(r.x,r.y,r.radius,0,Math.PI*2);context.strokeStyle=`rgba(183,151,228,${r.life*.48})`;context.lineWidth=r.life;context.stroke();}
      const moving=Math.abs(x-targetX)+Math.abs(y-targetY)+Math.abs(farX-targetX)+Math.abs(farY-targetY)>.25;
      if(moving||motes.length||rings.length)frame=window.requestAnimationFrame(paint);else{frame=0;lastTime=0;}
    }
    function move(event:PointerEvent){if(event.pointerType!=='mouse'||reduced.matches)return;targetX=event.clientX;targetY=event.clientY;if(!active){x=targetX;y=targetY;oldX=x;oldY=y;active=true;}lightRef.current?.setAttribute('data-active','true');const dx=targetX-oldX,dy=targetY-oldY,distance=Math.hypot(dx,dy);if(distance>2){const count=Math.min(5,Math.ceil(distance/12));for(let i=0;i<count;i++){const t=i/count;motes.push({x:oldX+dx*t,y:oldY+dy*t,vx:-dx*.008+(Math.random()-.5)*.7,vy:-dy*.008+(Math.random()-.5)*.7,life:.8,radius:1+Math.random()*1.4});}if(motes.length>180)motes.splice(0,motes.length-180);}oldX=targetX;oldY=targetY;schedule();}
    function burst(event:MouseEvent){if(reduced.matches)return;let bx=event.clientX,by=event.clientY;if(event.detail===0&&event.target instanceof Element){const rect=event.target.getBoundingClientRect();bx=rect.left+rect.width/2;by=rect.top+rect.height/2;}for(let i=0;i<38;i++){const angle=i/38*Math.PI*2+Math.random()*.16,speed=2+Math.random()*4.8;motes.push({x:bx,y:by,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.85+Math.random()*.15,radius:.7+Math.random()*1.4,burst:true});}rings.push({x:bx,y:by,life:1,radius:4});if(motes.length>240)motes.splice(0,motes.length-240);schedule();}
    function leave(){targetX=width/2;targetY=height/2;lightRef.current?.removeAttribute('data-active');active=false;schedule();}
    function motionChanged(){if(reduced.matches){window.cancelAnimationFrame(frame);frame=0;context?.clearRect(0,0,width,height);for(const name of ['--look-x','--look-y','--far-x','--far-y'])root.style.removeProperty(name);lightRef.current?.removeAttribute('data-active');}}
    resize();window.addEventListener('pointermove',move,{passive:true});document.addEventListener('click',burst,{passive:true});document.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);window.addEventListener('resize',resize);reduced.addEventListener('change',motionChanged);
    return()=>{window.cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);document.removeEventListener('click',burst);document.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);window.removeEventListener('resize',resize);reduced.removeEventListener('change',motionChanged);for(const name of ['--look-x','--look-y','--far-x','--far-y'])root.style.removeProperty(name);};
  },[]);
  return <><div aria-hidden="true" className="pointer-light" ref={lightRef}/><canvas aria-hidden="true" className="pointer-wake" ref={canvasRef}/></>;
}
