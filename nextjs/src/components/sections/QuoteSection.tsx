'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote as QuoteIcon } from 'lucide-react';

interface QuoteSectionProps {
  data: {
    quote?: string;
    author?: string;
    role?: string;
  };
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ data }) => {
  const { quote, author, role } = data;

  if (!quote) return null;

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-gray-50 pointer-events-none select-none">
        <QuoteIcon size={400} strokeWidth={0.5} opacity={0.3} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-10 text-black">
            <QuoteIcon size={48} fill="currentColor" />
          </div>

          <blockquote className="text-3xl md:text-5xl font-serif italic mb-12 leading-tight text-gray-800">
            "{quote}"
          </blockquote>

          {(author || role) && (
            <div className="space-y-2">
              {author && <p className="text-sm font-bold uppercase tracking-[0.3em] text-black">{author}</p>}
              {role && <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{role}</p>}
            </div>
          )}

          <div className="w-12 h-px bg-gray-200 mx-auto mt-12" />
        </motion.div>
      </div>
    </section>
  );
};

export default QuoteSection;
