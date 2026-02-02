export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount);
}

export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat('de-CH', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}
