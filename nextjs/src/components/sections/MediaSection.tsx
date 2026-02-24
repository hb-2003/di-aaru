'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MediaSectionProps {
  data: {
    file?: {
      url: string;
      mime?: string;
      width?: number;
      height?: number;
    };
  };
}

const MediaSection: React.FC<MediaSectionProps> = ({ data }) => {
  const { file } = data;

  if (!file?.url) return null;

  const isVideo = file.mime?.startsWith('video/');

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-sm shadow-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {isVideo ? (
            <video
              src={file.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={file.url}
              alt="Media content"
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}

          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default MediaSection;
