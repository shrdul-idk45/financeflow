import React, { useState } from 'react';
import { useApp, CATEGORIES } from '@/app/context/AppContext';
import { Header } from '@/app/components/layout/Header';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Receipt
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AddExpenseModal } from '@/app/components/expenses/AddExpenseModal';
import { EmptyState } from '@/app/components/common/EmptyState';
import { formatCurrency } from '@/app/utils/currency';

export const Dashboard = () => {
  const { user, expenses, setCurrentScreen } = useApp();
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Calculate statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && 
           expDate.getFullYear() === currentYear &&
           exp.type === 'expense';
  });

  const monthlyIncome = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && 
           expDate.getFullYear() === currentYear &&
           exp.type === 'income';
  });

  const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = monthlyIncome.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpenses;
  const budgetUsed = user?.monthlyBudget ? (totalExpenses / user.monthlyBudget) * 100 : 0;

  // Category breakdown
  const categoryData = CATEGORIES.map((cat) => {
    const categoryExpenses = monthlyExpenses.filter(exp => exp.category === cat.id);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: cat.name,
      value: total,
      color: cat.color,
    };
  }).filter(item => item.value > 0);

  // Spending trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const trendData = last7Days.map((date) => {
    const dayExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate.toDateString() === date.toDateString() && exp.type === 'expense';
    });
    const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      amount: total,
    };
  });

  // Recent transactions
  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header activeScreen="dashboard" />
      
      <main className="container mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Button
            onClick={() => setShowAddExpense(true)}
            variant="primary"
            className="h-12 px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Balance Card */}
          <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl border-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Balance</p>
                <h2 className="text-3xl font-bold mt-1">
                  {formatCurrency(balance)}
                </h2>
              </div>
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-primary-foreground/90 text-sm">
              {balance >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Healthy balance</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>Over budget</span>
                </>
              )}
            </div>
          </Card>

          {/* Income Card */}
          <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">Income</p>
                <h2 className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(totalIncome)}
                </h2>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
              <span>This month</span>
            </div>
          </Card>

          {/* Expenses Card */}
          <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">Expenses</p>
                <h2 className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(totalExpenses)}
                </h2>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget: {formatCurrency(user?.monthlyBudget || 0)}</span>
                <span className="font-medium text-foreground">{budgetUsed.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetUsed > 100 ? 'bg-red-500' : budgetUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="p-6 bg-card border-border shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Category Breakdown</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentScreen('analytics')}
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
            {categoryData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        strokeWidth={3}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                  {categoryData.slice(0, 5).map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Receipt}
                title="No expenses recorded yet"
                description="Add your first expense to see category breakdown"
                action={{
                  label: "Add Expense",
                  onClick: () => setShowAddExpense(true)
                }}
                variant="minimal"
              />
            )}
          </Card>

          {/* Spending Trend */}
          <Card className="p-6 bg-card border-border shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Spending Trend</h3>
              <span className="text-sm text-muted-foreground">Last 7 days</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                    strokeWidth={1.5}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                    strokeWidth={1.5}
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6 bg-card border-border shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
            <Button
              variant="ghost"
              onClick={() => setCurrentScreen('expenses')}
              className="text-primary hover:text-primary/80"
            >
              View All
            </Button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => {
                const category = CATEGORIES.find(c => c.id === transaction.category);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
                        {category?.icon}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Start tracking your finances by adding your first transaction"
              action={{
                label: "Add Transaction",
                onClick: () => setShowAddExpense(true)
              }}
              variant="minimal"
            />
          )}
        </Card>
      </main>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          isOpen={showAddExpense}
          onClose={() => setShowAddExpense(false)}
        />
      )}
    </div>
  );
};