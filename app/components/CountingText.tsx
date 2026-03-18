import React, { useRef, useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';

interface CountingTextProps {
  value: string | number;
  duration?: number; // Duration in milliseconds for numerical animation
  className?: string;
  style?: React.CSSProperties;
}

const CountingText: React.FC<CountingTextProps> = ({ value, duration = 2000, className, style }) => {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [currentValue, setCurrentValue] = useState<string | number>(typeof value === 'number' ? 0 : value);
  const isNumber = typeof value === 'number';

  useEffect(() => {
    if (inView) {
      if (isNumber) {
        let startValue = 0;
        const endValue = value as number;
        const startTime = performance.now();

        const animateCount = (timestamp: DOMHighResTimeStamp) => {
          const progress = (timestamp - startTime) / duration;
          const animatedValue = Math.min(progress, 1) * endValue;
          setCurrentValue(Math.floor(animatedValue));

          if (progress < 1) {
            requestAnimationFrame(animateCount);
          } else {
            setCurrentValue(endValue);
          }
        };
        requestAnimationFrame(animateCount);
      } else {
        // For non-numeric values, just display the value when in view
        setCurrentValue(value);
      }
    } else {
      // Reset value when out of view
      setCurrentValue(isNumber ? 0 : value);
    }
  }, [inView, value, duration, isNumber]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className} style={style}>
      {currentValue}
    </span>
  );
};

export default CountingText;
