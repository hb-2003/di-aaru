'use client';

import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={`relative -left-1/2 -top-1/2 transition-transform duration-300 ease-out ${
          isPointer ? 'scale-150' : 'scale-100'
        } ${isMouseDown ? 'scale-90' : ''}`}
      >
        {/* Diamond Tip */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gold opacity-80"
        >
          <path
            d="M12 2L20 9L12 22L4 9L12 2Z"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="rgba(196,168,105,0.1)"
          />
          <path
            d="M4 9H20"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M12 2V22"
            stroke="currentColor"
            strokeWidth="0.5"
            className="opacity-40"
          />
          <path
            d="M8 9L12 22L16 9"
            stroke="currentColor"
            strokeWidth="0.5"
            className="opacity-60"
          />
        </svg>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 animate-pulse bg-gold/10 blur-md rounded-full" />
      </div>
    </div>
  );
};

export default CustomCursor;
