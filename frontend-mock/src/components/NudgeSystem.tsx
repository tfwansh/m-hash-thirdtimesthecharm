import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  AlertTriangle, 
  Coffee, 
  Zap, 
  Eye, 
  CheckCircle, 
  X,
  Clock,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Nudge {
  id: string;
  type: 'encouragement' | 'warning' | 'break' | 'focus-boost';
  title: string;
  message: string;
  timestamp: Date;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

interface NudgeSystemProps {
  isInFocusMode?: boolean;
  currentApp?: string;
  switchCount?: number;
  sessionDuration?: number;
}

export const NudgeSystem: React.FC<NudgeSystemProps> = ({ 
  isInFocusMode = false,
  currentApp = "VS Code",
  switchCount = 5,
  sessionDuration = 1200 // 20 minutes
}) => {
  const [activeNudges, setActiveNudges] = useState<Nudge[]>([]);
  const [nudgeHistory, setNudgeHistory] = useState<Nudge[]>([]);

  // Simulated nudge logic
  useEffect(() => {
    const nudgeTimer = setInterval(() => {
      // Generate nudges based on current state
      if (isInFocusMode) {
        // Check for potential distractions
        if (switchCount > 8) {
          createNudge({
            type: 'warning',
            title: 'High Switch Rate Detected',
            message: 'You\'ve switched apps 8 times in the last 10 minutes. Consider taking a short break or refocusing.',
            priority: 'medium',
            actionRequired: true
          });
        }

        // Encourage during good focus
        if (sessionDuration > 1500 && switchCount < 3) {
          createNudge({
            type: 'encouragement',
            title: 'Great Focus!',
            message: 'You\'ve been focused for 25 minutes with minimal distractions. Keep it up!',
            priority: 'low'
          });
        }

        // Break suggestion
        if (sessionDuration > 2700) { // 45 minutes
          createNudge({
            type: 'break',
            title: 'Time for a Break',
            message: 'You\'ve been working for 45 minutes. Consider taking a 5-10 minute break.',
            priority: 'high',
            actionRequired: true
          });
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(nudgeTimer);
  }, [isInFocusMode, switchCount, sessionDuration]);

  const createNudge = (nudgeData: Omit<Nudge, 'id' | 'timestamp' | 'isActive'>) => {
    const newNudge: Nudge = {
      ...nudgeData,
      id: Date.now().toString(),
      timestamp: new Date(),
      isActive: true
    };

    setActiveNudges(prev => {
      // Prevent duplicate nudges
      const exists = prev.some(n => n.type === newNudge.type && n.title === newNudge.title);
      if (exists) return prev;
      
      return [...prev, newNudge].slice(-3); // Keep max 3 active nudges
    });
  };

  const dismissNudge = (id: string, action?: 'accepted' | 'dismissed') => {
    setActiveNudges(prev => {
      const nudge = prev.find(n => n.id === id);
      if (nudge) {
        setNudgeHistory(history => [...history, { ...nudge, isActive: false }].slice(-10));
      }
      return prev.filter(n => n.id !== id);
    });
  };

  const getPriorityColor = (priority: Nudge['priority']) => {
    switch (priority) {
      case 'high': return 'border-destructive bg-destructive/5';
      case 'medium': return 'border-warning bg-warning/5';
      default: return 'border-primary bg-primary/5';
    }
  };

  const getTypeIcon = (type: Nudge['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'break': return <Coffee className="h-5 w-5 text-destructive" />;
      case 'focus-boost': return <Zap className="h-5 w-5 text-primary" />;
      default: return <CheckCircle className="h-5 w-5 text-success" />;
    }
  };

  const getTypeColor = (type: Nudge['type']) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'break': return 'text-destructive';
      case 'focus-boost': return 'text-primary';
      default: return 'text-success';
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Nudge Header */}
      <Card className="p-6 glass-effect border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Smart Nudge System</h2>
              <p className="text-sm text-muted-foreground">
                AI-powered assistance to maintain your focus
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isInFocusMode ? "default" : "secondary"} className="gap-1">
              <Eye className="h-3 w-3" />
              {isInFocusMode ? 'Monitoring' : 'Idle'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Active Nudges */}
      {activeNudges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Active Nudges ({activeNudges.length})
          </h3>
          
          {activeNudges.map((nudge) => (
            <Alert key={nudge.id} className={cn("relative", getPriorityColor(nudge.priority))}>
              <div className="flex items-start gap-3">
                {getTypeIcon(nudge.type)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={cn("font-medium", getTypeColor(nudge.type))}>
                      {nudge.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-destructive/20"
                      onClick={() => dismissNudge(nudge.id, 'dismissed')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <AlertDescription className="text-sm">
                    {nudge.message}
                  </AlertDescription>
                  
                  {nudge.actionRequired && (
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => dismissNudge(nudge.id, 'accepted')}
                      >
                        Take Action
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => dismissNudge(nudge.id, 'dismissed')}
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Current Session Status */}
      <Card className="p-6 glass-effect border-card-border">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Session Status
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-semibold">
                {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Eye className="h-5 w-5 text-warning mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Switches</div>
              <div className="font-semibold">{switchCount}</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Brain className="h-5 w-5 text-success mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Current App</div>
              <div className="font-semibold text-xs">{currentApp}</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-sm text-muted-foreground">Nudges</div>
              <div className="font-semibold">{nudgeHistory.length}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Nudge History */}
      {nudgeHistory.length > 0 && (
        <Card className="p-6 glass-effect border-card-border">
          <h3 className="font-semibold mb-4">Recent Nudge History</h3>
          <div className="space-y-3">
            {nudgeHistory.slice(-5).reverse().map((nudge) => (
              <div key={nudge.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                {getTypeIcon(nudge.type)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{nudge.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {nudge.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {nudge.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Nudge Settings Preview */}
      <Card className="p-6 glass-effect border-card-border">
        <h3 className="font-semibold mb-4">Nudge Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Switch Rate Threshold</span>
              <span className="font-medium">8 per 10min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Break Reminder</span>
              <span className="font-medium">Every 45min</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Encouragement Frequency</span>
              <span className="font-medium">High Focus</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Active Nudges</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};