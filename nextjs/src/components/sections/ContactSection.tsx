'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

interface ContactSectionProps {
  data: {
    title?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

const ContactSection: React.FC<ContactSectionProps> = ({ data }) => {
  const { title, description, email, phone, address } = data;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 5000);
  };

  return (
    <section className="py-24 bg-white" id="contact">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Get in Touch</div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            {title || 'Contact Us'}
          </h2>
          {description && <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">{description}</p>}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-serif mb-8 text-black">Let's Create Something Beautiful</h3>
            <p className="text-gray-500 mb-12 text-lg leading-relaxed">
              Whether you're looking for the perfect engagement ring or a custom piece,
              our team is here to bring your vision to life.
            </p>

            <div className="space-y-8">
              {email && (
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-black">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Email</h4>
                    <a href={`mailto:${email}`} className="text-gray-500 hover:text-black transition-colors">{email}</a>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-black">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Phone</h4>
                    <a href={`tel:${phone}`} className="text-gray-500 hover:text-black transition-colors">{phone}</a>
                  </div>
                </div>
              )}

              {address && (
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-black">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Location</h4>
                    <p className="text-gray-500 leading-relaxed">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.form
            className="bg-gray-50 p-8 md:p-12 border border-gray-100"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label htmlFor="phone" className="text-xs uppercase tracking-widest font-bold text-gray-400">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2 mb-8">
              <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-gray-400">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="How can we help you today?"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`w-full py-5 px-8 font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${
                isSubmitted
                  ? 'bg-green-600 text-white'
                  : 'bg-black text-white hover:bg-gray-800'
              } disabled:opacity-70`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSubmitted ? (
                <>
                  <CheckCircle size={18} />
                  Message Sent
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
