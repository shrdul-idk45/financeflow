import React, { useState } from 'react';
import { useApp, CATEGORIES } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Check } from 'lucide-react';

export const OnboardingCategories = () => {
  const { user, updateUser, setCurrentScreen, expenses } = useApp();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const generateSampleExpenses = (): any[] => {
    const sampleExpenses: any[] = [];
    const today = new Date();
    
    // Generate expenses for the last 3 months
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random chance to add an expense on this day
      if (Math.random() > 0.5) {
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const isIncome = Math.random() > 0.85;
        const amount = isIncome 
          ? Math.floor(Math.random() * 3000) + 1000
          : Math.floor(Math.random() * 200) + 10;
        
        const descriptions = {
          food: ['Grocery shopping', 'Restaurant dinner', 'Coffee', 'Lunch', 'Food delivery'],
          transport: ['Gas', 'Uber ride', 'Public transport', 'Parking', 'Car maintenance'],
          shopping: ['Clothing', 'Electronics', 'Home decor', 'Online shopping', 'Gifts'],
          entertainment: ['Movie tickets', 'Concert', 'Streaming service', 'Gaming', 'Books'],
          bills: ['Internet bill', 'Phone bill', 'Electricity', 'Water bill', 'Rent'],
          health: ['Gym membership', 'Pharmacy', 'Doctor visit', 'Health insurance', 'Supplements'],
          education: ['Online course', 'Books', 'Tuition', 'Certification', 'Workshop'],
          travel: ['Flight tickets', 'Hotel', 'Vacation', 'Travel insurance', 'Tour package'],
          savings: ['Emergency fund', 'Investment', 'Retirement', 'Fixed deposit', 'Mutual fund'],
          other: ['Miscellaneous', 'Donation', 'Gift', 'Subscription', 'Other expense'],
        };
        
        const incomeDescriptions = ['Salary', 'Freelance work', 'Bonus', 'Investment return', 'Side project'];
        
        sampleExpenses.push({
          id: `sample-${i}-${Date.now()}-${Math.random()}`,
          amount,
          category: category.id,
          description: isIncome 
            ? incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)]
            : descriptions[category.id as keyof typeof descriptions][Math.floor(Math.random() * 5)],
          date: date.toISOString().split('T')[0],
          type: isIncome ? 'income' : 'expense',
        });
      }
    }
    
    return sampleExpenses;
  };

  const handleComplete = () => {
    const categoriesToSave = selectedCategories.length > 0 ? selectedCategories : CATEGORIES.map(c => c.id);
    updateUser({
      selectedCategories: categoriesToSave,
      onboardingComplete: true,
    });
    
    // Add sample expenses if no expenses exist
    if (expenses.length === 0) {
      const sampleExpenses = generateSampleExpenses();
      localStorage.setItem('financeApp_expenses', JSON.stringify(sampleExpenses));
      // Reload to load the sample data
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-3xl p-12 space-y-8 shadow-2xl border-border/50">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step 2 of 2</span>
            <span>100%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-full bg-primary rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Choose Your Categories
          </h1>
          <p className="text-muted-foreground">
            Select the categories you want to track. You can always add or remove them later.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-3xl">{category.icon}</span>
                  <span className="text-sm font-medium text-foreground text-center leading-tight">
                    {category.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentScreen('onboarding-budget')}
              className="flex-1 h-12"
            >
              Back
            </Button>
            <Button
              onClick={handleComplete}
              variant="primary"
              className="flex-1 h-12"
            >
              Complete Setup
            </Button>
          </div>
          {selectedCategories.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              Skip to select all categories by default
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};