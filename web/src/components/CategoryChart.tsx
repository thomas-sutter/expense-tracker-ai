'use client';

import { useMemo } from 'react';
import { Expense, CATEGORIES } from '@/types/expense';
import { Card } from './ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';

interface CategoryChartProps {
  expenses: Expense[];
}

export function CategoryChart({ expenses }: CategoryChartProps) {
  const categoryData = useMemo(() => {
    const totals = expenses.reduce(
      (acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const maxAmount = Math.max(...Object.values(totals), 0);

    return CATEGORIES.map((category) => ({
      category,
      amount: totals[category] || 0,
      percentage: maxAmount > 0 ? (totals[category] || 0) / maxAmount : 0,
    }));
  }, [expenses]);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-pink-500',
  ];

  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Spending by Category
        </h2>

        {expenses.length === 0 ? (
          <p className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            No data to display
          </p>
        ) : (
          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {item.category}
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                    style={{ width: `${item.percentage * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
