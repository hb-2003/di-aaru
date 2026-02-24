'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminFetch } from '@/lib/admin/auth';
import FormField from '@/components/admin/FormField';
import SectionContentEditor from '@/components/admin/SectionContentEditor'; // Import the new component
import StatusBadge from '@/components/admin/StatusBadge';
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Settings,
  Eye,
  Type
} from 'lucide-react';
import Link from 'next/link';

const SECTION_TYPES = [
  { label: 'Hero Section', value: 'shared.hero-section' },
  { label: 'Product Section', value: 'shared.product-section' },
  { label: 'About Section', value: 'shared.about-section' },
  { label: 'Why Choose Us', value: 'shared.why-choose-us' },
  { label: 'Testimonial Section', value: 'shared.testimonial-section' },
  { label: 'Gallery Section', value: 'shared.gallery-section' },
  { label: 'Contact Section', value: 'shared.contact-section' },
];

export default function PageEditor() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.slug === 'new';

  const [formData, setFormData] = useState<any>({
    title: '',
    seoTitle: '',
    seoDescription: '',
    sections: [],
    status: 'draft'
  });

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [expandedSectionIdx, setExpandedSectionIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!isNew) {
      const fetchPage = async () => {
        try {
          const res = await adminFetch(`/api/pages/${params.slug}`);
          if (res.ok) {
            const result = await res.json();
            setFormData(result.data);
          } else {
            setError('Page not found');
          }
        } catch (err) {
          setError('Failed to fetch page');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPage();
    }
  }, [params.slug, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const url = isNew ? '/api/pages' : `/api/pages/${params.slug}`;
      const method = isNew ? 'POST' : 'PUT';

      // Clean up sections for saving (e.g. resolve order)
      const cleanedSections = formData.sections.map((s: any, idx: number) => ({
        ...s,
        order: idx
      }));

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...formData, sections: cleanedSections } }),
      });

      if (res.ok) {
        const result = await res.json();
        setSuccess(true);
        if (isNew) {
          router.push(`/admin/pages/${result.data.slug}`);
        } else {
          setFormData(result.data);
        }
      } else {
        const result = await res.json();
        setError(result.error?.message || 'Failed to save page');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const addSection = (type: string) => {
    const newSection = {
      type,
      content: {},
      isShow: true,
      order: formData.sections.length
    };
    setFormData((prev: any) => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setExpandedSectionIdx(formData.sections.length);
  };

  const removeSection = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      sections: prev.sections.filter((_: any, i: number) => i !== idx)
    }));
    if (expandedSectionIdx === idx) setExpandedSectionIdx(null);
  };

  const moveSection = (idx: number, direction: 'up' | 'down') => {
    const newSections = [...formData.sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;

    [newSections[idx], newSections[targetIdx]] = [newSections[targetIdx], newSections[idx]];
    setFormData((prev: any) => ({ ...prev, sections: newSections }));
    if (expandedSectionIdx === idx) setExpandedSectionIdx(targetIdx);
    else if (expandedSectionIdx === targetIdx) setExpandedSectionIdx(idx);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
        <p className="text-[var(--admin-text-dim)]">Loading page content...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 admin-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 rounded-lg bg-[var(--admin-bg-hover)] text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'Create Page' : formData.title}</h1>
            <p className="text-[var(--admin-text-dim)]">{isNew ? 'Design a new landing page' : `Editing path: /${formData.slug}`}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {!isNew && (
            <Link href={formData.slug === 'home' ? '/' : `/${formData.slug}`} target="_blank" className="admin-btn admin-btn-secondary">
              <ExternalLink size={18} />
              Preview Page
            </Link>
          )}
          <button type="submit" disabled={isSaving} className="admin-btn admin-btn-primary min-w-[120px] justify-center">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Page</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-[var(--admin-danger)]">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings size={18} className="text-[var(--admin-text-muted)]" />
                Page Configuration
              </h3>
            </div>
            <div className="admin-card-body space-y-6">
              <FormField label="Page Title" required>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Engagement Rings"
                  className="admin-input"
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="SEO Title">
                  <input
                    name="seoTitle"
                    value={formData.seoTitle || ''}
                    onChange={handleChange}
                    placeholder="Meta title for search engines"
                    className="admin-input"
                  />
                </FormField>
                <FormField label="Status">
                  <select name="status" value={formData.status} onChange={handleChange} className="admin-select">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </FormField>
              </div>

              <FormField label="SEO Description">
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription || ''}
                  onChange={handleChange}
                  placeholder="Meta description for search results..."
                  className="admin-input h-24"
                />
              </FormField>
            </div>
          </div>

          {/* Dynamic Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--admin-text-dim)] uppercase tracking-wider ml-1">Page Sections</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--admin-text-muted)] font-mono uppercase">{formData.sections.length} Components</span>
              </div>
            </div>

            <div className="space-y-3">
              {formData.sections.length === 0 ? (
                <div className="admin-empty admin-card py-12">
                  <div className="admin-empty-icon"><Plus size={24} /></div>
                  <p className="text-sm text-[var(--admin-text-dim)]">This page has no content yet.</p>
                  <p className="text-xs text-[var(--admin-text-muted)] mt-1">Add a section below to get started.</p>
                </div>
              ) : (
                formData.sections.map((section: any, idx: number) => {
                  console.log('Section data (before editor):', JSON.stringify(section, null, 2)); // Debugging log
                  return (
                    <div key={idx} className={`admin-card transition-all duration-300 ${expandedSectionIdx === idx ? 'ring-1 ring-[var(--admin-gold-dim)]' : ''}`}>
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--admin-bg-raised)] transition-colors group"
                        onClick={() => setExpandedSectionIdx(expandedSectionIdx === idx ? null : idx)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="admin-drag-handle p-1">
                            <GripVertical size={16} />
                          </div>
                          <div className={`p-2 rounded-lg ${section.isShow ? 'bg-[var(--admin-gold-glow)] text-[var(--admin-gold)]' : 'bg-[var(--admin-bg-hover)] text-[var(--admin-text-muted)]'}`}>
                            <Type size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-widest leading-none">
                              {SECTION_TYPES.find(t => t.value === section.type)?.label || 'Component'}
                            </p>
                            <h4 className="text-sm font-semibold mt-1">
                              {section.content?.heading || section.content?.section_title || section.content?.title || 'No Title'}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }}
                            disabled={idx === 0}
                            className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] disabled:opacity-0"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }}
                            disabled={idx === formData.sections.length - 1}
                            className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] disabled:opacity-0"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <div className="w-px h-4 bg-[var(--admin-border)] mx-1" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeSection(idx); }}
                            className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] group-hover:opacity-100 opacity-0 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {expandedSectionIdx === idx && (
                        <div className="admin-card-body border-t border-[var(--admin-border)] bg-[var(--admin-bg-raised)]/30 animate-adminFadeIn">
                          <SectionContentEditor
                            sectionType={section.type}
                            content={section.content}
                            onChange={(newContent) => {
                              const newSections = [...formData.sections];
                              newSections[idx].content = newContent;
                              setFormData({ ...formData, sections: newSections });
                            }}
                          />

                          <div className="flex items-center justify-between mt-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <span className="text-xs font-semibold text-[var(--admin-text-dim)] group-hover:text-[var(--admin-text)] transition-colors">Visible on page</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newSections = [...formData.sections];
                                  newSections[idx].isShow = !newSections[idx].isShow;
                                  setFormData({ ...formData, sections: newSections });
                                }}
                                className={`admin-toggle ${section.isShow ? 'active' : ''}`}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            <div className="pt-4 flex items-center gap-3 overflow-x-auto pb-2 admin-scrollbar">
              {SECTION_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => addSection(type.value)}
                  className="admin-btn admin-btn-secondary h-10 px-4 flex-shrink-0"
                >
                  <Plus size={16} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">Page Details</h3>
            </div>
            <div className="admin-card-body space-y-4">
              <div className="p-4 rounded-xl bg-[var(--admin-bg-raised)] border border-[var(--admin-border)]">
                <p className="text-[10px] text-[var(--admin-text-muted)] uppercase font-bold mb-2 tracking-widest">Public URL</p>
                <p className="font-mono text-xs truncate text-[var(--admin-gold)]">
                  {process.env.NEXT_PUBLIC_SITE_URL || 'https://diaaru.com'}/{formData.slug}
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--admin-text-dim)]">Status:</span>
                  <StatusBadge status={formData.status} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--admin-text-dim)]">Last Modified:</span>
                  <span className="text-[var(--admin-text)]">{formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString() : 'Draft'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--admin-text-dim)]">Created:</span>
                  <span className="text-[var(--admin-text)]">{formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'Now'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye size={18} className="text-[var(--admin-text-muted)]" />
                SEO Preview
              </h3>
            </div>
            <div className="admin-card-body">
              <div className="bg-white rounded-lg p-4 text-black shadow-inner">
                <p className="text-[14px] text-[#1a0dab] font-medium truncate mb-1">{formData.seoTitle || formData.title} | Di'aaru Luxury</p>
                <p className="text-[12px] text-[#006621] truncate mb-1">diaaru.com/{formData.slug}</p>
                <p className="text-[12px] text-[#545454] line-clamp-2 leading-tight">
                  {formData.seoDescription || 'The exquisite Di\'aaru Diamond Jewelry collection features ethically sourced, lab-grown diamonds...'}
                </p>
              </div>
              <p className="mt-4 text-[11px] text-[var(--admin-text-muted)] leading-relaxed">
                * This is how your page will likely appear in search engine results. Using relevant keywords improves discoverability.
              </p>
            </div>
          </div>

          {!isNew && formData.slug !== 'home' && (
            <button
              type="button"
              onClick={async () => {
                if (confirm('Permanently delete this page and all its sections?')) {
                  const res = await adminFetch(`/api/pages/${formData.slug}`, { method: 'DELETE' });
                  if (res.ok) router.push('/admin/pages');
                }
              }}
              className="admin-btn admin-btn-danger w-full h-12 justify-center"
            >
              <Trash2 size={18} />
              Delete Page
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
