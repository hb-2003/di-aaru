'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ContactSection.module.css';

export default function ContactSection({ className = '' }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }

    return;
  }, [dropdownOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject) {
      alert('Please select an Area of Interest.');
      return;
    }
    alert("Thank you. A Di'aaru specialist will reach out within 24 hours.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ''} ${className}`}
    >
      <div className={styles.container}>
        <div className={styles.contentGrid}>
          {/* Left Side: Information */}
          <div className={styles.infoCol}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelLine} />
              <span className={styles.labelText}>CONCIERGE</span>
            </div>

            <h2 className={styles.heading}>
              <span className={styles.headingWhite}>Personalized</span>
              <span className={styles.headingGold}>Consultation.</span>
            </h2>

            <p className={styles.bodyText}>
              Our specialists are available for private appointments across our global ateliers.
              Whether you seek a bespoke masterpiece or a guided tour of our collections,
              we are here to assist your journey.
            </p>

            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>GLOBAL ATELIERS</span>
                <p className={styles.detailValue}>London • Antwerp • New York</p>
                <span className={styles.detailNote}>By private appointment only.</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>CONCIERGE HOURS</span>
                <p className={styles.detailValue}>09:00 — 18:00 GMT</p>
                <span className={styles.detailNote}>Monday through Saturday.</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>DIGITAL INQUIRY</span>
                <p className={styles.detailValue}>concierge@diaaru.com</p>
              </div>

              {/* Decorative Diamond */}
            </div>

            <div className={styles.sphereGlow} />
          </div>

          {/* Right Side: Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <div className={styles.cardGlow} />
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className={styles.input}
                    autoComplete="name"
                  />
                  <label className={styles.label}>Your Name</label>
                  <span className={styles.inputLine} />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className={styles.input}
                    autoComplete="email"
                  />
                  <label className={styles.label}>Email Address</label>
                  <span className={styles.inputLine} />
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.customSelectWrapper} ref={dropdownRef}>
                    <button
                      type="button"
                      className={`${styles.customSelectToggle} ${formData.subject ? styles.selected : ''}`}
                      onClick={() => setDropdownOpen((open) => !open)}
                      aria-haspopup="listbox"
                      aria-expanded={dropdownOpen}
                    >
                      <span>{formData.subject ? formData.subject : 'Area of Interest'}</span>
                      <span className={styles.customChevron}>▼</span>
                    </button>

                    <div className={`${styles.customSelectOptions} ${dropdownOpen ? styles.open : ''}`} role="listbox">
                      {[
                        { value: 'bespoke', label: 'Bespoke Creation' },
                        { value: 'collection', label: 'Collection Inquiry' },
                        { value: 'press', label: 'Press & Media' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, subject: option.label }));
                            setDropdownOpen(false);
                          }}
                          className={`${styles.customSelectOption} ${formData.subject === option.label ? styles.activeOption : ''}`}
                          role="option"
                          aria-selected={formData.subject === option.label}
                        >
                          <span>{option.label}</span>
                          {formData.subject === option.label && <span className={styles.checkmark}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input type="hidden" name="subject" value={formData.subject} />
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    rows={1}
                    className={styles.textarea}
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                  />
                  <label className={styles.label}>Message</label>
                  <span className={styles.inputLine} />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  <span className={styles.btnText}>SUBMIT INQUIRY</span>
                  <div className={styles.btnShimmer} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
