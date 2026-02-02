'use client';

import { useState, useMemo } from 'react';
import { Expense, Category, CATEGORIES } from '@/types/expense';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

const MAX_DESCRIPTION_LENGTH = 120;

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: expense?.date || new Date().toISOString().split('T')[0],
    amount: expense?.amount.toString() || '',
    category: expense?.category || ('Food' as Category),
    description: expense?.description || '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }

    return newErrors;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    onSubmit({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
    });
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        onBlur={() => handleBlur('date')}
        error={touched.date ? errors.date : undefined}
        required
      />

      <Input
        label="Amount (CHF)"
        type="number"
        step="0.01"
        min="0.01"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        onBlur={() => handleBlur('amount')}
        error={touched.amount ? errors.amount : undefined}
        placeholder="0.00"
        required
      />

      <Select
        label="Category"
        value={formData.category}
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value as Category })
        }
        options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
        error={errors.category}
        required
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Description
          </label>
          <span className={`text-xs ${formData.description.length > MAX_DESCRIPTION_LENGTH ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-500'}`}>
            {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          onBlur={() => handleBlur('description')}
          maxLength={MAX_DESCRIPTION_LENGTH + 10}
          className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
          placeholder="Enter expense description..."
          required
        />
        {touched.description && errors.description && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </span>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" disabled={!isValid}>
          {expense ? 'Update' : 'Add'} Expense
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
