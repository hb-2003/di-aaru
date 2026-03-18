import { useRef, useEffect, useState } from 'react';

interface UseInViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export const useInView = ({ triggerOnce = false, ...options }: UseInViewOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (triggerOnce && ref.current) {
          observer.disconnect();
        }
      } else if (!triggerOnce) {
        setInView(false);
      }
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [triggerOnce, JSON.stringify(options)]);

  return [ref, inView] as const;
};
