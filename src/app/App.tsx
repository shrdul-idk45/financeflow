import React from 'react';
import { AppProvider, useApp } from '@/app/context/AppContext';
import { Toaster } from '@/app/components/ui/sonner';

// Auth Components
import { Login } from '@/app/components/auth/Login';
import { Signup } from '@/app/components/auth/Signup';
import { ForgotPassword } from '@/app/components/auth/ForgotPassword';

// Onboarding Components
import { OnboardingWelcome } from '@/app/components/onboarding/OnboardingWelcome';
import { OnboardingBudget } from '@/app/components/onboarding/OnboardingBudget';
import { OnboardingCategories } from '@/app/components/onboarding/OnboardingCategories';

// Main App Components
import { Dashboard } from '@/app/components/dashboard/Dashboard';
import { ExpenseList } from '@/app/components/expenses/ExpenseList';
import { Analytics } from '@/app/components/analytics/Analytics';
import { Settings } from '@/app/components/settings/Settings';

const AppContent = () => {
  const { currentScreen } = useApp();

  // Render appropriate screen based on currentScreen state
  switch (currentScreen) {
    // Auth Screens
    case 'login':
      return <Login />;
    case 'signup':
      return <Signup />;
    case 'forgot-password':
      return <ForgotPassword />;

    // Onboarding Screens
    case 'onboarding-welcome':
      return <OnboardingWelcome />;
    case 'onboarding-budget':
      return <OnboardingBudget />;
    case 'onboarding-categories':
      return <OnboardingCategories />;

    // Main App Screens
    case 'dashboard':
      return <Dashboard />;
    case 'expenses':
      return <ExpenseList />;
    case 'analytics':
      return <Analytics />;
    case 'settings':
      return <Settings />;

    default:
      return <Login />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-center" richColors />
    </AppProvider>
  );
}
