import React from 'react';
import { useApp, CATEGORIES } from '@/app/context/AppContext';
import { Header } from '@/app/components/layout/Header';
import { Card } from '@/app/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Target,
  Award,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { EmptyState } from '@/app/components/common/EmptyState';
import { formatCurrency } from '@/app/utils/currency';

export const Analytics = () => {
  const { user, expenses } = useApp();

  // Get current and previous month data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && 
           expDate.getFullYear() === currentYear &&
           exp.type === 'expense';
  });

  const previousMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === previousMonth && 
           expDate.getFullYear() === previousYear &&
           exp.type === 'expense';
  });

  const currentTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const previousTotal = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const percentChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

  // Category-wise spending
  const categoryData = CATEGORIES.map((cat) => {
    const categoryExpenses = currentMonthExpenses.filter(exp => exp.category === cat.id);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: cat.name,
      amount: total,
      color: cat.color,
      icon: cat.icon,
    };
  }).filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Month-over-month comparison (last 6 months)
  const monthlyComparison = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentYear, currentMonth - (5 - i), 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === month && 
             expDate.getFullYear() === year &&
             exp.type === 'expense';
    });
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    };
  });

  // Generate insights
  const insights = [];
  
  // Budget insight
  if (user?.monthlyBudget) {
    const budgetUsed = (currentTotal / user.monthlyBudget) * 100;
    if (budgetUsed > 100) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Over Budget',
        description: `You've exceeded your budget by ${formatCurrency(currentTotal - user.monthlyBudget)} this month.`,
      });
    } else if (budgetUsed > 80) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Approaching Budget Limit',
        description: `You've used ${budgetUsed.toFixed(0)}% of your monthly budget.`,
      });
    } else {
      insights.push({
        type: 'success',
        icon: Award,
        title: 'On Track',
        description: `You're doing great! Only ${budgetUsed.toFixed(0)}% of your budget used.`,
      });
    }
  }

  // Spending trend insight
  if (percentChange > 20) {
    insights.push({
      type: 'warning',
      icon: TrendingUp,
      title: 'Increased Spending',
      description: `Your spending increased by ${percentChange.toFixed(1)}% compared to last month.`,
    });
  } else if (percentChange < -20) {
    insights.push({
      type: 'success',
      icon: TrendingDown,
      title: 'Great Savings',
      description: `Your spending decreased by ${Math.abs(percentChange).toFixed(1)}% compared to last month!`,
    });
  }

  // Top category insight
  if (categoryData.length > 0) {
    const topCategory = categoryData[0];
    const percentage = user?.monthlyBudget ? (topCategory.amount / user.monthlyBudget) * 100 : 0;
    if (percentage > 30) {
      insights.push({
        type: 'info',
        icon: Target,
        title: `High ${topCategory.name} Spending`,
        description: `${topCategory.icon} ${topCategory.name} accounts for ${((topCategory.amount / currentTotal) * 100).toFixed(0)}% of your total spending.`,
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeScreen="analytics" />
      
      <main className="container mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Deep insights into your spending patterns and trends
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">This Month</p>
                <h2 className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(currentTotal)}
                </h2>
              </div>
            </div>
            <div className={`flex items-center text-sm ${
              percentChange > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {percentChange > 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(percentChange).toFixed(1)}% vs last month</span>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">Last Month</p>
                <h2 className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(previousTotal)}
                </h2>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {previousMonthExpenses.length} transactions
            </div>
          </Card>

          <Card className="p-6 bg-card border-border shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">Average Transaction</p>
                <h2 className="text-3xl font-bold text-foreground mt-1">
                  {currentMonthExpenses.length > 0 
                    ? formatCurrency(currentTotal / currentMonthExpenses.length)
                    : formatCurrency(0)}
                </h2>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              From {currentMonthExpenses.length} transactions
            </div>
          </Card>
        </div>

        {/* Insights Cards */}
        {insights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card
                  key={index}
                  className={`p-6 border-2 ${
                    insight.type === 'warning'
                      ? 'border-yellow-500/20 bg-yellow-500/5'
                      : insight.type === 'success'
                      ? 'border-green-500/20 bg-green-500/5'
                      : 'border-blue-500/20 bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        insight.type === 'warning'
                          ? 'bg-yellow-500/10'
                          : insight.type === 'success'
                          ? 'bg-green-500/10'
                          : 'bg-blue-500/10'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          insight.type === 'warning'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : insight.type === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="p-6 bg-card border-border shadow-md">
            <h3 className="text-xl font-semibold text-foreground mb-6">Category Breakdown</h3>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        strokeWidth={3}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {categoryData.map((item) => {
                    const percentage = (item.amount / currentTotal) * 100;
                    return (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.icon} {item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold">
                              {formatCurrency(item.amount)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: item.color 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No data available"
                description="Add some expenses to see category breakdown"
                variant="minimal"
              />
            )}
          </Card>

          {/* Monthly Trend */}
          <Card className="p-6 bg-card border-border shadow-md">
            <h3 className="text-xl font-semibold text-foreground mb-6">6-Month Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="month"
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
                  <Bar
                    dataKey="amount"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Top Expenses */}
        <Card className="p-6 bg-card border-border shadow-md">
          <h3 className="text-xl font-semibold text-foreground mb-6">Top Expenses This Month</h3>
          {currentMonthExpenses.length > 0 ? (
            <div className="space-y-4">
              {[...currentMonthExpenses]
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)
                .map((expense) => {
                  const category = CATEGORIES.find(c => c.id === expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${category?.color}20` }}
                        >
                          {category?.icon}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })} • {category?.name}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No expenses this month"
              description="Start adding expenses to see your top spending"
              variant="minimal"
            />
          )}
        </Card>
      </main>
    </div>
  );
};