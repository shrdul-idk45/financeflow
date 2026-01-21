import React, { useState } from 'react';
import { useApp, CATEGORIES } from '@/app/context/AppContext';
import { Header } from '@/app/components/layout/Header';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Calendar,
  Download
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { AddExpenseModal } from '@/app/components/expenses/AddExpenseModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { toast } from 'sonner';
import { EmptyState } from '@/app/components/common/EmptyState';
import { formatCurrency } from '@/app/utils/currency';

export const ExpenseList = () => {
  const { expenses, deleteExpense } = useApp();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesType = filterType === 'all' || expense.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    setDeleteExpenseId(null);
    toast.success('Transaction deleted');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = sortedExpenses.map(exp => [
      exp.date,
      exp.type,
      CATEGORIES.find(c => c.id === exp.category)?.name || exp.category,
      exp.description,
      exp.amount.toString(),
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  const totalAmount = sortedExpenses
    .filter(exp => exp.type === 'expense')
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header activeScreen="expenses" />
      
      <main className="container mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your financial transactions
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="h-12"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setShowAddExpense(true)}
              variant="primary"
              className="h-12 px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-card border-border shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-input-background"
              />
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-12 bg-input-background">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-12 bg-input-background">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold text-foreground">
                {sortedExpenses.length}
              </p>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-card border-border shadow-md overflow-hidden">
          {sortedExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedExpenses.map((expense) => {
                    const category = CATEGORIES.find(c => c.id === expense.category);
                    return (
                      <TableRow key={expense.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {new Date(expense.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              expense.type === 'income'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}
                          >
                            {expense.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category?.icon}</span>
                            <span>{category?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {expense.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-semibold ${
                              expense.type === 'income'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-foreground'
                            }`}
                          >
                            {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(expense)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteExpenseId(expense.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={Filter}
              title="No transactions found"
              description={
                searchQuery || filterCategory !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first transaction'
              }
              action={{
                label: "Add Transaction",
                onClick: () => setShowAddExpense(true)
              }}
            />
          )}
        </Card>
      </main>

      {/* Modals */}
      {showAddExpense && (
        <AddExpenseModal
          isOpen={showAddExpense}
          onClose={() => setShowAddExpense(false)}
        />
      )}

      {editingExpense && (
        <AddExpenseModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          expense={editingExpense}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteExpenseId} onOpenChange={() => setDeleteExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteExpenseId && handleDelete(deleteExpenseId)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};