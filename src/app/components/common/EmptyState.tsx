import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'minimal';
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  variant = 'default' 
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${
      variant === 'default' ? 'py-16' : 'py-12'
    }`}>
      <div className={`rounded-full bg-muted/50 flex items-center justify-center mb-6 ${
        variant === 'default' ? 'w-20 h-20' : 'w-16 h-16'
      }`}>
        <Icon className={`text-muted-foreground ${
          variant === 'default' ? 'w-10 h-10' : 'w-8 h-8'
        }`} />
      </div>
      <h3 className={`font-semibold text-foreground mb-2 ${
        variant === 'default' ? 'text-xl' : 'text-lg'
      }`}>
        {title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} size="lg" variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
};