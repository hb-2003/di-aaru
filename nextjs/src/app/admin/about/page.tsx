'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import FormField from '@/components/admin/FormField';
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  Info,
  Mail,
  Phone,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Type
} from 'lucide-react';

export default function AboutEditorPage() {
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [expandedBlockIdx, setExpandedBlockIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await adminFetch('/api/about');
        if (res.ok) {
          const result = await res.json();
          setFormData(result.data);
        } else {
          setError('Failed to load about content');
        }
      } catch (err) {
        setError('An error occurred while fetching content');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await adminFetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      if (res.ok) {
        const result = await res.json();
        setFormData(result.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const result = await res.json();
        setError(result.error?.message || 'Failed to save about content');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const addBlock = () => {
    const newBlock = {
      __component: 'shared.rich-text',
      body: ''
    };
    setFormData((prev: any) => ({
      ...prev,
      blocks: [...(prev.blocks || []), newBlock]
    }));
    setExpandedBlockIdx((formData.blocks?.length || 0));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
        <p className="text-[var(--admin-text-dim)]">Loading about page content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto admin-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">About Page</h1>
          <p className="text-[var(--admin-text-dim)]">Manage the brand story and contact information.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="admin-btn admin-btn-primary min-w-[140px] justify-center"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Content</>}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-[var(--admin-danger)]">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-[var(--admin-success)]/10 border border-[var(--admin-success)]/20 rounded-xl flex items-center gap-3 text-[var(--admin-success)]">
          <Check size={20} />
          <p className="text-sm font-medium">Content updated successfully</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold flex items-center gap-2">
              <Info size={18} className="text-[var(--admin-gold)]" />
              General Information
            </h3>
          </div>
          <div className="admin-card-body space-y-6">
            <FormField label="Page Title">
              <input
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="admin-input"
                placeholder="e.g. The Di'aaru Story"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Contact Email">
                <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" size={16} />
                   <input
                     name="email"
                     type="email"
                     value={formData.email || ''}
                     onChange={handleChange}
                     className="admin-input pl-10"
                     placeholder="contact@diaaru.com"
                   />
                </div>
              </FormField>
              <FormField label="Contact Phone">
                <div className="relative">
                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" size={16} />
                   <input
                     name="phone"
                     value={formData.phone || ''}
                     onChange={handleChange}
                     className="admin-input pl-10"
                     placeholder="+1 234 567 890"
                   />
                </div>
              </FormField>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--admin-text-dim)] uppercase tracking-wider ml-1">Content Blocks</h3>
            <span className="text-[10px] text-[var(--admin-text-muted)] font-mono uppercase">{formData.blocks?.length || 0} Blocks</span>
          </div>

          <div className="space-y-3">
            {(formData.blocks || []).length === 0 ? (
              <div className="admin-empty admin-card py-12 border-dashed">
                <p className="text-sm text-[var(--admin-text-dim)]">No story blocks added yet.</p>
                <button type="button" onClick={addBlock} className="mt-4 admin-btn admin-btn-secondary">
                  <Plus size={16} /> Add First Block
                </button>
              </div>
            ) : (
              formData.blocks.map((block: any, idx: number) => (
                <div key={idx} className={`admin-card transition-all ${expandedBlockIdx === idx ? 'ring-1 ring-[var(--admin-gold-dim)]' : ''}`}>
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--admin-bg-raised)] transition-colors"
                    onClick={() => setExpandedBlockIdx(expandedBlockIdx === idx ? null : idx)}
                  >
                    <div className="flex items-center gap-4">
                      <GripVertical size={16} className="text-[var(--admin-text-muted)]" />
                      <div className="p-2 rounded bg-[var(--admin-bg-hover)]">
                        <Type size={16} className="text-[var(--admin-gold)]" />
                      </div>
                      <span className="text-sm font-semibold truncate max-w-[300px]">
                        {block.body ? block.body.substring(0, 60) + '...' : 'Empty Rich Text Block'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button
                         type="button"
                         onClick={(e) => {
                           e.stopPropagation();
                           const newBlocks = [...formData.blocks];
                           newBlocks.splice(idx, 1);
                           setFormData({ ...formData, blocks: newBlocks });
                         }}
                         className="p-1.5 text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] transition-colors"
                       >
                         <Trash2 size={16} />
                       </button>
                       {expandedBlockIdx === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  {expandedBlockIdx === idx && (
                    <div className="admin-card-body border-t border-[var(--admin-border)] bg-[var(--admin-bg-raised)]/30">
                       <textarea
                         value={block.body}
                         onChange={(e) => {
                           const newBlocks = [...formData.blocks];
                           newBlocks[idx].body = e.target.value;
                           setFormData({ ...formData, blocks: newBlocks });
                         }}
                         className="admin-input min-h-[200px] font-serif text-base leading-relaxed"
                         placeholder="Start writing the story section..."
                       />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {(formData.blocks || []).length > 0 && (
            <button
              type="button"
              onClick={addBlock}
              className="admin-btn admin-btn-secondary w-full border-dashed py-3 justify-center"
            >
              <Plus size={18} /> Add Content Block
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
