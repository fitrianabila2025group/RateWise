'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdsConfig {
  enableTopBanner: boolean;
  enableSidebar: boolean;
  enableInContent: boolean;
  enableFooter: boolean;
  adProvider: 'adsense' | 'custom';
  adsenseClientId: string;
  adsenseSlotTopBanner: string;
  adsenseSlotSidebar: string;
  adsenseSlotInContent: string;
  adsenseSlotFooter: string;
  customAdHtmlTopBanner: string;
  customAdHtmlSidebar: string;
  customAdHtmlInContent: string;
  customAdHtmlFooter: string;
  globalHeadScript: string;
  globalBodyScript: string;
  nonPersonalizedAdsDefault: boolean;
}

const DEFAULT_CONFIG: AdsConfig = {
  enableTopBanner: false,
  enableSidebar: false,
  enableInContent: false,
  enableFooter: false,
  adProvider: 'adsense',
  adsenseClientId: '',
  adsenseSlotTopBanner: '',
  adsenseSlotSidebar: '',
  adsenseSlotInContent: '',
  adsenseSlotFooter: '',
  customAdHtmlTopBanner: '',
  customAdHtmlSidebar: '',
  customAdHtmlInContent: '',
  customAdHtmlFooter: '',
  globalHeadScript: '',
  globalBodyScript: '',
  nonPersonalizedAdsDefault: true,
};

const SLOT_LABELS: Record<string, string> = {
  TopBanner: 'Top Banner (728×90)',
  Sidebar: 'Sidebar (300×250)',
  InContent: 'In-Content (728×250)',
  Footer: 'Footer (728×90)',
};

export default function AdminAdsPage() {
  const [config, setConfig] = useState<AdsConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [previewSlot, setPreviewSlot] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ads');
      if (res.ok) {
        const data = await res.json();
        setConfig({ ...DEFAULT_CONFIG, ...data });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setMessage('Ads configuration saved successfully.');
        setMessageType('success');
      } else {
        const err = await res.json().catch(() => null);
        setMessage(err?.error || 'Failed to save ads configuration.');
        setMessageType('error');
      }
    } catch {
      setMessage('Network error saving configuration.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof AdsConfig>(key: K, value: AdsConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <p className="text-muted-foreground">Loading ads configuration...</p>;

  const slots = ['TopBanner', 'Sidebar', 'InContent', 'Footer'] as const;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Ads Manager</h1>
      <p className="text-muted-foreground mb-8">
        Configure ad placements across the site. Changes take effect immediately after saving.
      </p>

      {message && (
        <div
          className={`text-sm p-3 rounded-md mb-4 ${
            messageType === 'success'
              ? 'bg-primary/10 text-primary'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {message}
        </div>
      )}

      <Tabs defaultValue="provider" className="space-y-6">
        <TabsList>
          <TabsTrigger value="provider">Provider</TabsTrigger>
          <TabsTrigger value="slots">Ad Slots</TabsTrigger>
          <TabsTrigger value="scripts">Global Scripts</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* ─── Provider Settings ──────────────────────────────────────── */}
        <TabsContent value="provider">
          <Card>
            <CardHeader>
              <CardTitle>Provider Settings</CardTitle>
              <CardDescription>Choose between Google AdSense or custom ad code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Ad Provider</Label>
                <Select
                  value={config.adProvider}
                  onValueChange={(v) => updateField('adProvider', v as 'adsense' | 'custom')}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adsense">Google AdSense</SelectItem>
                    <SelectItem value="custom">Custom HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.adProvider === 'adsense' && (
                <div className="space-y-2">
                  <Label htmlFor="adsenseClientId">AdSense Publisher ID</Label>
                  <Input
                    id="adsenseClientId"
                    placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                    value={config.adsenseClientId}
                    onChange={(e) => updateField('adsenseClientId', e.target.value)}
                    className="max-w-md"
                  />
                  <p className="text-xs text-muted-foreground">
                    Found in your AdSense dashboard → Account → Account information.
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Switch
                  checked={config.nonPersonalizedAdsDefault}
                  onCheckedChange={(v) => updateField('nonPersonalizedAdsDefault', v)}
                />
                <div>
                  <Label>Non-personalized ads by default</Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, ads default to non-personalized mode until cookie consent is given.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Slot Configuration ─────────────────────────────────────── */}
        <TabsContent value="slots">
          <div className="space-y-4">
            {slots.map((slotKey) => {
              const enableKey = `enable${slotKey}` as keyof AdsConfig;
              const adsenseSlotKey = `adsenseSlot${slotKey}` as keyof AdsConfig;
              const customKey = `customAdHtml${slotKey}` as keyof AdsConfig;
              const label = SLOT_LABELS[slotKey];

              return (
                <Card key={slotKey}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{label}</CardTitle>
                      <Switch
                        checked={config[enableKey] as boolean}
                        onCheckedChange={(v) => updateField(enableKey, v as never)}
                      />
                    </div>
                  </CardHeader>
                  {config[enableKey] && (
                    <CardContent className="space-y-4">
                      {config.adProvider === 'adsense' ? (
                        <div className="space-y-2">
                          <Label>AdSense Slot ID</Label>
                          <Input
                            placeholder="1234567890"
                            value={config[adsenseSlotKey] as string}
                            onChange={(e) => updateField(adsenseSlotKey, e.target.value as never)}
                            className="max-w-md"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label>Custom Ad HTML</Label>
                          <Textarea
                            rows={6}
                            placeholder="<div>Your ad code here...</div>"
                            value={config[customKey] as string}
                            onChange={(e) => updateField(customKey, e.target.value as never)}
                            className="font-mono text-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            Dangerous tags and event handlers will be stripped for security.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ─── Global Scripts ─────────────────────────────────────────── */}
        <TabsContent value="scripts">
          <Card>
            <CardHeader>
              <CardTitle>Global Scripts</CardTitle>
              <CardDescription>
                Optional scripts injected into the page head or body. Use for analytics, tag
                managers, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Head Script (injected in &lt;head&gt;)</Label>
                <Textarea
                  rows={5}
                  placeholder={'<script async src="https://..."></script>'}
                  value={config.globalHeadScript}
                  onChange={(e) => updateField('globalHeadScript', e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Body Script (injected before &lt;/body&gt;)</Label>
                <Textarea
                  rows={5}
                  placeholder={'<script>...</script>'}
                  value={config.globalBodyScript}
                  onChange={(e) => updateField('globalBodyScript', e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Preview ────────────────────────────────────────────────── */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Ad Preview</CardTitle>
              <CardDescription>
                Safe preview of how ad slots will render. Scripts are NOT executed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {slots.map((s) => (
                  <Button
                    key={s}
                    variant={previewSlot === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewSlot(previewSlot === s ? null : s)}
                  >
                    {SLOT_LABELS[s]}
                  </Button>
                ))}
              </div>

              {previewSlot && (() => {
                const enableKey = `enable${previewSlot}` as keyof AdsConfig;
                const enabled = config[enableKey] as boolean;
                if (!enabled) {
                  return (
                    <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground text-sm">
                      This slot is disabled.
                    </div>
                  );
                }

                if (config.adProvider === 'adsense') {
                  const slotId = config[`adsenseSlot${previewSlot}` as keyof AdsConfig] as string;
                  return (
                    <div className="p-4 border rounded-md bg-muted/30 font-mono text-xs whitespace-pre-wrap break-all">
                      {`<ins class="adsbygoogle"\n  style="display:block"\n  data-ad-client="${config.adsenseClientId}"\n  data-ad-slot="${slotId}"${config.nonPersonalizedAdsDefault ? '\n  data-npa="1"' : ''}\n  data-ad-format="auto"\n  data-full-width-responsive="true"></ins>`}
                    </div>
                  );
                }

                const customHtml = config[`customAdHtml${previewSlot}` as keyof AdsConfig] as string;
                return (
                  <div className="p-4 border rounded-md bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-2">Sanitized HTML preview:</p>
                    <div className="font-mono text-xs whitespace-pre-wrap break-all bg-background p-3 rounded border">
                      {customHtml || '(empty)'}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Saving...' : 'Save Ads Configuration'}
        </Button>
      </div>
    </div>
  );
}
