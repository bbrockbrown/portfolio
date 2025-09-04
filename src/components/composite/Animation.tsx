'use client';

import { useAnimationFrame } from 'motion/react';
import { useRef } from 'react';

export default function UseAnimationFrame() {
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame((t) => {
    if (!ref.current) return;

    // Sporadic rotation with different speeds and directions
    const rotateX = Math.sin(t / 2000) * 180 + Math.cos(t / 3500) * 90;
    const rotateY = Math.cos(t / 1800) * 270 + Math.sin(t / 4200) * 120;
    const rotateZ = Math.sin(t / 2800) * 160 + Math.cos(t / 1600) * 200;

    // Sporadic scaling
    const scale = 0.8 + Math.abs(Math.sin(t / 2500)) * 0.6;

    // Sporadic position changes
    const x = Math.sin(t / 3200) * 30 + Math.cos(t / 4800) * 20;
    const y = Math.cos(t / 2100) * 40 + Math.sin(t / 5500) * 25;

    ref.current.style.transform = `
      translateX(${x}px) 
      translateY(${y}px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      rotateZ(${rotateZ}deg) 
      scale(${scale})
    `;
  });

  return (
    <div className='container mt-10'>
      <div className='cube' ref={ref}>
        <div className='side front' />
        <div className='side left' />
        <div className='side right' />
        <div className='side top' />
        <div className='side bottom' />
        <div className='side back' />
      </div>
      <StyleSheet />
    </div>
  );
}

function StyleSheet() {
  return (
    <style>{`
            
        .container {
            perspective: 800px;
            width: 50px;
            height: 50px;
        }

        .cube {
            width: 50px;
            height: 50px;
            position: relative;
            transform-style: preserve-3d;
        }

        .side {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: red;
            opacity: 0.6;
        }

        .front {
            transform: rotateY(0deg) translateZ(25px);
            background-color: oklch(0.488 0.243 264.376 / 0.4);
        }
        .right {
            transform: rotateY(90deg) translateZ(25px);
            background-color: oklch(0.696 0.17 162.48 / 0.4);
        }
        .back {
            transform: rotateY(180deg) translateZ(25px);
            background-color: oklch(0.769 0.188 70.08 / 0.4);
        }
        .left {
            transform: rotateY(-90deg) translateZ(25px);
            background-color: oklch(0.627 0.265 303.9 / 0.4);
        }
        .top {
            transform: rotateX(90deg) translateZ(25px);
            background-color: oklch(0.645 0.246 16.439 / 0.4);
        }
        .bottom {
            transform: rotateX(-90deg) translateZ(25px);
            background-color: oklch(0.704 0.191 22.216 / 0.4);
        }

    `}</style>
  );
}
