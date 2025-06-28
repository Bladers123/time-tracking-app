import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  weeklyHours: number;
  totalHours: number;
  budget?: number;
  progressPercentage: number;
}

interface TimerSession {
  id: string;
  projectId: string;
  projectName: string;
  taskDescription?: string;
  startTime: Date;
  endTime: Date;
  duration: string;
  totalMinutes: number;
}

interface TodayStats {
  totalHours: number;
  totalMinutes: number;
  sessionsCount: number;
}
@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timer.html',
  styleUrls: ['./timer.scss'],
})



 export class TimerComponent implements OnInit, OnDestroy {
  // Timer State
  isTimerRunning: boolean = false;
  isPaused: boolean = false;
  startTime: Date | null = null;
  pauseStartTime: Date | null = null;
  totalPausedTime: number = 0; // in milliseconds
  currentDuration: string = '00:00:00';
  
  // Project Selection
  selectedProjectId: string = '';
  selectedProject: Project | null = null;
  taskDescription: string = '';
  
  // Available Projects
  availableProjects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      status: 'active',
      weeklyHours: 12.5,
      totalHours: 45.5,
      budget: 60,
      progressPercentage: 76
    },
    {
      id: '2',
      name: 'Mobile App',
      status: 'active',
      weeklyHours: 8.0,
      totalHours: 32.0,
      budget: 40,
      progressPercentage: 80
    },
    {
      id: '3',
      name: 'API Development',
      status: 'paused',
      weeklyHours: 6.5,
      totalHours: 28.5,
      budget: 35,
      progressPercentage: 81
    },
    {
      id: '4',
      name: 'Database Migration',
      status: 'completed',
      weeklyHours: 0,
      totalHours: 15.0,
      budget: 15,
      progressPercentage: 100
    }
  ];

  // Session Management
  lastSession: TimerSession | null = null;
  todayStats: TodayStats = {
    totalHours: 6,
    totalMinutes: 45,
    sessionsCount: 3
  };

  // Timer Update Interval
  private timerInterval: any;

  // Events
  @Output() sessionStarted = new EventEmitter<TimerSession>();
  @Output() sessionEnded = new EventEmitter<TimerSession>();
  @Output() sessionPaused = new EventEmitter<void>();
  @Output() sessionResumed = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadTodayStats();
    this.loadLastSession();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // Project Selection
  onProjectChange(): void {
    this.selectedProject = this.availableProjects.find(p => p.id === this.selectedProjectId) || null;
  }

  // Timer Control Methods
  startTimer(): void {
    if (!this.selectedProject) {
      return;
    }

    this.isTimerRunning = true;
    this.isPaused = false;
    this.startTime = new Date();
    this.totalPausedTime = 0;
    this.lastSession = null;

    // Start the display update interval
    this.timerInterval = setInterval(() => {
      this.updateTimerDisplay();
    }, 1000);

    // Emit event
    const session: TimerSession = {
      id: this.generateSessionId(),
      projectId: this.selectedProject.id,
      projectName: this.selectedProject.name,
      taskDescription: this.taskDescription || undefined,
      startTime: this.startTime,
      endTime: new Date(), // Will be updated when stopped
      duration: '00:00:00',
      totalMinutes: 0
    };

    this.sessionStarted.emit(session);

    console.log('Timer gestartet:', {
      project: this.selectedProject.name,
      task: this.taskDescription,
      startTime: this.startTime
    });
  }

  stopTimer(): void {
    if (!this.isTimerRunning || !this.startTime) {
      return;
    }

    const endTime = new Date();
    const totalDuration = this.calculateDuration(this.startTime, endTime, this.totalPausedTime);

    // Create session record
    this.lastSession = {
      id: this.generateSessionId(),
      projectId: this.selectedProject!.id,
      projectName: this.selectedProject!.name,
      taskDescription: this.taskDescription || undefined,
      startTime: this.startTime,
      endTime: endTime,
      duration: totalDuration.formatted,
      totalMinutes: totalDuration.totalMinutes
    };

    // Reset timer state
    this.isTimerRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.currentDuration = '00:00:00';

    // Clear interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Update today stats
    this.updateTodayStats(totalDuration.totalMinutes);

    // Emit event
    this.sessionEnded.emit(this.lastSession);

    console.log('Timer gestoppt:', this.lastSession);

    // Save session (in real app, this would call a service)
    this.saveSession(this.lastSession);
  }

  pauseTimer(): void {
    if (!this.isTimerRunning || this.isPaused) {
      return;
    }

    this.isPaused = true;
    this.pauseStartTime = new Date();

    // Clear the update interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.sessionPaused.emit();

    console.log('Timer pausiert um:', this.pauseStartTime);
  }

  resumeTimer(): void {
    if (!this.isTimerRunning || !this.isPaused || !this.pauseStartTime) {
      return;
    }

    // Add paused time to total
    const pauseDuration = new Date().getTime() - this.pauseStartTime.getTime();
    this.totalPausedTime += pauseDuration;

    this.isPaused = false;
    this.pauseStartTime = null;

    // Restart the update interval
    this.timerInterval = setInterval(() => {
      this.updateTimerDisplay();
    }, 1000);

    this.sessionResumed.emit();

    console.log('Timer fortgesetzt. Gesamte Pausenzeit:', this.formatMilliseconds(this.totalPausedTime));
  }

  // Timer Display Update
  private updateTimerDisplay(): void {
    if (!this.startTime || this.isPaused) {
      return;
    }

    const now = new Date();
    const elapsed = now.getTime() - this.startTime.getTime() - this.totalPausedTime;
    this.currentDuration = this.formatMilliseconds(elapsed);
  }

  // Duration Calculation
  private calculateDuration(startTime: Date, endTime: Date, pausedTime: number = 0): { formatted: string, totalMinutes: number } {
    const totalElapsed = endTime.getTime() - startTime.getTime() - pausedTime;
    const totalMinutes = Math.floor(totalElapsed / (1000 * 60));
    
    return {
      formatted: this.formatMilliseconds(totalElapsed),
      totalMinutes: totalMinutes
    };
  }

  private formatMilliseconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Session Management
  startNewSession(): void {
    this.lastSession = null;
    this.selectedProjectId = '';
    this.selectedProject = null;
    this.taskDescription = '';
  }

  editLastSession(): void {
    if (this.lastSession) {
      // Navigate to edit page or open modal
      this.router.navigate(['/time-entry', this.lastSession.id]);
    }
  }

  // Data Management
  private saveSession(session: TimerSession): void {
    // In a real application, this would call a service to save to backend
    console.log('Session gespeichert:', session);
    
    // For demo purposes, save to localStorage
    const sessions = this.getSavedSessions();
    sessions.push(session);
    localStorage.setItem('timer_sessions', JSON.stringify(sessions));
  }

  private getSavedSessions(): TimerSession[] {
    const saved = localStorage.getItem('timer_sessions');
    return saved ? JSON.parse(saved) : [];
  }

  private loadTodayStats(): void {
    // In a real application, this would load from a service
    const today = new Date();
    const sessions = this.getSavedSessions().filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.toDateString() === today.toDateString();
    });

    const totalMinutes = sessions.reduce((sum, session) => sum + session.totalMinutes, 0);
    
    this.todayStats = {
      totalHours: Math.floor(totalMinutes / 60),
      totalMinutes: totalMinutes % 60,
      sessionsCount: sessions.length
    };
  }

  private loadLastSession(): void {
    // Load the most recent session if it was today
    const sessions = this.getSavedSessions();
    if (sessions.length > 0) {
      const lastSession = sessions[sessions.length - 1];
      const today = new Date();
      const sessionDate = new Date(lastSession.startTime);
      
      if (sessionDate.toDateString() === today.toDateString()) {
        // Only show if it was within the last hour
        const hoursSinceSession = (today.getTime() - new Date(lastSession.endTime).getTime()) / (1000 * 60 * 60);
        if (hoursSinceSession < 1) {
          this.lastSession = lastSession;
        }
      }
    }
  }

  private updateTodayStats(additionalMinutes: number): void {
    const totalMinutes = (this.todayStats.totalHours * 60) + this.todayStats.totalMinutes + additionalMinutes;
    
    this.todayStats = {
      totalHours: Math.floor(totalMinutes / 60),
      totalMinutes: totalMinutes % 60,
      sessionsCount: this.todayStats.sessionsCount + 1
    };
  }

  // Utility Methods
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Public utility methods for template
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  getProjectStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'completed': return '#2563eb';
      default: return '#64748b';
    }
  }
}

