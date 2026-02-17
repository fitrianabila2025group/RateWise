'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminDataTableProps<T extends { id: string }> {
  title: string;
  apiUrl: string;
  columns: Column<T>[];
  renderForm: (item: T | null, onClose: () => void, onSave: () => void) => React.ReactNode;
  searchField?: string;
}

export function AdminDataTable<T extends { id: string }>({
  title,
  apiUrl,
  columns,
  renderForm,
  searchField,
}: AdminDataTableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<T | null | undefined>(undefined);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchItems();
  };

  const filtered = search && searchField
    ? items.filter((item) =>
        String((item as Record<string, unknown>)[searchField] || '')
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : items;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button onClick={() => setEditItem(null)}>Add New</Button>
      </div>

      {editItem !== undefined && renderForm(editItem, () => setEditItem(undefined), fetchItems)}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{filtered.length} items</CardTitle>
            {searchField && (
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render
                            ? col.render(item)
                            : String((item as Record<string, unknown>)[col.key] ?? '')}
                        </TableCell>
                      ))}
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditItem(item)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
