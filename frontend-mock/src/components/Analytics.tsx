import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Eye,
  Calendar,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeBlock {
  hour: string;
  focusScore: number;
  productive: number;
  distracted: number;
}

interface AppUsage {
  name: string;
  duration: number;
  category: 'productive' | 'neutral' | 'distracting';
  percentage: number;
}

export const Analytics = () => {
  const todayData: TimeBlock[] = [
    { hour: '9:00', focusScore: 85, productive: 45, distracted: 15 },
    { hour: '10:00', focusScore: 92, productive: 55, distracted: 5 },
    { hour: '11:00', focusScore: 78, productive: 40, distracted: 20 },
    { hour: '12:00', focusScore: 45, productive: 20, distracted: 40 },
    { hour: '13:00', focusScore: 60, productive: 35, distracted: 25 },
    { hour: '14:00', focusScore: 88, productive: 50, distracted: 10 },
    { hour: '15:00', focusScore: 95, productive: 58, distracted: 2 },
    { hour: '16:00', focusScore: 82, productive: 45, distracted: 15 },
  ];

  const appUsage: AppUsage[] = [
    { name: 'VS Code', duration: 180, category: 'productive', percentage: 35 },
    { name: 'Chrome (Work)', duration: 120, category: 'productive', percentage: 24 },
    { name: 'Slack', duration: 60, category: 'neutral', percentage: 12 },
    { name: 'Figma', duration: 90, category: 'productive', percentage: 18 },
    { name: 'Twitter', duration: 30, category: 'distracting', percentage: 6 },
    { name: 'YouTube', duration: 25, category: 'distracting', percentage: 5 },
  ];

  const weeklyStats = {
    averageFocus: 78,
    totalFocusTime: 26.5,
    bestDay: 'Tuesday',
    improvementTrend: '+12%'
  };

  const getCategoryColor = (category: AppUsage['category']) => {
    switch (category) {
      case 'productive': return 'text-success';
      case 'distracting': return 'text-destructive';
      default: return 'text-warning';
    }
  };

  const getCategoryBg = (category: AppUsage['category']) => {
    switch (category) {
      case 'productive': return 'bg-success/10';
      case 'distracting': return 'bg-destructive/10';
      default: return 'bg-warning/10';
    }
  };

  const getFocusScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-focus p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Focus Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Detailed insights into your productivity patterns
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 glass-effect border-card-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Focus Score</p>
                <p className="text-2xl font-bold text-primary">{weeklyStats.averageFocus}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-card-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 text-success">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Focus Time</p>
                <p className="text-2xl font-bold text-success">{weeklyStats.totalFocusTime}h</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-card-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10 text-warning">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Day</p>
                <p className="text-2xl font-bold text-warning">{weeklyStats.bestDay}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-card-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className="text-2xl font-bold text-primary">{weeklyStats.improvementTrend}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Focus Timeline */}
          <Card className="p-6 glass-effect border-card-border">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Today's Focus Timeline</h3>
            </div>

            <div className="space-y-4">
              {todayData.map((block, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{block.hour}</span>
                    <span className={cn("font-medium", 
                      block.focusScore >= 80 ? 'text-success' : 
                      block.focusScore >= 60 ? 'text-warning' : 'text-destructive'
                    )}>
                      {block.focusScore}%
                    </span>
                  </div>
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
                    <div 
                      className="bg-success transition-all duration-500"
                      style={{ width: `${(block.productive / 60) * 100}%` }}
                    />
                    <div 
                      className="bg-destructive transition-all duration-500"
                      style={{ width: `${(block.distracted / 60) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-card-border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-muted-foreground">Productive</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <span className="text-muted-foreground">Idle</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-muted-foreground">Distracting</span>
              </div>
            </div>
          </Card>

          {/* App Usage Breakdown */}
          <Card className="p-6 glass-effect border-card-border">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">App Usage Today</h3>
            </div>

            <div className="space-y-4">
              {appUsage.map((app, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", getCategoryBg(app.category))}>
                        <div className={cn("w-full h-full rounded-full", 
                          app.category === 'productive' ? 'bg-success' :
                          app.category === 'distracting' ? 'bg-destructive' : 'bg-warning'
                        )}></div>
                      </div>
                      <span className="font-medium">{app.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{Math.floor(app.duration / 60)}h {app.duration % 60}m</div>
                      <div className="text-xs text-muted-foreground">{app.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={app.percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-card-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-success">
                    {appUsage.filter(app => app.category === 'productive').reduce((acc, app) => acc + app.percentage, 0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Productive</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-warning">
                    {appUsage.filter(app => app.category === 'neutral').reduce((acc, app) => acc + app.percentage, 0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Neutral</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-destructive">
                    {appUsage.filter(app => app.category === 'distracting').reduce((acc, app) => acc + app.percentage, 0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Distracting</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Trends */}
        <Card className="p-6 glass-effect border-card-border">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Weekly Focus Patterns</h3>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const scores = [75, 88, 82, 91, 67, 45, 52];
              const score = scores[index];
              return (
                <div key={day} className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">{day}</div>
                  <div className="h-20 bg-muted rounded-lg overflow-hidden flex items-end">
                    <div 
                      className={cn("w-full transition-all duration-500 rounded-lg", getFocusScoreColor(score))}
                      style={{ height: `${score}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium mt-1 text-muted-foreground">{score}%</div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Your focus peaks midweek and tends to drop on weekends. Consider scheduling important work on Tuesday-Thursday.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};