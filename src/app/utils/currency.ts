/**
 * Currency formatting utilities for FinanceFlow
 * Supports Indian Rupee (₹) with proper thousand separators
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Format amount with Indian Rupee symbol
 * @param amount - The amount to format
 * @param showDecimals - Whether to show decimal places (default: false for whole numbers)
 */
export function formatCurrency(amount: number, showDecimals: boolean = false): string {
  const formatted = showDecimals || !Number.isInteger(amount)
    ? amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount.toLocaleString('en-IN');
  
  return `${CURRENCY_SYMBOL}${formatted}`;
}

/**
 * Format amount with sign prefix for income/expense
 */
export function formatCurrencyWithSign(amount: number, type: 'income' | 'expense'): string {
  const formatted = formatCurrency(amount);
  return type === 'income' ? `+${formatted}` : `-${formatted}`;
}

/**
 * Format compact currency (e.g., ₹1.2K, ₹5.5L)
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `${CURRENCY_SYMBOL}${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `${CURRENCY_SYMBOL}${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `${CURRENCY_SYMBOL}${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}
