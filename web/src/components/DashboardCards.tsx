'use client';

import { useMemo, useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { Card } from './ui/Card';
import { formatCurrency, formatMonth } from '@/utils/formatCurrency';

interface DashboardCardsProps {
  expenses: Expense[];
}

export function DashboardCards({ expenses }: DashboardCardsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const currentMonthLabel = isMounted ? formatMonth(new Date()) : '';

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return (
        expDate.getMonth() === currentMonth &&
        expDate.getFullYear() === currentYear
      );
    });

    const thisMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryTotals = expenses.reduce(
      (acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const topCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    )[0];

    return {
      total,
      thisMonth,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    };
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Total Expenses
          </p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(stats.total)}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            All time
          </p>
        </div>
      </Card>

      <Card>
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            This Month
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(stats.thisMonth)}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {currentMonthLabel}
          </p>
        </div>
      </Card>

      <Card>
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Top Category
          </p>
          {stats.topCategory ? (
            <>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(stats.topCategory.amount)}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                {stats.topCategory.name}
              </p>
            </>
          ) : (
            <p className="text-lg text-zinc-400 dark:text-zinc-600">No data</p>
          )}
        </div>
      </Card>
    </div>
  );
}
