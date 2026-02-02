'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Expense } from '@/types/expense';
import { DashboardCards } from '@/components/DashboardCards';
import { CategoryChart } from '@/components/CategoryChart';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExportModal } from '@/components/ExportModal';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function Home() {
  const { expenses, addExpense, updateExpense, deleteExpense, isLoaded } = useExpenses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleSubmit = (expenseData: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      showToast('Expense updated successfully');
    } else {
      addExpense(expenseData);
      showToast('Expense added successfully');
    }
    setIsFormOpen(false);
    setEditingExpense(undefined);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    showToast('Expense deleted successfully');
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingExpense(undefined);
  };

  const openAddForm = () => {
    setIsFormOpen(true);
  };

  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Expense Tracker
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Expense Tracker
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1">
              Track and manage your expenses
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={openExportModal}
              className="flex-1 sm:flex-none"
              disabled={expenses.length === 0}
            >
              Export Data
            </Button>
            <Button
              onClick={openAddForm}
              className="flex-1 sm:flex-none"
            >
              Add Expense
            </Button>
          </div>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <ExpenseForm
                expense={editingExpense}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {isExportModalOpen && (
          <ExportModal
            expenses={expenses}
            onClose={() => setIsExportModalOpen(false)}
          />
        )}

        <div className="space-y-6">
          <DashboardCards expenses={expenses} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart expenses={expenses} />
            <div className="lg:col-span-2">
              <ExpenseList
                expenses={expenses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddExpense={openAddForm}
              />
            </div>
          </div>
        </div>

        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </div>
    </div>
  );
}
