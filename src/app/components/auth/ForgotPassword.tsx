import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { ArrowLeft, Wallet, Mail } from 'lucide-react';

export const ForgotPassword = () => {
  const { setCurrentScreen } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <Card className="w-full max-w-md p-8 space-y-8 shadow-2xl border-border/50 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setCurrentScreen('login')}
              variant="primary"
              className="w-full h-12"
            >
              Back to Sign In
            </Button>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-2xl border-border/50">
        {/* Header */}
        <div className="space-y-4">
          <button
            onClick={() => setCurrentScreen('login')}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Wallet className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground text-sm text-center">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>
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

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12"
          >
            Send Reset Link
          </Button>
        </form>
      </Card>
    </div>
  );
};