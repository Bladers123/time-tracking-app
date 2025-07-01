import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from "../../shared/components/navbar/navbar";
import { FooterComponent } from "../../shared/components/footer/footer";

interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  weeklyHours: number;
  totalHours: number;
  budget?: number;
  progressPercentage: number;
  description?: string;
  client?: string;
  startDate?: Date;
  endDate?: Date;
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
  date: string;
}

@Component({
  selector: 'app-project',
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './project.html',
  styleUrl: './project.scss'
})
export class ProjectComponent implements OnInit {
  project: Project | null = null;
  projectSessions: TimerSession[] = [];
  projectId: string | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  // Statistics
  totalProjectHours: number = 0;
  totalProjectMinutes: number = 0;
  sessionsCount: number = 0;
  averageSessionDuration: number = 0;

  // Available projects (in real app, this would come from a service)
  private availableProjects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      status: 'active',
      weeklyHours: 12.5,
      totalHours: 45.5,
      budget: 60,
      progressPercentage: 76,
      description: 'Komplette Überarbeitung der Unternehmenswebsite mit modernem Design und verbesserter Benutzerfreundlichkeit.',
      client: 'Tech Solutions GmbH',
      startDate: new Date(2024, 10, 1),
      endDate: new Date(2024, 11, 31)
    },
    {
      id: '2',
      name: 'Mobile App',
      status: 'active',
      weeklyHours: 8.0,
      totalHours: 32.0,
      budget: 40,
      progressPercentage: 80,
      description: 'Entwicklung einer nativen iOS und Android App für das Kundenmanagement.',
      client: 'StartUp Innovations',
      startDate: new Date(2024, 9, 15),
      endDate: new Date(2025, 0, 15)
    },
    {
      id: '3',
      name: 'API Development',
      status: 'paused',
      weeklyHours: 6.5,
      totalHours: 28.5,
      budget: 35,
      progressPercentage: 81,
      description: 'Backend API-Entwicklung für die Integration verschiedener Systeme.',
      client: 'Enterprise Corp',
      startDate: new Date(2024, 8, 1),
      endDate: new Date(2024, 11, 15)
    },
    {
      id: '4',
      name: 'Database Migration',
      status: 'completed',
      weeklyHours: 0,
      totalHours: 15.0,
      budget: 15,
      progressPercentage: 100,
      description: 'Migration der Legacy-Datenbank zu einer modernen Cloud-Lösung.',
      client: 'Legacy Systems Inc',
      startDate: new Date(2024, 7, 1),
      endDate: new Date(2024, 8, 30)
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.loadProject();
        this.loadProjectSessions();
      } else {
        this.error = 'Keine Projekt-ID angegeben';
        this.isLoading = false;
      }
    });
  }

  private loadProject(): void {
    this.project = this.availableProjects.find(p => p.id === this.projectId) || null;

    if (!this.project) {
      this.error = 'Projekt nicht gefunden';
    }

    this.isLoading = false;
  }

  private loadProjectSessions(): void {
    // In a real application, this would load from a service
    // For demo purposes, generate some sample sessions
    const sampleSessions: TimerSession[] = [
      {
        id: 'session_1',
        projectId: this.projectId!,
        projectName: this.project?.name || '',
        taskDescription: 'Frontend-Entwicklung für die neue Startseite',
        startTime: new Date(2024, 11, 28, 9, 0),
        endTime: new Date(2024, 11, 28, 11, 30),
        duration: '2h 30m',
        totalMinutes: 150,
        date: '28.12.2024'
      },
      {
        id: 'session_2',
        projectId: this.projectId!,
        projectName: this.project?.name || '',
        taskDescription: 'Bug-Fixes und Code-Review',
        startTime: new Date(2024, 11, 28, 13, 15),
        endTime: new Date(2024, 11, 28, 15, 45),
        duration: '2h 30m',
        totalMinutes: 150,
        date: '28.12.2024'
      },
      {
        id: 'session_3',
        projectId: this.projectId!,
        projectName: this.project?.name || '',
        taskDescription: 'Implementierung der Authentifizierung',
        startTime: new Date(2024, 11, 27, 14, 0),
        endTime: new Date(2024, 11, 27, 17, 0),
        duration: '3h 0m',
        totalMinutes: 180,
        date: '27.12.2024'
      },
      {
        id: 'session_4',
        projectId: this.projectId!,
        projectName: this.project?.name || '',
        taskDescription: 'Datenbank-Schema Update',
        startTime: new Date(2024, 11, 27, 10, 30),
        endTime: new Date(2024, 11, 27, 12, 0),
        duration: '1h 30m',
        totalMinutes: 90,
        date: '27.12.2024'
      },
      {
        id: 'session_5',
        projectId: this.projectId!,
        projectName: this.project?.name || '',
        taskDescription: 'Testing und Qualitätssicherung',
        startTime: new Date(2024, 11, 26, 15, 0),
        endTime: new Date(2024, 11, 26, 17, 30),
        duration: '2h 30m',
        totalMinutes: 150,
        date: '26.12.2024'
      },
      {
        id: 'session_6',
        projectId: this.projectId!,
        projectName: this.project?.name || '',
        taskDescription: 'Dokumentation und Deployment',
        startTime: new Date(2024, 11, 25, 9, 0),
        endTime: new Date(2024, 11, 25, 12, 0),
        duration: '3h 0m',
        totalMinutes: 180,
        date: '25.12.2024'
      }
    ];

    // Filter sessions for this project
    this.projectSessions = sampleSessions.filter(session => session.projectId === this.projectId);

    // Calculate statistics
    this.calculateProjectStatistics();
  }

  private calculateProjectStatistics(): void {
    this.sessionsCount = this.projectSessions.length;

    const totalMinutes = this.projectSessions.reduce((sum, session) => sum + session.totalMinutes, 0);
    this.totalProjectHours = Math.floor(totalMinutes / 60);
    this.totalProjectMinutes = totalMinutes % 60;

    this.averageSessionDuration = this.sessionsCount > 0 ? Math.round(totalMinutes / this.sessionsCount) : 0;
  }

  // Navigation methods
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  editSession(session: TimerSession): void {
    this.router.navigate(['/time-entry', session.id]);
  }

  deleteSession(session: TimerSession): void {
    // In a real application, this would call a service to delete the session
    const index = this.projectSessions.findIndex(s => s.id === session.id);
    if (index > -1) {
      this.projectSessions.splice(index, 1);
      this.calculateProjectStatistics();
    }
  }

  addNewSession(): void {
    this.router.navigate(['/time-entry'], { queryParams: { projectId: this.projectId } });
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'completed': return '#2563eb';
      default: return '#64748b';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'paused': return 'Pausiert';
      case 'completed': return 'Abgeschlossen';
      default: return 'Unbekannt';
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatDate(dateString: string): string {
    return dateString;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }
  
  trackBySessionId(index: number, session: TimerSession): string {
  return session.id;
}
}





