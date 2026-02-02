'use client';

import { useState, useMemo } from 'react';
import { Expense } from '@/types/expense';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency } from '@/utils/formatCurrency';

type ExportFormat = 'csv' | 'json' | 'pdf';

interface ExportModalProps {
  expenses: Expense[];
  onClose: () => void;
}

export function ExportModal({ expenses, onClose }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filename, setFilename] = useState('expenses_export');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(expenses.map((e) => e.category)));
    return ['all', ...cats];
  }, [expenses]);

  // Filter expenses based on date range and category
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      const matchesStartDate = !startDate || expenseDate >= new Date(startDate);
      const matchesEndDate = !endDate || expenseDate <= new Date(endDate);
      return matchesCategory && matchesStartDate && matchesEndDate;
    });
  }, [expenses, startDate, endDate, selectedCategory]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate processing time for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (format === 'csv') {
        exportAsCsv(filteredExpenses, filename);
      } else if (format === 'json') {
        exportAsJson(filteredExpenses, filename);
      } else if (format === 'pdf') {
        exportAsPdf(filteredExpenses, filename);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Export Expenses
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Configure your export options
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['csv', 'json', 'pdf'] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    format === fmt
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="font-semibold uppercase">{fmt}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {fmt === 'csv' && 'Spreadsheet'}
                    {fmt === 'json' && 'Data Format'}
                    {fmt === 'pdf' && 'Document'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Category Filter
            </label>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </Select>
          </div>

          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Filename
            </label>
            <Input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
            />
          </div>

          {/* Export Summary */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Export Summary
              </span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex justify-between">
                <span>Records to export:</span>
                <span className="font-semibold">{filteredExpenses.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total amount:</span>
                <span className="font-semibold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-semibold uppercase">{format}</span>
              </div>
            </div>
          </div>

          {/* Preview Table */}
          {showPreview && filteredExpenses.length > 0 && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Preview (showing first 5 records)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-100 dark:bg-zinc-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-zinc-700 dark:text-zinc-300">Date</th>
                      <th className="px-4 py-2 text-left text-zinc-700 dark:text-zinc-300">Category</th>
                      <th className="px-4 py-2 text-left text-zinc-700 dark:text-zinc-300">Description</th>
                      <th className="px-4 py-2 text-right text-zinc-700 dark:text-zinc-300">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.slice(0, 5).map((expense) => (
                      <tr key={expense.id} className="border-t border-zinc-200 dark:border-zinc-700">
                        <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">{expense.date}</td>
                        <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">{expense.category}</td>
                        <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">{expense.description}</td>
                        <td className="px-4 py-2 text-right text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(expense.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredExpenses.length > 5 && (
                <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-xs text-zinc-600 dark:text-zinc-400 text-center">
                  ... and {filteredExpenses.length - 5} more records
                </div>
              )}
            </div>
          )}

          {/* No Data Warning */}
          {filteredExpenses.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                No expenses match your current filters. Please adjust your filters to export data.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={filteredExpenses.length === 0 || isExporting}
          >
            {isExporting ? 'Exporting...' : `Export ${filteredExpenses.length} Records`}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export utility functions
function exportAsCsv(expenses: Expense[], filename: string) {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((expense) => [
    expense.date,
    expense.category,
    `"${expense.description.replace(/"/g, '""')}"`,
    expense.amount.toFixed(2),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${filename}.csv`);
}

function exportAsJson(expenses: Expense[], filename: string) {
  const jsonContent = JSON.stringify(expenses, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadFile(blob, `${filename}.json`);
}

function exportAsPdf(expenses: Expense[], filename: string) {
  // Simple PDF export using HTML canvas approach
  // For a real implementation, you'd use a library like jsPDF
  const content = `
EXPENSE REPORT
Generated: ${new Date().toLocaleDateString('de-CH')}

${expenses
  .map(
    (expense, i) =>
      `${i + 1}. ${expense.date} | ${expense.category} | ${expense.description} | CHF ${expense.amount.toFixed(2)}`
  )
  .join('\n')}

Total: CHF ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
  `.trim();

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  downloadFile(blob, `${filename}.txt`); // Using .txt for simplicity
}

function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
