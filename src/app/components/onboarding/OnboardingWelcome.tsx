import React from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Wallet, TrendingUp, PieChart, Target } from 'lucide-react';

export const OnboardingWelcome = () => {
  const { user, setCurrentScreen } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl p-12 space-y-8 shadow-2xl border-border/50">
        {/* Hero */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Wallet className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Welcome, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Let's set up your financial journey in just a few steps
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-muted/30">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Track Expenses</h3>
            <p className="text-sm text-muted-foreground">Monitor your spending in real-time</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-muted/30">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Visualize Data</h3>
            <p className="text-sm text-muted-foreground">Beautiful charts and insights</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-muted/30">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Set Goals</h3>
            <p className="text-sm text-muted-foreground">Achieve your financial targets</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <Button
            onClick={() => setCurrentScreen('onboarding-budget')}
            variant="primary"
            className="w-full h-14 text-lg"
          >
            Get Started
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Takes less than 2 minutes to complete
          </p>
        </div>
      </Card>
    </div>
  );
};