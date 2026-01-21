import React, { useState } from 'react';
import { useApp, CATEGORIES } from '@/app/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { CURRENCY_SYMBOL } from '@/app/utils/currency';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    type: 'expense' | 'income';
  };
}

export const AddExpenseModal = ({ isOpen, onClose, expense }: AddExpenseModalProps) => {
  const { addExpense, updateExpense } = useApp();
  const [type, setType] = useState<'expense' | 'income'>(expense?.type || 'expense');
  const [amount, setAmount] = useState(expense?.amount.toString() || '');
  const [category, setCategory] = useState(expense?.category || '');
  const [description, setDescription] = useState(expense?.description || '');
  const [date, setDate] = useState(
    expense?.date || new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (expense) {
      updateExpense(expense.id, {
        type,
        amount: amountNum,
        category,
        description: description.trim(),
        date,
      });
      toast.success('Transaction updated successfully');
    } else {
      addExpense({
        type,
        amount: amountNum,
        category,
        description: description.trim(),
        date,
      });
      toast.success('Transaction added successfully');
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {expense ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Type Toggle */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'expense'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <span className="font-medium text-foreground">Expense</span>
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'income'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <span className="font-medium text-foreground">Income</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (INR)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                {CURRENCY_SYMBOL}
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 pl-10 text-lg bg-input-background"
                step="0.01"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label>Category</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-medium text-foreground text-center leading-tight">
                        {cat.name.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What was this transaction for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-input-background"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 bg-input-background"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {expense ? 'Update' : 'Add'} Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};