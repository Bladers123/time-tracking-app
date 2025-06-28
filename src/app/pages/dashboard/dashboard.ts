import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TimerEntryComponent } from "./timer-entry/timer-entry";
import { TimerComponent } from './timer/timer';
import { NavbarComponent } from "../../shared/components/navbar/navbar";
import { FooterComponent } from "../../shared/components/footer/footer";

import {  OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Activity {
  id: string;
  projectName: string;
  description: string;
  startTime: Date;
  endTime: Date;
  duration: string;
}

interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  weeklyHours: number;
  totalHours: number;
  budget?: number;
  progressPercentage: number;
}


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NavbarComponent, FooterComponent, TimerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  // User Information
  userName: string = 'Max Mustermann';
  currentDate: Date = new Date();

  // Statistics
  todayHours: number = 6;
  todayMinutes: number = 45;
  weekHours: number = 32;
  weekMinutes: number = 15;
  monthHours: number = 142;
  targetWeeklyHours: number = 40;
  activeProjectsCount: number = 5;

  // Chart
  chartView: 'hours' | 'projects' = 'hours';

  // Recent Activities
  recentActivities: Activity[] = [
    {
      id: '1',
      projectName: 'Website Redesign',
      description: 'Frontend-Entwicklung für die neue Startseite',
      startTime: new Date(2024, 11, 28, 9, 0),
      endTime: new Date(2024, 11, 28, 11, 30),
      duration: '2h 30m'
    },
    {
      id: '2',
      projectName: 'Mobile App',
      description: 'Bug-Fixes für iOS Version',
      startTime: new Date(2024, 11, 28, 13, 15),
      endTime: new Date(2024, 11, 28, 15, 45),
      duration: '2h 30m'
    },
    {
      id: '3',
      projectName: 'API Development',
      description: 'Implementierung der Authentifizierung',
      startTime: new Date(2024, 11, 27, 14, 0),
      endTime: new Date(2024, 11, 27, 17, 0),
      duration: '3h 0m'
    },
    {
      id: '4',
      projectName: 'Database Migration',
      description: 'Datenbank-Schema Update',
      startTime: new Date(2024, 11, 27, 10, 30),
      endTime: new Date(2024, 11, 27, 12, 0),
      duration: '1h 30m'
    }
  ];

  // Top Projects
  topProjects: Project[] = [
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
  }

  // Navigation Methods
  addManualEntry(): void {
    this.router.navigate(['/time-entry']);
  }

  viewAllActivities(): void {
    this.router.navigate(['/activities']);
  }

  viewAllProjects(): void {
    this.router.navigate(['/projects']);
  }

  // Activity Methods
  editActivity(activity: Activity): void {
    this.router.navigate(['/time-entry', activity.id]);
  }

  deleteActivity(activity: Activity): void {
    // Implementierung zum Löschen einer Aktivität
    const index = this.recentActivities.findIndex(a => a.id === activity.id);
    if (index > -1) {
      this.recentActivities.splice(index, 1);
    }
  }

  // Chart Methods
  setChartView(view: 'hours' | 'projects'): void {
    this.chartView = view;
    // Hier würde die Chart-Daten aktualisiert werden
  }

  // TrackBy Functions (für Performance)
  trackByActivityId(index: number, activity: Activity): string {
    return activity.id;
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  // Data Loading Methods
  private loadUserData(): void {
    // Hier würden normalerweise Benutzerdaten geladen werden
    // this.userService.getCurrentUser().subscribe(user => {
    //   this.userName = user.name;
    // });
  }

  private loadDashboardData(): void {
    // Hier würden normalerweise Dashboard-Daten geladen werden
    // this.timeTrackingService.getDashboardData().subscribe(data => {
    //   this.todayHours = data.todayHours;
    //   this.weekHours = data.weekHours;
    //   // ... weitere Daten
    // });
  }

  // Utility Methods
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  getProjectStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'completed': return '#2196F3';
      default: return '#757575';
    }
  }
}

