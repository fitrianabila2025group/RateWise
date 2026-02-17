'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormProps {
  item: Record<string, unknown> | null;
  onClose: () => void;
  onSave: () => void;
  apiUrl: string;
  fields: {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'textarea';
    required?: boolean;
  }[];
}

export function AdminFormDialog({ item, onClose, onSave, apiUrl, fields }: FormProps) {
  const isEdit = !!item?.id;
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.key] = item ? String(item[f.key] ?? '') : '';
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const body: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === 'number') {
        body[f.key] = values[f.key] ? parseFloat(values[f.key]) : null;
      } else {
        body[f.key] = values[f.key];
      }
    });

    try {
      const url = isEdit ? `${apiUrl}/${item.id}` : apiUrl;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(JSON.stringify(data.error || 'Failed to save'));
        setSaving(false);
        return;
      }

      onSave();
      onClose();
    } catch {
      setError('Network error');
      setSaving(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit' : 'Create New'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.key}
                    value={values[field.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    required={field.required}
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type === 'number' ? 'number' : 'text'}
                    step={field.type === 'number' ? '0.01' : undefined}
                    value={values[field.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    className="mt-1"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
