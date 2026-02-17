'use client';

import { AdminDataTable } from '@/components/admin/admin-data-table';
import { AdminFormDialog } from '@/components/admin/admin-form-dialog';
import { Badge } from '@/components/ui/badge';

interface VatRate {
  id: string;
  countryCode: string;
  countryName: string;
  standardRate: number;
  reducedRate: number | null;
  superReducedRate: number | null;
  parkingRate: number | null;
  currency: string;
}

const columns = [
  { key: 'countryCode', label: 'Code' },
  { key: 'countryName', label: 'Country' },
  {
    key: 'standardRate',
    label: 'Standard Rate',
    render: (item: VatRate) => <Badge>{item.standardRate}%</Badge>,
  },
  {
    key: 'reducedRate',
    label: 'Reduced',
    render: (item: VatRate) => item.reducedRate !== null ? `${item.reducedRate}%` : '–',
  },
  { key: 'currency', label: 'Currency' },
];

const fields = [
  { key: 'countryCode', label: 'Country Code (2 chars)', required: true },
  { key: 'countryName', label: 'Country Name', required: true },
  { key: 'standardRate', label: 'Standard Rate (%)', type: 'number' as const, required: true },
  { key: 'reducedRate', label: 'Reduced Rate (%)', type: 'number' as const },
  { key: 'superReducedRate', label: 'Super Reduced Rate (%)', type: 'number' as const },
  { key: 'parkingRate', label: 'Parking Rate (%)', type: 'number' as const },
  { key: 'currency', label: 'Currency', required: true },
];

export default function AdminVatRatesPage() {
  return (
    <AdminDataTable<VatRate>
      title="VAT Rates"
      apiUrl="/api/admin/vat-rates"
      columns={columns}
      searchField="countryName"
      renderForm={(item, onClose, onSave) => (
        <AdminFormDialog
          item={item as Record<string, unknown> | null}
          onClose={onClose}
          onSave={onSave}
          apiUrl="/api/admin/vat-rates"
          fields={fields}
        />
      )}
    />
  );
}
