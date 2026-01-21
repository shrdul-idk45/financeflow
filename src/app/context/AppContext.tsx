import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  monthlyBudget: number;
  selectedCategories: string[];
  onboardingComplete: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#95E1D3' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FFE66D' },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#A8E6CF' },
  { id: 'health', name: 'Health', icon: '⚕️', color: '#FF8B94' },
  { id: 'education', name: 'Education', icon: '📚', color: '#B4A7D6' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#FFD3B6' },
  { id: 'savings', name: 'Savings', icon: '💰', color: '#A8DADC' },
  { id: 'other', name: 'Other', icon: '📦', color: '#C7CEEA' },
];

interface AppContextType {
  user: User | null;
  expenses: Expense[];
  theme: 'light' | 'dark';
  currentScreen: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  toggleTheme: () => void;
  setCurrentScreen: (screen: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Generate sample expenses for demo
  const generateSampleExpenses = (): Expense[] => {
    const sampleExpenses: Expense[] = [];
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
          id: `sample-${i}-${Date.now()}`,
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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('financeApp_user');
    const savedExpenses = localStorage.getItem('financeApp_expenses');
    const savedTheme = localStorage.getItem('financeApp_theme');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.onboardingComplete) {
        setCurrentScreen('dashboard');
      } else {
        setCurrentScreen('onboarding-welcome');
      }
    }

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }

    if (savedTheme) {
      const parsedTheme = savedTheme as 'light' | 'dark';
      setTheme(parsedTheme);
      document.documentElement.classList.toggle('dark', parsedTheme === 'dark');
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('financeApp_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('financeApp_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('financeApp_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if this is the demo account
    const isDemoAccount = email === 'demo@financeflow.com';
    
    // Mock login - in real app, this would validate credentials
    const mockUser: User = {
      id: isDemoAccount ? 'demo-1' : '1',
      name: isDemoAccount ? 'Demo User' : email.split('@')[0],
      email,
      monthlyBudget: isDemoAccount ? 5000 : 0,
      selectedCategories: isDemoAccount ? CATEGORIES.map(c => c.id) : [],
      onboardingComplete: isDemoAccount,
    };
    
    setUser(mockUser);
    
    // For demo account, add sample data if not already present
    if (isDemoAccount) {
      const existingExpenses = localStorage.getItem('financeApp_expenses');
      if (!existingExpenses || JSON.parse(existingExpenses).length === 0) {
        const sampleExpenses = generateSampleExpenses();
        localStorage.setItem('financeApp_expenses', JSON.stringify(sampleExpenses));
        setExpenses(sampleExpenses);
      }
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('onboarding-welcome');
    }
    
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      monthlyBudget: 0,
      selectedCategories: [],
      onboardingComplete: false,
    };
    
    setUser(newUser);
    setCurrentScreen('onboarding-welcome');
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setExpenses([]);
    setCurrentScreen('login');
    localStorage.removeItem('financeApp_user');
    localStorage.removeItem('financeApp_expenses');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        expenses,
        theme,
        currentScreen,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        addExpense,
        updateExpense,
        deleteExpense,
        toggleTheme,
        setCurrentScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};