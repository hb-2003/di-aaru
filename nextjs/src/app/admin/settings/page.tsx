'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  Settings as SettingsIcon,
  Globe,
  Bell,
  Search,
  Layout
} from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminFetch('/api/global');
        if (res.ok) {
          const result = await res.json();
          setFormData(result.data);
        } else {
          setError('Failed to load settings');
        }
      } catch (err) {
        setError('An error occurred while fetching settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await adminFetch('/api/global', {
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
        setError(result.error?.message || 'Failed to save settings');
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

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      defaultSeo: { ...prev.defaultSeo, [name]: value }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
        <p className="text-[var(--admin-text-dim)]">Loading site settings...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'topbar', label: 'Top Bar', icon: Bell },
    { id: 'seo', label: 'SEO Defaults', icon: Search },
    { id: 'appearance', label: 'Appearance', icon: Layout },
  ];

  return (
    <div className="max-w-5xl mx-auto admin-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Global Settings</h1>
          <p className="text-[var(--admin-text-dim)]">Configure site-wide preferences and metadata.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="admin-btn admin-btn-primary min-w-[140px] justify-center"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Settings</>}
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
          <p className="text-sm font-medium">Settings updated successfully</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--admin-bg-raised)] text-[var(--admin-gold)] border border-[var(--admin-border)] shadow-lg'
                    : 'text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            );
          })}

          <div className="mt-8 p-4 admin-card bg-transparent border-dashed">
            <h4 className="text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-widest mb-3">Audit Info</h4>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[var(--admin-text-dim)]">Last Modified:</span>
                <span className="text-[var(--admin-text)]">{new Date(formData.updatedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--admin-text-dim)]">Env:</span>
                <span className="text-[var(--admin-gold)] font-mono uppercase">{process.env.NODE_ENV}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="admin-card min-h-[500px]">
            <form onSubmit={handleSubmit} className="admin-card-body space-y-8">
              {activeTab === 'general' && (
                <div className="space-y-6 animate-adminFadeIn">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Globe size={18} className="text-[var(--admin-gold)]" />
                    General Configuration
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <FormField label="Site Name" required>
                      <input
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="e.g. Di'aaru Luxury"
                      />
                    </FormField>
                    <FormField label="Site Description">
                      <textarea
                        name="siteDescription"
                        value={formData.siteDescription}
                        onChange={handleChange}
                        className="admin-input h-32"
                        placeholder="Primary tagline for the homepage..."
                      />
                    </FormField>
                  </div>
                </div>
              )}

              {activeTab === 'topbar' && (
                <div className="space-y-6 animate-adminFadeIn">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Bell size={18} className="text-[var(--admin-gold)]" />
                    Top Bar Messages
                  </h3>
                  <FormField label="Message text">
                    <input
                      name="topBarMessage"
                      value={formData.topBarMessage || ''}
                      onChange={handleChange}
                      className="admin-input"
                      placeholder="e.g. Complimentary Shipping on all orders"
                    />
                  </FormField>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Phone Number">
                      <input
                        name="topBarPhone"
                        value={formData.topBarPhone || ''}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="+1 234 567 890"
                      />
                    </FormField>
                    <FormField label="Email Address">
                      <input
                        name="topBarEmail"
                        value={formData.topBarEmail || ''}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="info@diaaru.com"
                      />
                    </FormField>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6 animate-adminFadeIn">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Search size={18} className="text-[var(--admin-gold)]" />
                    Global SEO Defaults
                  </h3>
                  <FormField label="Default Meta Title">
                    <input
                      name="metaTitle"
                      value={formData.defaultSeo?.metaTitle || ''}
                      onChange={handleSeoChange}
                      className="admin-input"
                    />
                  </FormField>
                  <FormField label="Default Meta Description">
                    <textarea
                      name="metaDescription"
                      value={formData.defaultSeo?.metaDescription || ''}
                      onChange={handleSeoChange}
                      className="admin-input h-32"
                    />
                  </FormField>
                  <FormField label="Default Social Share Image">
                    <MediaPicker
                      value={formData.defaultSeo?.shareImage}
                      onChange={(media) => setFormData((prev: any) => ({
                        ...prev,
                        defaultSeo: { ...prev.defaultSeo, shareImage: media }
                      }))}
                    />
                  </FormField>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6 animate-adminFadeIn">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Layout size={18} className="text-[var(--admin-gold)]" />
                    Site Appearance
                  </h3>
                  <FormField label="Favicon (ICO/PNG)">
                    <MediaPicker
                      value={formData.favicon}
                      onChange={(media) => setFormData((prev: any) => ({ ...prev, favicon: media }))}
                    />
                  </FormField>
                  <div className="p-4 rounded-xl bg-[var(--admin-bg-raised)] border border-[var(--admin-border)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-white flex items-center justify-center p-2">
                      {formData.favicon?.url ? (
                        <img src={formData.favicon.url} alt="Favicon" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <SettingsIcon size={24} className="text-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Favicon Preview</p>
                      <p className="text-[10px] text-[var(--admin-text-dim)]">This icon appears in browser tabs.</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
