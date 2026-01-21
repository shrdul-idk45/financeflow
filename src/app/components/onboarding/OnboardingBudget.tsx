import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Wallet, IndianRupee } from 'lucide-react';
import { CURRENCY_SYMBOL, CURRENCY_CODE, formatCurrency } from '@/app/utils/currency';

export const OnboardingBudget = () => {
  const { user, updateUser, setCurrentScreen } = useApp();
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const budgetNum = parseFloat(budget);
    if (!budget || isNaN(budgetNum) || budgetNum <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    updateUser({ monthlyBudget: budgetNum });
    setCurrentScreen('onboarding-categories');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-lg p-12 space-y-8 shadow-2xl border-border/50">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step 1 of 2</span>
            <span>50%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-primary rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <IndianRupee className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Set Your Monthly Budget
            </h1>
            <p className="text-muted-foreground">
              This helps us track your spending and send alerts when you're close to your limit
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-base">Monthly Budget ({CURRENCY_CODE})</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                {CURRENCY_SYMBOL}
              </span>
              <Input
                id="budget"
                type="number"
                placeholder="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="h-16 pl-10 text-2xl bg-input-background border-border/50"
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You can change this anytime in settings
            </p>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Suggestions */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick suggestions:</p>
            <div className="grid grid-cols-3 gap-3">
              {[20000, 35000, 50000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setBudget(amount.toString())}
                  className="p-3 border border-border/50 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentScreen('onboarding-welcome')}
              className="flex-1 h-12"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 h-12"
            >
              Continue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};