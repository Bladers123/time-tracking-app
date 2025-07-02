
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  taskDescription: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  isRunning: boolean;
  date: Date;
  tags?: string[];
  billable: boolean;
}

interface TimeStats {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  billableToday: number;
  billableWeek: number;
  billableMonth: number;
}

@Component({
  selector: 'app-time-entry',
  imports: [CommonModule, FormsModule],
  templateUrl: './time-entry.html',
  styleUrl: './time-entry.scss'
})




export class TimeEntryComponent implements OnInit, OnDestroy {
  // Current timer state
  currentTimer: TimeEntry | null = null;
  isTimerRunning = false;
  currentSessionTime = '00:00:00';

  // Time entries
  timeEntries: TimeEntry[] = [];
  filteredEntries: TimeEntry[] = [];

  // Statistics
  timeStats: TimeStats = {
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    billableToday: 0,
    billableWeek: 0,
    billableMonth: 0
  };

  // Filter options
  selectedProject = 'all';
  selectedDateRange = 'today';
  showOnlyBillable = false;

  // Available projects for filter
  availableProjects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'API Development' },
    { id: '4', name: 'Database Migration' }
  ];

  // Subscriptions
  private timerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadTimeEntries();
    this.calculateStats();
    this.loadCurrentTimer();
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  // Data loading
  private loadTimeEntries(): void {
    // Beispiel-Daten - normalerweise aus einem Service geladen
    this.timeEntries = [
      {
        id: '1',
        projectId: '1',
        projectName: 'Website Redesign',
        taskDescription: 'Frontend-Entwicklung der Startseite',
        startTime: new Date(2024, 11, 1, 9, 0),
        endTime: new Date(2024, 11, 1, 12, 30),
        duration: 210,
        isRunning: false,
        date: new Date(2024, 11, 1),
        tags: ['frontend', 'html', 'css'],
        billable: true
      },
      {
        id: '2',
        projectId: '2',
        projectName: 'Mobile App',
        taskDescription: 'API-Integration für Benutzerverwaltung',
        startTime: new Date(2024, 11, 1, 14, 0),
        endTime: new Date(2024, 11, 1, 17, 45),
        duration: 225,
        isRunning: false,
        date: new Date(2024, 11, 1),
        tags: ['backend', 'api', 'integration'],
        billable: true
      },
      {
        id: '3',
        projectId: '1',
        projectName: 'Website Redesign',
        taskDescription: 'Code Review und Bugfixes',
        startTime: new Date(2024, 10, 30, 10, 15),
        endTime: new Date(2024, 10, 30, 11, 45),
        duration: 90,
        isRunning: false,
        date: new Date(2024, 10, 30),
        tags: ['review', 'bugfix'],
        billable: false
      },
      {
        id: '4',
        projectId: '3',
        projectName: 'API Development',
        taskDescription: 'Dokumentation erstellen',
        startTime: new Date(2024, 10, 29, 15, 30),
        endTime: new Date(2024, 10, 29, 18, 0),
        duration: 150,
        isRunning: false,
        date: new Date(2024, 10, 29),
        tags: ['documentation'],
        billable: true
      }
    ];
  }

  private loadCurrentTimer(): void {
    const savedTimer = localStorage.getItem('currentTimer');
    if (savedTimer) {
      this.currentTimer = JSON.parse(savedTimer);
      if (this.currentTimer && this.currentTimer.isRunning) {
        this.isTimerRunning = true;
        this.startTimerDisplay();
      }
    }
  }

  private calculateStats(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    this.timeStats = {
      todayTotal: this.getTotalMinutes(entry => this.isSameDay(entry.date, today)),
      weekTotal: this.getTotalMinutes(entry => entry.date >= weekStart),
      monthTotal: this.getTotalMinutes(entry => entry.date >= monthStart),
      billableToday: this.getTotalMinutes(entry => this.isSameDay(entry.date, today) && entry.billable),
      billableWeek: this.getTotalMinutes(entry => entry.date >= weekStart && entry.billable),
      billableMonth: this.getTotalMinutes(entry => entry.date >= monthStart && entry.billable)
    };
  }

  private getTotalMinutes(filter: (entry: TimeEntry) => boolean): number {
    return this.timeEntries
      .filter(filter)
      .reduce((total, entry) => total + entry.duration, 0);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Timer functions
  startTimer(projectId?: string, taskDescription?: string): void {
    if (this.isTimerRunning) {
      this.stopTimer();
    }

    const newTimer: TimeEntry = {
      id: Date.now().toString(),
      projectId: projectId || '1',
      projectName: this.getProjectName(projectId || '1'),
      taskDescription: taskDescription || 'Neue Aufgabe',
      startTime: new Date(),
      duration: 0,
      isRunning: true,
      date: new Date(),
      billable: true
    };

    this.currentTimer = newTimer;
    this.isTimerRunning = true;
    this.startTimerDisplay();
    
    localStorage.setItem('currentTimer', JSON.stringify(this.currentTimer));
  }

  stopTimer(): void {
    if (this.currentTimer && this.isTimerRunning) {
      this.currentTimer.endTime = new Date();
      this.currentTimer.isRunning = false;
      this.currentTimer.duration = Math.floor(
        (this.currentTimer.endTime.getTime() - this.currentTimer.startTime.getTime()) / 60000
      );

      this.timeEntries.unshift(this.currentTimer);
      this.isTimerRunning = false;
      this.timerSubscription?.unsubscribe();
      this.currentSessionTime = '00:00:00';
      
      localStorage.removeItem('currentTimer');
      this.calculateStats();
      this.applyFilters();
    }
  }

  private startTimerDisplay(): void {
    if (this.currentTimer) {
      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.currentTimer) {
          const elapsed = Date.now() - this.currentTimer.startTime.getTime();
          this.currentSessionTime = this.formatTime(elapsed);
        }
      });
    }
  }

  // Filter functions
  applyFilters(): void {
    let filtered = [...this.timeEntries];

    // Project filter
    if (this.selectedProject !== 'all') {
      filtered = filtered.filter(entry => entry.projectId === this.selectedProject);
    }

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (this.selectedDateRange) {
      case 'today':
        filtered = filtered.filter(entry => this.isSameDay(entry.date, today));
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        filtered = filtered.filter(entry => entry.date >= weekStart);
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(entry => entry.date >= monthStart);
        break;
    }

    // Billable filter
    if (this.showOnlyBillable) {
      filtered = filtered.filter(entry => entry.billable);
    }

    this.filteredEntries = filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  // Entry management
  editEntry(entry: TimeEntry): void {
    // Hier würde ein Edit-Modal geöffnet
    console.log('Edit entry:', entry);
  }

  deleteEntry(entryId: string): void {
    this.timeEntries = this.timeEntries.filter(entry => entry.id !== entryId);
    this.calculateStats();
    this.applyFilters();
  }

  duplicateEntry(entry: TimeEntry): void {
    this.startTimer(entry.projectId, entry.taskDescription);
  }

  // Navigation
  navigateToProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }

  // Utility functions
  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  getProjectName(projectId: string): string {
    const project = this.availableProjects.find(p => p.id === projectId);
    return project ? project.name : 'Unbekanntes Projekt';
  }

  trackByEntryId(index: number, entry: TimeEntry): string {
    return entry.id;
  }

  roundPercent(billable: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((billable / total) * 100);
}

}

