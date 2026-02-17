'use client';

import { AdminDataTable } from '@/components/admin/admin-data-table';
import { AdminFormDialog } from '@/components/admin/admin-form-dialog';
import { Badge } from '@/components/ui/badge';

interface SalesTaxRate {
  id: string;
  stateCode: string;
  stateName: string;
  stateRate: number;
  avgLocalRate: number | null;
  combinedRate: number | null;
}

const columns = [
  { key: 'stateCode', label: 'Code' },
  { key: 'stateName', label: 'State' },
  {
    key: 'stateRate',
    label: 'State Rate',
    render: (item: SalesTaxRate) => <Badge>{item.stateRate}%</Badge>,
  },
  {
    key: 'avgLocalRate',
    label: 'Avg Local',
    render: (item: SalesTaxRate) => item.avgLocalRate !== null ? `${item.avgLocalRate}%` : '–',
  },
  {
    key: 'combinedRate',
    label: 'Combined',
    render: (item: SalesTaxRate) => item.combinedRate !== null ? `${item.combinedRate}%` : '–',
  },
];

const fields = [
  { key: 'stateCode', label: 'State Code (2 chars)', required: true },
  { key: 'stateName', label: 'State Name', required: true },
  { key: 'stateRate', label: 'State Rate (%)', type: 'number' as const, required: true },
  { key: 'avgLocalRate', label: 'Avg Local Rate (%)', type: 'number' as const },
  { key: 'combinedRate', label: 'Combined Rate (%)', type: 'number' as const },
];

export default function AdminSalesTaxPage() {
  return (
    <AdminDataTable<SalesTaxRate>
      title="Sales Tax Rates"
      apiUrl="/api/admin/sales-tax"
      columns={columns}
      searchField="stateName"
      renderForm={(item, onClose, onSave) => (
        <AdminFormDialog
          item={item as Record<string, unknown> | null}
          onClose={onClose}
          onSave={onSave}
          apiUrl="/api/admin/sales-tax"
          fields={fields}
        />
      )}
    />
  );
}
