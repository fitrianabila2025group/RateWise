'use client';

import { AdminDataTable } from '@/components/admin/admin-data-table';
import { AdminFormDialog } from '@/components/admin/admin-form-dialog';
import { Badge } from '@/components/ui/badge';

interface LandingPage {
  id: string;
  slug: string;
  section: string;
  title: string;
  _count?: { faqs: number };
}

const columns = [
  { key: 'slug', label: 'Slug' },
  {
    key: 'section',
    label: 'Section',
    render: (item: LandingPage) => <Badge variant="secondary">{item.section}</Badge>,
  },
  { key: 'title', label: 'Title' },
  {
    key: '_count',
    label: 'FAQs',
    render: (item: LandingPage) => String(item._count?.faqs ?? 0),
  },
];

const fields = [
  { key: 'slug', label: 'Slug (e.g. vat/germany)', required: true },
  { key: 'section', label: 'Section (vat, sales-tax, salary, finance)', required: true },
  { key: 'title', label: 'Page Title', required: true },
  { key: 'metaDescription', label: 'Meta Description', type: 'textarea' as const },
  { key: 'h1', label: 'H1 Heading' },
  { key: 'introParagraph', label: 'Intro Paragraph', type: 'textarea' as const },
  { key: 'howItWorks', label: 'How It Works Content', type: 'textarea' as const },
  { key: 'examples', label: 'Examples Content', type: 'textarea' as const },
];

export default function AdminPagesPage() {
  return (
    <AdminDataTable<LandingPage>
      title="Landing Pages"
      apiUrl="/api/admin/pages"
      columns={columns}
      searchField="slug"
      renderForm={(item, onClose, onSave) => (
        <AdminFormDialog
          item={item as Record<string, unknown> | null}
          onClose={onClose}
          onSave={onSave}
          apiUrl="/api/admin/pages"
          fields={fields}
        />
      )}
    />
  );
}
