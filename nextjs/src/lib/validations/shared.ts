import { z } from 'zod';

export const MediaObjectSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  resourceType: z.string().optional(),
});

export const SeoSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  shareImage: MediaObjectSchema.optional(),
});

// Dynamic Zone Component Schemas

export const RichTextSchema = z.object({
  __component: z.literal('shared.rich-text'),
  body: z.string(),
});

export const QuoteSchema = z.object({
  __component: z.literal('shared.quote'),
  title: z.string().optional(),
  body: z.string(),
});

export const MediaComponentSchema = z.object({
  __component: z.literal('shared.media'),
  file: MediaObjectSchema,
});

export const SliderSchema = z.object({
  __component: z.literal('shared.slider'),
  files: z.array(MediaObjectSchema),
});

export const HeroSectionSchema = z.object({
  __component: z.literal('shared.hero-section'),
  heading: z.string(),
  sub_heading: z.string().optional(),
  description: z.string().optional(),
  background_image: MediaObjectSchema.optional(),
  button_text: z.string().optional(),
  button_link: z.string().optional(),
  logo: MediaObjectSchema.optional(),
  isShow: z.boolean().default(true),
});

export const AboutSectionSchema = z.object({
  __component: z.literal('shared.about-section'),
  title: z.string(),
  description: z.string(),
  image: MediaObjectSchema.optional(),
  isShow: z.boolean().default(true),
});

export const ProductSectionSchema = z.object({
  __component: z.literal('shared.product-section'),
  section_title: z.string(),
  products: z.array(z.string().uuid()), // Array of product IDs
  isShow: z.boolean().default(true),
});

export const FeatureSchema = z.object({
  feature_title: z.string(),
  feature_description: z.string(),
  icon: MediaObjectSchema.optional(),
});

export const WhyChooseUsSchema = z.object({
  __component: z.literal('shared.why-choose-us'),
  title: z.string(),
  features: z.array(FeatureSchema),
  isShow: z.boolean().default(true),
});

export const TestimonialSchema = z.object({
  customer_name: z.string(),
  review: z.string(),
  image: MediaObjectSchema.optional(),
});

export const TestimonialSectionSchema = z.object({
  __component: z.literal('shared.testimonial-section'),
  section_title: z.string(),
  testimonials: z.array(TestimonialSchema),
  isShow: z.boolean().default(true),
});

export const GallerySectionSchema = z.object({
  __component: z.literal('shared.gallery-section'),
  title: z.string().optional(),
  images: z.array(MediaObjectSchema),
  isShow: z.boolean().default(true),
});

export const ContactSectionSchema = z.object({
  __component: z.literal('shared.contact-section'),
  title: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  map_link: z.string().optional(),
  isShow: z.boolean().default(true),
});

export const BlockSchema = z.discriminatedUnion('__component', [
  RichTextSchema,
  QuoteSchema,
  MediaComponentSchema,
  SliderSchema,
]);

export const SectionSchema = z.discriminatedUnion('__component', [
  HeroSectionSchema,
  AboutSectionSchema,
  ProductSectionSchema,
  WhyChooseUsSchema,
  TestimonialSectionSchema,
  GallerySectionSchema,
  ContactSectionSchema,
]);
