'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RichTextProps {
  data: {
    body?: string;
  };
}

const RichText: React.FC<RichTextProps> = ({ data }) => {
  const { body } = data;

  if (!body) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto prose prose-gray lg:prose-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </section>
  );
};

export default RichText;
