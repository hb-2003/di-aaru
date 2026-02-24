'use client';

import React from 'react';
import TextAnimation from '../ui/TextAnimation';

interface ScrollTextItem {
  text: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  letterAnime?: boolean;
  lineAnime?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface ScrollTextSectionProps {
  data: {
    items?: ScrollTextItem[];
  };
}

const ScrollTextSection: React.FC<ScrollTextSectionProps> = ({ data }) => {
  const { items } = data;

  // If no items provided, use the default demo layout from the original project
  const displayItems = items || [
    {
      text: 'Creative ideas start here.',
      direction: 'up' as const,
      align: 'center' as const,
    },
    {
      text: "Let's team up and turn ideas into reality ✨",
      letterAnime: true,
      align: 'left' as const,
    },
    {
      text: 'Turning concepts into reality',
      direction: 'right' as const,
      align: 'right' as const,
    },
    {
      text: 'Dream big, work hard & achieve greatness',
      direction: 'down' as const,
      lineAnime: true,
      align: 'center' as const,
    },
  ];

  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center items-center';
      case 'right': return 'text-right items-end';
      default: return 'text-left items-start';
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 space-y-32">
        {displayItems.map((item, index) => (
          <div key={index} className={`flex flex-col ${getAlignClass(item.align)}`}>
            <TextAnimation
              text={item.text}
              direction={item.direction}
              letterAnime={item.letterAnime}
              lineAnime={item.lineAnime}
              className="text-4xl md:text-6xl lg:text-8xl font-serif font-light tracking-tight leading-tight max-w-5xl"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScrollTextSection;
