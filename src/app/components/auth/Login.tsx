import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Eye, EyeOff, Wallet } from 'lucide-react';

export const Login = () => {
  const { login, setCurrentScreen, isLoading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@financeflow.com');
    setPassword('demo123');
    await login('demo@financeflow.com', 'demo123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-2xl border-border/50">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">FinanceFlow</h1>
          <p className="text-muted-foreground text-sm">Welcome back! Sign in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-input-background border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-input-background border-border/50 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            className="w-full h-12"
            disabled={isLoading}
          >
            Try Demo Account
          </Button>

          <button
            type="button"
            onClick={() => setCurrentScreen('forgot-password')}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentScreen('signup')}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};