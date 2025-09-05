import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BarChart3, 
  Brain, 
  Settings, 
  Target,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusTracker } from './FocusTracker';
import { Analytics } from './Analytics';
import { NudgeSystem } from './NudgeSystem';

type ViewType = 'dashboard' | 'analytics' | 'nudges' | 'settings';

interface NavigationItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const AppShell = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSessionActive, setIsSessionActive] = useState(false);

  const navigation: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'nudges', label: 'Smart Nudges', icon: Brain, badge: '2' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'analytics':
        return <Analytics />;
      case 'nudges':
        return (
          <div className="min-h-screen bg-gradient-focus p-6">
            <div className="max-w-4xl mx-auto">
              <NudgeSystem 
                isInFocusMode={isSessionActive}
                currentApp="VS Code"
                switchCount={5}
                sessionDuration={1200}
              />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-focus p-6">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 glass-effect border-card-border">
                <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-6">
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  Settings panel coming soon. Configure your focus preferences, app categories, and notification settings.
                </p>
              </Card>
            </div>
          </div>
        );
      default:
        return <FocusTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-focus">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-card/90 backdrop-blur-md border-r border-card-border z-50 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-card-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-2 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className={cn(
                  "relative h-12 w-12 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary/20 text-primary shadow-medium" 
                    : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                )}
                onClick={() => setCurrentView(item.id)}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Quick Session Controls */}
        <div className="p-2 border-t border-card-border">
          <Button
            variant={isSessionActive ? "warning" : "success"}
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setIsSessionActive(!isSessionActive)}
            title={isSessionActive ? "Pause Session" : "Start Session"}
          >
            {isSessionActive ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16">
        {renderCurrentView()}
      </div>

      {/* System Tray Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="p-3 glass-effect border-card-border shadow-strong">
          <div className="flex items-center gap-2 text-sm">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isSessionActive ? "bg-success animate-pulse" : "bg-muted"
            )}></div>
            <span className="text-muted-foreground text-xs">
              {isSessionActive ? 'Tracking active' : 'Ready to track'}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};