'use client';

import React from 'react';
import { Plus, Trash2, Type, Image as ImageIcon, MessageSquare, Star, Mail, Phone, MapPin, Tag, Package, PenTool, Users } from 'lucide-react';
import ImagePicker from './ImagePicker';

interface SectionContentEditorProps {
  sectionType: string;
  content: any;
  onChange: (newContent: any) => void;
}

const SectionContentEditor: React.FC<SectionContentEditorProps> = ({ sectionType, content: rawContent, onChange }) => {
  // Ensure content is never undefined/null
  const content = rawContent || {};

  const handleChange = (field: string, value: any) => {
    // Handle nested fields for repeatable groups (e.g., "features.0.feature_title")
    const parts = field.split('.');
    if (parts.length === 3) {
      const [group, indexStr, subField] = parts;
      const index = parseInt(indexStr);
      const newGroup = [...(content[group] || [])];
      newGroup[index] = { ...newGroup[index], [subField]: value };
      onChange({ ...content, [group]: newGroup });
    } else if (parts.length === 2) {
      // Handle nested object fields like "background_image.url"
      const [parent, child] = parts;
      onChange({ ...content, [parent]: { ...(typeof content[parent] === 'object' ? content[parent] : {}), [child]: value } });
    } else {
      onChange({ ...content, [field]: value });
    }
  };

  const handleAddRepeatable = (group: string, defaultItem: any) => {
    onChange({ ...content, [group]: [...(content[group] || []), defaultItem] });
  };

  const handleRemoveRepeatable = (group: string, index: number) => {
    const newGroup = (content[group] || []).filter((_: any, i: number) => i !== index);
    onChange({ ...content, [group]: newGroup });
  };

  // Safely resolve a value from content, itemContent, or nested paths
  const getFieldValue = (field: string, itemContent?: any): any => {
    if (itemContent) {
      // For repeatable items, get the last part of the field name
      const key = field.split('.').pop() as string;
      return itemContent[key] ?? '';
    }
    // Handle dot-notation like "background_image.url"
    const parts = field.split('.');
    if (parts.length === 2) {
      const parent = content[parts[0]];
      if (typeof parent === 'string') return parent; // field stored as plain string
      return parent?.[parts[1]] ?? '';
    }
    return content[field] ?? '';
  };

  const renderInputField = (label: string, field: string, type: string = 'text', placeholder: string = '', itemContent?: any) => {
    const value = getFieldValue(field, itemContent);
    return (
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--admin-text-muted)]">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            className="admin-input h-24"
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            className="admin-input"
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  const renderRepeatableGroup = (
    group: string,
    itemLabel: string,
    defaultItem: any,
    renderItemFields: (item: any, index: number, handleChange: (field: string, value: any) => void) => React.ReactNode,
    Icon: React.ElementType,
  ) => (
    <div className="space-y-4">
      <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--admin-text-muted)] flex items-center gap-2">
        <Icon size={14} className="text-[var(--admin-gold)]" />
        {itemLabel}s
      </label>
      {(content[group] || []).map((item: any, index: number) => (
        <div key={index} className="admin-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[var(--admin-text)]">{itemLabel} {index + 1}</h4>
            <button
              type="button"
              onClick={() => handleRemoveRepeatable(group, index)}
              className="admin-btn admin-btn-danger admin-btn-ghost !p-2"
            >
              <Trash2 size={16} />
            </button>
          </div>
          {renderItemFields(item, index, (field, value) => handleChange(`${group}.${index}.${field}`, value))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddRepeatable(group, defaultItem)}
        className="admin-btn admin-btn-secondary"
      >
        <Plus size={18} />
        Add New {itemLabel}
      </button>
    </div>
  );

  switch (sectionType) {
    case 'shared.hero-section':
      return (
        <div className="space-y-4">
          {renderInputField('Main Heading', 'heading', 'text', 'Your main headline')}
          {renderInputField('Sub Heading', 'sub_heading', 'text', 'A captivating sub-headline')}
          {renderInputField('Description', 'description', 'textarea', 'Supports HTML for rich text')}
          {renderInputField('Button Label', 'button_text', 'text', 'e.g., Discover More')}
          {renderInputField('Button Link', 'button_link', 'text', '/products')}
          <ImagePicker
            label="Background Image"
            value={content.background_image}
            onChange={(value) => handleChange('background_image', value)}
          />
        </div>
      );
    case 'shared.about-section':
      return (
        <div className="space-y-4">
          {renderInputField('Section Title', 'title', 'text', 'Our Story of Excellence')}
          {renderInputField('Story Description', 'description', 'textarea', 'Supports HTML for rich text')}
          <ImagePicker
            label="Image"
            value={content.image}
            onChange={(value) => handleChange('image', value)}
          />
        </div>
      );
    case 'shared.product-section':
      return (
        <div className="space-y-4">
          {renderInputField('Section Title', 'section_title', 'text', 'Our Exquisite Collection')}
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--admin-text-muted)] flex items-center gap-2">
              <Package size={14} className="text-[var(--admin-gold)]" />
              Products
            </label>
            <p className="admin-input !h-auto py-2 px-3 text-sm text-[var(--admin-text-dim)] bg-[var(--admin-bg-input)]">
              {content.products && content.products.length > 0
                ? `${content.products.length} featured products linked (read-only)`
                : 'No featured products linked.'}
            </p>
          </div>
        </div>
      );
    case 'shared.why-choose-us':
      return (
        <div className="space-y-4">
          {renderInputField('Section Title', 'title', 'text', 'Why Choose Us')}
          {renderRepeatableGroup(
            'features',
            'Feature',
            { feature_title: '', feature_description: '' },
            (item, index, itemHandleChange) => (
              <>
                {renderInputField('Feature Name', 'feature_title', 'text', 'Unrivaled Quality', item)}
                {renderInputField('Feature Description', 'feature_description', 'textarea', 'Detailed explanation of the feature...', item)}
              </>
            ),
            Star
          )}
        </div>
      );
    case 'shared.testimonial-section':
      return (
        <div className="space-y-4">
          {renderInputField('Section Title', 'section_title', 'text', 'What Our Clients Say')}
          {renderRepeatableGroup(
            'testimonials',
            'Testimonial',
            { customer_name: '', review: '' },
            (item, index, itemHandleChange) => (
              <>
                {renderInputField('Customer Name', 'customer_name', 'text', 'John Doe', item)}
                {renderInputField('Review Text', 'review', 'textarea', 'Amazing experience...', item)}
              </>
            ),
            MessageSquare
          )}
        </div>
      );
    case 'shared.gallery-section':
      return (
        <div className="space-y-4">
          {renderInputField('Gallery Title', 'title', 'text', 'Our Craftsmanship Gallery')}
          {renderRepeatableGroup(
            'images',
            'Image',
            { url: '', alternativeText: '' }, // Default to an object with url and altText
            (item, index, itemHandleChange) => (
              <>
                <ImagePicker
                  label="Image"
                  value={item.url}
                  onChange={(value) => itemHandleChange('url', value)}
                />
                {renderInputField('Alternative Text', 'alternativeText', 'text', 'Description of image for accessibility', item)}
              </>
            ),

            ImageIcon
          )}
        </div>
      );
    case 'shared.contact-section':
      return (
        <div className="space-y-4">
          {renderInputField('Section Title', 'title', 'text', 'Contact Us')}
          {renderInputField('Address', 'address', 'textarea', '123 Luxury Lane, Diamond City')}
          {renderInputField('Phone Number', 'phone', 'text', '+1 (123) 456-7890')}
          {renderInputField('Email', 'email', 'email', 'info@diaaru.com')}
          {renderInputField('Google Maps Link', 'map_link', 'text', 'https://goo.gl/maps/...')}
        </div>
      );
    default:
      return (
        <div className="admin-card p-4 text-[var(--admin-text-muted)] text-sm">
          No editor available for section type: <code className="text-[var(--admin-gold)]">{sectionType}</code>
          <p className="mt-2">Showing raw JSON editor for advanced users.</p>
          <textarea
            className="admin-input h-48 mt-4 font-mono text-xs"
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch (err) {
                console.error('Invalid JSON input', err);
              }
            }}
          />
        </div>
      );
  }
};

export default SectionContentEditor;
