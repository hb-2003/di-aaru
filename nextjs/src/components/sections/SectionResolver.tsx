import React from 'react';
import Hero from './Hero';
import ProductSection from './ProductSection';
import RichText from './RichText';
import AboutSection from './AboutSection';
import WhyChooseUs from './WhyChooseUs';
import GallerySection from './GallerySection';
import TestimonialSection from './TestimonialSection';
import ExcellenceSection from './ExcellenceSection';
import ContactSection from './ContactSection';
import MediaSection from './MediaSection';
import QuoteSection from './QuoteSection';
import SliderSection from './SliderSection';
import ScrollTextSection from './ScrollTextSection';

const componentMap: Record<string, React.FC<any>> = {
  'shared.hero-section': Hero,
  'shared.product-section': ProductSection,
  'shared.rich-text': RichText,
  'shared.about-section': AboutSection,
  'shared.why-choose-us': WhyChooseUs,
  'shared.gallery-section': GallerySection,
  'shared.testimonial-section': TestimonialSection,
  'shared.excellence-section': ExcellenceSection,
  'shared.contact-section': ContactSection,
  'shared.media-section': MediaSection,
  'shared.quote-section': QuoteSection,
  'shared.slider-section': SliderSection,
  'shared.scroll-text-section': ScrollTextSection,
};

interface SectionResolverProps {
  sections: any[];
}

const SectionResolver: React.FC<SectionResolverProps> = ({ sections }) => {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <>
      {sections.map((section, index) => {
        const Component = componentMap[section.__component];

        if (!Component) {
          console.warn(`No component found for ${section.__component}`);
          return null;
        }

        // We use the index as a key for static layouts,
        // but if sections have unique IDs in the DB, those are preferred.
        return <Component key={`${section.__component}-${index}`} data={section} />;
      })}
    </>
  );
};

export default SectionResolver;
