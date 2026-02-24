'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface TextAnimationProps {
  text: string;
  as?: React.ElementType;
  variants?: Variants;
  className?: string;
  letterAnime?: boolean;
  lineAnime?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const TextAnimation: React.FC<TextAnimationProps> = ({
  text,
  as: Component = 'div',
  variants,
  className,
  letterAnime = false,
  lineAnime = false,
  direction = 'up',
}) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  const finalVariants = variants || defaultVariants;

  if (letterAnime) {
    return (
      <Component ref={ref} className={cn('overflow-hidden', className)}>
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={finalVariants}
            transition={{
              ...(finalVariants.visible && typeof finalVariants.visible === 'object' && 'transition' in finalVariants.visible
                ? (finalVariants.visible.transition as any)
                : {}),
              delay: i * 0.02,
            }}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </Component>
    );
  }

  if (lineAnime) {
    return (
      <Component ref={ref} className={cn('overflow-hidden', className)}>
        {text.split(' ').map((word, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={finalVariants}
            transition={{
              ...(finalVariants.visible && typeof finalVariants.visible === 'object' && 'transition' in finalVariants.visible
                ? (finalVariants.visible.transition as any)
                : {}),
              delay: i * 0.1,
            }}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </Component>
    );
  }

  return (
    <div ref={ref as any} className="overflow-hidden">
      <motion.div
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={finalVariants}
        className={className}
      >
        <Component>{text}</Component>
      </motion.div>
    </div>
  );
};

export default TextAnimation;
