'use client';

import { useState, useMemo } from 'react';
import { Expense } from '@/types/expense';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/utils/formatCurrency';

interface CloudExportModalProps {
  expenses: Expense[];
  onClose: () => void;
}

type TabType = 'export' | 'integrations' | 'schedule' | 'history' | 'share';

type ExportTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

type Integration = {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  description: string;
};

type ExportHistoryItem = {
  id: string;
  date: string;
  template: string;
  destination: string;
  records: number;
  status: 'success' | 'pending' | 'failed';
};

const EXPORT_TEMPLATES: ExportTemplate[] = [
  { id: 'tax', name: 'Tax Report', description: 'Formatted for tax filing', icon: '📊' },
  { id: 'monthly', name: 'Monthly Summary', description: 'Overview by category', icon: '📅' },
  { id: 'analysis', name: 'Category Analysis', description: 'Detailed breakdown', icon: '📈' },
  { id: 'simple', name: 'Simple Export', description: 'Basic CSV format', icon: '📄' },
];

const INTEGRATIONS: Integration[] = [
  { id: 'sheets', name: 'Google Sheets', icon: '📗', connected: false, description: 'Export directly to Sheets' },
  { id: 'drive', name: 'Google Drive', icon: '💾', connected: false, description: 'Save to Drive folder' },
  { id: 'dropbox', name: 'Dropbox', icon: '📦', connected: true, description: 'Sync with Dropbox' },
  { id: 'onedrive', name: 'OneDrive', icon: '☁️', connected: false, description: 'Microsoft cloud storage' },
  { id: 'email', name: 'Email', icon: '📧', connected: true, description: 'Send via email' },
  { id: 'slack', name: 'Slack', icon: '💬', connected: false, description: 'Post to Slack channel' },
];

export function CloudExportModal({ expenses, onClose }: CloudExportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [selectedTemplate, setSelectedTemplate] = useState('simple');
  const [email, setEmail] = useState('');
  const [scheduleFrequency, setScheduleFrequency] = useState('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  // Mock export history
  const exportHistory: ExportHistoryItem[] = [
    { id: '1', date: '2026-02-01 14:30', template: 'Monthly Summary', destination: 'Dropbox', records: 45, status: 'success' },
    { id: '2', date: '2026-01-28 09:15', template: 'Tax Report', destination: 'Email', records: 120, status: 'success' },
    { id: '3', date: '2026-01-25 16:45', template: 'Simple Export', destination: 'Google Drive', records: 78, status: 'pending' },
  ];

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const handleExport = async () => {
    setIsProcessing(true);
    // Simulate cloud export
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert('Export successful! Data has been sent to your selected destination.');
    onClose();
  };

  const handleConnectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) => (int.id === id ? { ...int, connected: !int.connected } : int))
    );
  };

  const generateShareLink = () => {
    const randomId = Math.random().toString(36).substring(7);
    setShareLink(`https://expensetracker.app/share/${randomId}`);
  };

  const tabs = [
    { id: 'export' as TabType, label: 'Export', icon: '📤' },
    { id: 'integrations' as TabType, label: 'Integrations', icon: '🔌' },
    { id: 'schedule' as TabType, label: 'Schedule', icon: '⏰' },
    { id: 'history' as TabType, label: 'History', icon: '📜' },
    { id: 'share' as TabType, label: 'Share', icon: '🔗' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                ☁️ Cloud Export Center
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Export, sync, and share your expenses anywhere
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-xs font-medium text-green-700 dark:text-green-300">
                ● Online
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-zinc-800'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Choose Export Template
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {EXPORT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{template.icon}</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{template.name}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-blue-100">Ready to Export</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {expenses.length} records • {formatCurrency(totalAmount)} total
                    </div>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Connected Services
                </h3>
                <div className="grid gap-3">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{integration.icon}</div>
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">{integration.name}</div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">{integration.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnectIntegration(integration.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          integration.connected
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {integration.connected ? '✓ Connected' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Automatic Backups
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Backup Frequency
                    </label>
                    <select
                      value={scheduleFrequency}
                      onChange={(e) => setScheduleFrequency(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="none">No automatic backups</option>
                      <option value="daily">Daily at 12:00 AM</option>
                      <option value="weekly">Weekly on Sunday</option>
                      <option value="monthly">Monthly on 1st day</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Email Notifications
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {scheduleFrequency !== 'none' && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="font-medium text-green-900 dark:text-green-100">
                        ✓ Automatic Backup Enabled
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your expenses will be backed up {scheduleFrequency} to your connected services.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Export History</h3>
              <div className="space-y-3">
                {exportHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{item.template}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {item.date} • {item.records} records • {item.destination}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : item.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Share Your Expenses
                </h3>
                <div className="space-y-4">
                  <Button onClick={generateShareLink} variant="secondary" className="w-full">
                    🔗 Generate Shareable Link
                  </Button>

                  {shareLink && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                      <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Shareable Link (expires in 7 days)
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={shareLink}
                          readOnly
                          className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                        />
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(shareLink);
                            alert('Link copied to clipboard!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                    <div className="text-center">
                      <div className="inline-block p-4 bg-white dark:bg-zinc-800 rounded-lg border-2 border-zinc-300 dark:border-zinc-700">
                        <div className="text-6xl">📱</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">QR Code</div>
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
                        Scan to view expenses
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-between items-center">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {expenses.length} expenses • Last sync: just now
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
              Close
            </Button>
            {activeTab === 'export' && (
              <Button onClick={handleExport} disabled={isProcessing}>
                {isProcessing ? '☁️ Exporting...' : '📤 Export Now'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
