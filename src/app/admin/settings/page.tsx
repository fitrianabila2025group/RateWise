'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Setting {
  id: string;
  key: string;
  value: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings.map(({ key, value }) => ({ key, value }))),
      });
      if (res.ok) {
        setMessage('Settings saved successfully.');
      } else {
        setMessage('Failed to save settings.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading settings...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

      {message && (
        <div className="bg-primary/10 text-primary text-sm p-3 rounded-md mb-4">{message}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.key}>
              <Label htmlFor={setting.key} className="font-mono text-xs text-muted-foreground">
                {setting.key}
              </Label>
              <Input
                id={setting.key}
                value={setting.value}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                className="mt-1"
              />
            </div>
          ))}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
