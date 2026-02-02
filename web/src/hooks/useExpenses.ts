'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExpenses(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse expenses:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever expenses change (only after loaded)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoaded,
  };
}
