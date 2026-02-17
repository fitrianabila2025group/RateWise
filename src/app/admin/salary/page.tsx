'use client';

import { AdminDataTable } from '@/components/admin/admin-data-table';
import { AdminFormDialog } from '@/components/admin/admin-form-dialog';

interface SalaryConfig {
  id: string;
  countryCode: string;
  countryName: string;
  config: string;
}

const columns = [
  { key: 'countryCode', label: 'Code' },
  { key: 'countryName', label: 'Country' },
  {
    key: 'config',
    label: 'Config',
    render: (item: SalaryConfig) => (
      <span className="text-xs text-muted-foreground truncate max-w-xs inline-block">
        {item.config.slice(0, 100)}...
      </span>
    ),
  },
];

const fields = [
  { key: 'countryCode', label: 'Country Code', required: true },
  { key: 'countryName', label: 'Country Name', required: true },
  { key: 'config', label: 'Config (JSON)', type: 'textarea' as const, required: true },
];

export default function AdminSalaryPage() {
  return (
    <AdminDataTable<SalaryConfig>
      title="Salary Configurations"
      apiUrl="/api/admin/salary"
      columns={columns}
      searchField="countryCode"
      renderForm={(item, onClose, onSave) => (
        <AdminFormDialog
          item={item as Record<string, unknown> | null}
          onClose={onClose}
          onSave={onSave}
          apiUrl="/api/admin/salary"
          fields={fields}
        />
      )}
    />
  );
}
