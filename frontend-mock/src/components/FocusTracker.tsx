import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Target, BarChart3, Settings, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusSession {
  isActive: boolean;
  startTime: Date | null;
  duration: number;
  focusScore: number;
  switches: number;
}

interface FocusStats {
  dailyFocusScore: number;
  weeklyAverage: number;
  todayMinutes: number;
  distractionCount: number;
}

export const FocusTracker = () => {
  const [session, setSession] = useState<FocusSession>({
    isActive: false,
    startTime: null,
    duration: 0,
    focusScore: 85,
    switches: 12
  });

  const [stats] = useState<FocusStats>({
    dailyFocusScore: 78,
    weeklyAverage: 82,
    todayMinutes: 124,
    distractionCount: 8
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (session.isActive && session.startTime) {
        setSession(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - (prev.startTime?.getTime() || 0)) / 1000)
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session.isActive, session.startTime]);

  const startSession = () => {
    setSession(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date(),
      duration: 0
    }));
  };

  const pauseSession = () => {
    setSession(prev => ({
      ...prev,
      isActive: false
    }));
  };

  const stopSession = () => {
    setSession({
      isActive: false,
      startTime: null,
      duration: 0,
      focusScore: 85,
      switches: 12
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFocusColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-focus p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Smart Focus Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session Control */}
          <Card className="lg:col-span-2 p-8 glass-effect border-card-border">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Brain className="h-4 w-4" />
                  {session.isActive ? 'Focus Session Active' : 'Ready to Focus'}
                </div>
                <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {formatDuration(session.duration)}
                </div>
                <p className="text-muted-foreground">
                  {session.isActive ? 'Stay focused!' : 'Start your next focus session'}
                </p>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4">
                {!session.isActive ? (
                  <Button 
                    variant="focus" 
                    size="lg" 
                    onClick={startSession}
                    className="px-8"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Focus Session
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="warning" 
                      size="lg" 
                      onClick={pauseSession}
                    >
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="lg" 
                      onClick={stopSession}
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop
                    </Button>
                  </>
                )}
              </div>

              {/* Session Stats */}
              {session.isActive && (
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-card-border">
                  <div className="text-center">
                    <div className={cn("text-2xl font-bold", getFocusColor(session.focusScore))}>
                      {session.focusScore}%
                    </div>
                    <p className="text-sm text-muted-foreground">Focus Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">
                      {session.switches}
                    </div>
                    <p className="text-sm text-muted-foreground">App Switches</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Today's Stats */}
          <Card className="p-6 glass-effect border-card-border">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Today's Progress</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Focus Score</span>
                    <span className={cn("font-semibold", getFocusColor(stats.dailyFocusScore))}>
                      {stats.dailyFocusScore}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${stats.dailyFocusScore}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-card-border">
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {Math.floor(stats.todayMinutes / 60)}h {stats.todayMinutes % 60}m
                    </div>
                    <p className="text-xs text-muted-foreground">Focused Time</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-warning">
                      {stats.distractionCount}
                    </div>
                    <p className="text-xs text-muted-foreground">Distractions</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-card-border">
                  <div className="text-sm text-muted-foreground mb-1">
                    Weekly Average
                  </div>
                  <div className={cn("text-lg font-semibold", getFocusColor(stats.weeklyAverage))}>
                    {stats.weeklyAverage}%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 glass-effect border-card-border hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-colors">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Quick 25min Focus</h4>
                <p className="text-sm text-muted-foreground">Pomodoro session</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-effect border-card-border hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground transition-colors">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">View Analytics</h4>
                <p className="text-sm text-muted-foreground">Detailed insights</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-effect border-card-border hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Smart Nudges</h4>
                <p className="text-sm text-muted-foreground">AI assistance</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Bar */}
        <Card className="p-4 glass-effect border-card-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-muted-foreground">System Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <span className="text-muted-foreground">Nudges Enabled</span>
              </div>
            </div>
            <div className="text-muted-foreground">
              Last sync: {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};