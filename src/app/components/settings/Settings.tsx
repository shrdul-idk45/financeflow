import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Header } from '@/app/components/layout/Header';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  User,
  Mail,
  IndianRupee,
  Moon,
  Sun,
  Download,
  LogOut,
  Save,
  Trash2,
} from 'lucide-react';
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
import { CURRENCY_SYMBOL, CURRENCY_CODE } from '@/app/utils/currency';

export const Settings = () => {
  const { user, theme, updateUser, toggleTheme, logout, expenses } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget?.toString() || '');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);

  const handleSaveProfile = () => {
    const budgetNum = parseFloat(monthlyBudget);
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (isNaN(budgetNum) || budgetNum < 0) {
      toast.error('Please enter a valid budget');
      return;
    }

    updateUser({
      name: name.trim(),
      monthlyBudget: budgetNum,
    });
    toast.success('Profile updated successfully');
  };

  const handleExportData = () => {
    const data = {
      user,
      expenses,
      exportDate: new Date().toISOString(),
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeflow_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeScreen="settings" />
      
      <main className="container mx-auto px-4 md:px-8 py-8 space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <Card className="p-8 border-border/50 shadow-md">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="w-24 h-24 border-4 border-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h3>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email}
                  disabled
                  className="h-12 bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Monthly Budget ({CURRENCY_CODE})</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {CURRENCY_SYMBOL}
                  </span>
                  <Input
                    id="budget"
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    className="h-12 pl-10 bg-input-background"
                    step="0.01"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                variant="primary"
                className="w-full md:w-auto h-12"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-8 border-border/50 shadow-md">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            Appearance
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-8 border-border/50 shadow-md">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
            <Download className="w-5 h-5" />
            Data Management
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium text-foreground">Export Data</p>
                <p className="text-sm text-muted-foreground">
                  Download all your data as JSON
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div>
                <p className="font-medium text-foreground">Clear All Data</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all your data
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowClearDataDialog(true)}
                className="border-red-500/50 text-red-600 hover:bg-red-500/10 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="p-8 border-border/50 shadow-md">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
            <LogOut className="w-5 h-5" />
            Account
          </h3>

          <Button
            onClick={() => setShowLogoutDialog(true)}
            variant="outline"
            className="w-full h-12 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </Card>

        {/* App Info */}
        <Card className="p-6 border-border/50 shadow-md bg-muted/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">FinanceFlow v1.0.0</p>
            <p className="text-xs text-muted-foreground">
              © 2026 FinanceFlow. All rights reserved.
            </p>
          </div>
        </Card>
      </main>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? Your data is saved locally and will be available when you sign back in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={logout}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Data Confirmation */}
      <AlertDialog open={showClearDataDialog} onOpenChange={setShowClearDataDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your data including transactions, budget, and settings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};