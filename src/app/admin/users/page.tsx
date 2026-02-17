'use client';

import { AdminDataTable } from '@/components/admin/admin-data-table';
import { AdminFormDialog } from '@/components/admin/admin-form-dialog';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Name' },
  {
    key: 'role',
    label: 'Role',
    render: (item: User) => (
      <Badge variant={item.role === 'ADMIN' ? 'default' : 'secondary'}>{item.role}</Badge>
    ),
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (item: User) => new Date(item.createdAt).toLocaleDateString(),
  },
];

const fields = [
  { key: 'email', label: 'Email', required: true },
  { key: 'name', label: 'Name' },
  { key: 'password', label: 'Password (min 8 chars)', required: true },
];

export default function AdminUsersPage() {
  return (
    <AdminDataTable<User>
      title="Users"
      apiUrl="/api/admin/users"
      columns={columns}
      searchField="email"
      renderForm={(item, onClose, onSave) => (
        <AdminFormDialog
          item={item as Record<string, unknown> | null}
          onClose={onClose}
          onSave={onSave}
          apiUrl="/api/admin/users"
          fields={fields}
        />
      )}
    />
  );
}
