'use client';

import { useState, useMemo } from 'react';
import { Expense, CATEGORIES } from '@/types/expense';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onAddExpense: () => void;
}

export function ExpenseList({ expenses, onEdit, onDelete, onAddExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || expense.category === categoryFilter;

      const matchesDateFrom = !dateFrom || expense.date >= dateFrom;
      const matchesDateTo = !dateTo || expense.date <= dateTo;

      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [expenses, searchTerm, categoryFilter, dateFrom, dateTo]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-CH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || dateFrom || dateTo;

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <EmptyState
          title="No expenses yet"
          description="Start tracking your spending by adding your first expense. It only takes a moment!"
          icon={
            <svg
              className="w-16 h-16"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          action={{
            label: 'Add your first expense',
            onClick: onAddExpense,
          }}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Expense List
          </h2>
          {hasActiveFilters && (
            <Button size="sm" variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
            ]}
          />

          <Input
            type="date"
            placeholder="From date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <Input
            type="date"
            placeholder="To date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {filteredExpenses.length === 0 ? (
          <EmptyState
            title="No results found"
            description="Try adjusting your filters or search term to find what you're looking for."
            icon={
              <svg
                className="w-12 h-12"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            action={{
              label: 'Clear filters',
              onClick: clearFilters,
            }}
          />
        ) : (
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-3 px-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Description
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Category
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Amount
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="py-3 px-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(expense.date)}
                    </td>
                    <td className="py-3 px-2 text-sm text-zinc-900 dark:text-zinc-100">
                      {expense.description}
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-right font-medium text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onEdit(expense)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            if (
                              confirm(
                                'Are you sure you want to delete this expense?'
                              )
                            ) {
                              onDelete(expense.id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </div>
      </div>
    </Card>
  );
}
