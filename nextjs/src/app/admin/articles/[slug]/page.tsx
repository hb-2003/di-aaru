'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/admin/auth';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  ArrowLeft,
  FileText,
  User,
  Tag,
  Plus,
  Trash2,
  GripVertical,
  Type,
  ChevronDown,
  ChevronUp,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function ArticleEditorPage() {
  const { slug: slugParam } = useParams();
  const router = useRouter();
  const isNew = slugParam === 'new';

  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    description: '',
    cover: null,
    blocks: [],
    status: 'draft',
    authorId: '',
    categoryId: ''
  });

  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [expandedBlockIdx, setExpandedBlockIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, categoriesRes] = await Promise.all([
          adminFetch('/api/authors'),
          adminFetch('/api/categories')
        ]);

        if (authorsRes.ok) {
          const result = await authorsRes.json();
          setAuthors(result.data);
        }
        if (categoriesRes.ok) {
          const result = await categoriesRes.json();
          setCategories(result.data);
        }

        if (!isNew) {
          const articleRes = await adminFetch(`/api/articles/${slugParam}?populate=author,category`);
          if (articleRes.ok) {
            const result = await articleRes.json();
            setFormData(result.data);
          } else {
            setError('Failed to load article details');
          }
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slugParam, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const url = isNew ? '/api/articles' : `/api/articles/${slugParam}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      if (res.ok) {
        const result = await res.json();
        setSuccess(true);
        if (isNew) {
          router.push(`/admin/articles/${result.data.slug}`);
        } else {
          setFormData(result.data);
          setTimeout(() => setSuccess(false), 3000);
        }
      } else {
        const result = await res.json();
        setError(result.error?.message || 'Failed to save article');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (isNew) {
      const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev: any) => ({ ...prev, title, slug: generatedSlug }));
    } else {
      setFormData((prev: any) => ({ ...prev, title }));
    }
  };

  const addBlock = (type: 'rich-text' | 'image') => {
    const newBlock = type === 'rich-text'
      ? { __component: 'shared.rich-text', body: '' }
      : { __component: 'shared.media', file: null };

    setFormData((prev: any) => ({
      ...prev,
      blocks: [...(prev.blocks || []), newBlock]
    }));
    setExpandedBlockIdx(formData.blocks?.length || 0);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
        <p className="text-[var(--admin-text-dim)]">Loading article editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto admin-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="p-2 rounded-full hover:bg-[var(--admin-bg-hover)] text-[var(--admin-text-dim)] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'Create New Article' : 'Edit Article'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={formData.status} />
              {!isNew && <span className="text-[var(--admin-text-muted)] text-xs font-mono">{formData.slug}</span>}
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="admin-btn admin-btn-primary min-w-[140px] justify-center"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Article</>}
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
          <p className="text-sm font-medium">Article saved successfully</p>
        </div>
      )}

      <div className="flex gap-1 bg-[var(--admin-bg-raised)]/50 p-1 rounded-xl w-fit border border-[var(--admin-border)]">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'content' ? 'bg-[var(--admin-gold)] text-black shadow-lg' : 'text-[var(--admin-text-dim)] hover:text-[var(--admin-text)]'}`}
        >
          <FileText size={16} /> Content
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-[var(--admin-gold)] text-black shadow-lg' : 'text-[var(--admin-text-dim)] hover:text-[var(--admin-text)]'}`}
        >
          <Settings size={16} /> Settings & SEO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'content' ? (
            <>
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="font-semibold">Article Header</h3>
                </div>
                <div className="admin-card-body space-y-6">
                  <FormField label="Headline Title">
                    <input
                      name="title"
                      value={formData.title || ''}
                      onChange={handleTitleChange}
                      className="admin-input text-xl font-bold border-none bg-transparent px-0 focus:ring-0 placeholder:opacity-30"
                      placeholder="Start with a compelling title..."
                      required
                    />
                  </FormField>

                  <FormField label="Short Description / Excerpt">
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="admin-input min-h-[100px] border-none bg-transparent px-0 focus:ring-0 text-[var(--admin-text-dim)] italic"
                      placeholder="Write a brief summary for social media and listings..."
                    />
                  </FormField>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-[var(--admin-text-dim)] uppercase tracking-wider">Story Composition</h3>
                  <span className="text-[10px] text-[var(--admin-text-muted)] font-mono">{formData.blocks?.length || 0} Elements</span>
                </div>

                <div className="space-y-4">
                  {(formData.blocks || []).length === 0 ? (
                    <div className="admin-empty admin-card py-16 border-dashed border-2 flex flex-col items-center">
                      <div className="p-4 rounded-full bg-[var(--admin-bg-raised)] mb-4">
                        <FileText size={32} className="text-[var(--admin-text-muted)]" />
                      </div>
                      <p className="text-[var(--admin-text-dim)] text-sm mb-6">Your story is waiting to be told.</p>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => addBlock('rich-text')} className="admin-btn admin-btn-secondary">
                          <Type size={16} /> Add Text
                        </button>
                        <button type="button" onClick={() => addBlock('image')} className="admin-btn admin-btn-secondary">
                          <ImageIcon size={16} /> Add Image
                        </button>
                      </div>
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
                            <div className={`p-2 rounded ${block.__component === 'shared.rich-text' ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                              {block.__component === 'shared.rich-text' ? (
                                <Type size={16} className="text-blue-400" />
                              ) : (
                                <ImageIcon size={16} className="text-purple-400" />
                              )}
                            </div>
                            <span className="text-sm font-semibold truncate max-w-[300px]">
                              {block.__component === 'shared.rich-text'
                                ? (block.body ? block.body.substring(0, 60) + '...' : 'Text Section')
                                : 'Image Section'}
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
                            {block.__component === 'shared.rich-text' ? (
                              <textarea
                                value={block.body}
                                onChange={(e) => {
                                  const newBlocks = [...formData.blocks];
                                  newBlocks[idx].body = e.target.value;
                                  setFormData({ ...formData, blocks: newBlocks });
                                }}
                                className="admin-input min-h-[300px] font-serif text-lg leading-relaxed bg-transparent border-none focus:ring-0"
                                placeholder="Once upon a time in the world of diamonds..."
                              />
                            ) : (
                              <MediaPicker
                                value={block.file}
                                onChange={(media) => {
                                  const newBlocks = [...formData.blocks];
                                  newBlocks[idx].file = media;
                                  setFormData({ ...formData, blocks: newBlocks });
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {(formData.blocks || []).length > 0 && (
                    <div className="flex justify-center gap-4 py-4">
                      <button type="button" onClick={() => addBlock('rich-text')} className="admin-btn admin-btn-secondary border-dashed px-8">
                        <Plus size={16} /> Text Block
                      </button>
                      <button type="button" onClick={() => addBlock('image')} className="admin-btn admin-btn-secondary border-dashed px-8">
                        <Plus size={16} /> Image Block
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="font-semibold">URL Configuration</h3>
                </div>
                <div className="admin-card-body">
                  <FormField label="URL Slug" description="The unique identity of this article in the URL path.">
                    <input
                      name="slug"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="admin-input font-mono text-sm"
                      placeholder="e.g. the-perfect-diamond-cut"
                    />
                  </FormField>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="font-semibold">Classification</h3>
                </div>
                <div className="admin-card-body grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField label="Author">
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
                      <select
                        value={formData.authorId || ''}
                        onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                        className="admin-input pl-10 appearance-none"
                      >
                        <option value="">Select an Author</option>
                        {authors.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                  </FormField>

                  <FormField label="Category">
                    <div className="relative">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
                      <select
                        value={formData.categoryId || ''}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="admin-input pl-10 appearance-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </FormField>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">Publishing</h3>
            </div>
            <div className="admin-card-body space-y-6">
              <FormField label="Status">
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="admin-input"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </FormField>

              <div className="pt-2">
                 <p className="text-[10px] text-[var(--admin-text-muted)] uppercase tracking-widest mb-1">Created At</p>
                 <p className="text-sm font-mono">{formData.createdAt ? new Date(formData.createdAt).toLocaleString() : 'Not published yet'}</p>
              </div>
              <div>
                 <p className="text-[10px] text-[var(--admin-text-muted)] uppercase tracking-widest mb-1">Last Modified</p>
                 <p className="text-sm font-mono">{formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : '-'}</p>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">Cover Image</h3>
            </div>
            <div className="admin-card-body">
              <MediaPicker
                value={formData.cover}
                onChange={(media) => setFormData({ ...formData, cover: media })}
                label="Article Cover"
              />
              <p className="mt-4 text-[10px] text-[var(--admin-text-muted)] uppercase tracking-wider text-center">
                Wide aspect ratio recommended (16:9)
              </p>
            </div>
          </div>

          {!isNew && (
            <div className="admin-card border-[var(--admin-danger)]/20">
              <div className="admin-card-header">
                <h3 className="font-semibold text-[var(--admin-danger)]">Danger Zone</h3>
              </div>
              <div className="admin-card-body">
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this article?')) {
                      const res = await adminFetch(`/api/articles/${slugParam}`, { method: 'DELETE' });
                      if (res.ok) router.push('/admin/articles');
                    }
                  }}
                  className="admin-btn w-full justify-center border-[var(--admin-danger)]/30 text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10"
                >
                  <Trash2 size={16} /> Delete Article
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
