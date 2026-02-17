'use client';

import { AdminDataTable } from '@/components/admin/admin-data-table';
import { AdminFormDialog } from '@/components/admin/admin-form-dialog';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  {
    key: 'published',
    label: 'Status',
    render: (item: BlogPost) => (
      <Badge variant={item.published ? 'default' : 'secondary'}>
        {item.published ? 'Published' : 'Draft'}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (item: BlogPost) => new Date(item.createdAt).toLocaleDateString(),
  },
];

const fields = [
  { key: 'title', label: 'Title', required: true },
  { key: 'slug', label: 'Slug', required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const },
  { key: 'content', label: 'Content (HTML)', type: 'textarea' as const, required: true },
  { key: 'featuredImage', label: 'Featured Image URL' },
];

export default function AdminBlogPage() {
  return (
    <AdminDataTable<BlogPost>
      title="Blog Posts"
      apiUrl="/api/admin/blog"
      columns={columns}
      searchField="title"
      renderForm={(item, onClose, onSave) => (
        <AdminFormDialog
          item={item as Record<string, unknown> | null}
          onClose={onClose}
          onSave={onSave}
          apiUrl="/api/admin/blog"
          fields={fields}
        />
      )}
    />
  );
}
