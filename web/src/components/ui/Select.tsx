import { SelectHTMLAttributes, forwardRef, ReactNode, Children } from 'react';

type Option = { value: string; label: string };

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Option[]; // Now optional!
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options = [], children, className = '', ...props }, ref) => {
    // Defensive: check if children are provided
    const hasChildren = Children.count(children) > 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...props}
        >
          {hasChildren
            ? children
            : options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
        </select>
        {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
