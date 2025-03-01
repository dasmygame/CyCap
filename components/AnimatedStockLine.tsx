'use client'

import { useEffect, useRef } from 'react';

export default function AnimatedStockLine() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    // Reset the animation
    pathRef.current.style.strokeDasharray = pathRef.current.getTotalLength().toString();
    pathRef.current.style.strokeDashoffset = pathRef.current.getTotalLength().toString();

    // Trigger the animation
    requestAnimationFrame(() => {
      if (pathRef.current) {
        pathRef.current.style.transition = 'stroke-dashoffset 2s ease-in-out';
        pathRef.current.style.strokeDashoffset = '0';
      }
    });
  }, []);

  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <svg
        viewBox="0 0 1000 200"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M0,150 L100,140 L200,130 L300,110 L400,120 L500,100 L600,90 L700,70 L800,80 L900,60 L1000,50"
          className="stroke-[#22c55e] dark:stroke-emerald-500 stroke-2 fill-none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}