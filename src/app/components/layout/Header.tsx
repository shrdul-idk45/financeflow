import React from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Settings, 
  Wallet,
  Moon,
  Sun
} from 'lucide-react';

interface HeaderProps {
  activeScreen: string;
}

export const Header = ({ activeScreen }: HeaderProps) => {
  const { user, theme, toggleTheme, setCurrentScreen } = useApp();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:inline">
            FinanceFlow
          </span>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          {/* User Profile */}
          <button
            onClick={() => setCurrentScreen('settings')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Avatar className="w-10 h-10 border-2 border-border">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-around border-t border-border/50 px-4 py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
