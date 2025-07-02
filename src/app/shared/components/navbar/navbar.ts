
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';

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
@Component({
  selector: 'app-navbar',
  imports:[CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})


export class NavbarComponent implements OnInit, OnDestroy {
  // Menu States
  isMenuOpen = false;
  isUserMenuOpen = false;
  isProjectModalOpen = false;

  // User Information
  userName = 'Max Mustermann';
  userAvatar = '';
  userInitials = 'MM';

  // Timer und Zeit
  currentTime = new Date();
  isTimerRunning = false;
  currentSessionTime = '00:00:00';
  
  // Configuration
  showLogo = true;
  showCurrentTime = true;

  // Available Projects
  availableProjects: Project[] = [
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

  // Subscriptions
  private timeSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeUser();
    this.startClock();
    this.loadTimerState();
  }

  ngOnDestroy(): void {
    this.timeSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }

  // Initialisierung
  private initializeUser(): void {
    // Hier würden normalerweise Benutzerdaten aus einem Service geladen
    // Beispiel für Initialen-Generierung
    const nameParts = this.userName.split(' ');
    this.userInitials = nameParts.map(part => part.charAt(0)).join('').toUpperCase();
  }

  private startClock(): void {
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }

  private loadTimerState(): void {
    // Hier würde der Timer-Status aus einem Service geladen
    // Beispiel für laufenden Timer
    const savedTimerState = localStorage.getItem('timerState');
    if (savedTimerState) {
      const timerData = JSON.parse(savedTimerState);
      this.isTimerRunning = timerData.isRunning;
      if (this.isTimerRunning) {
        this.startSessionTimer(timerData.startTime);
      }
    }
  }

  private startSessionTimer(startTime?: number): void {
    const start = startTime || Date.now();
    this.timerSubscription = interval(1000).subscribe(() => {
      const elapsed = Date.now() - start;
      this.currentSessionTime = this.formatTime(elapsed);
    });
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Menu Funktionen
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.closeUserMenu();
      this.closeProjectModal();
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) {
      this.closeMenu();
      this.closeProjectModal();
    }
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  // Projekt Modal Funktionen
  toggleProjectModal(): void {
    this.isProjectModalOpen = !this.isProjectModalOpen;
    if (this.isProjectModalOpen) {
      this.closeMenu();
      this.closeUserMenu();
    }
  }

  closeProjectModal(): void {
    this.isProjectModalOpen = false;
  }

  selectProject(project: Project): void {
    this.navigateToProject(project.id);
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
    this.closeProjectModal();
  }

  startTimer(project: Project): void {
    // Hier würde der Timer für das spezifische Projekt gestartet
    console.log('Timer gestartet für Projekt:', project.name);
    this.router.navigate(['/timer'], { queryParams: { projectId: project.id } });
    this.closeProjectModal();
  }

  createNewProject(): void {
    this.router.navigate(['/project/new']);
    this.closeProjectModal();
  }

  // Timer Funktionen
  startTimerFromNavbar(): void {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      const startTime = Date.now();
      localStorage.setItem('timerState', JSON.stringify({
        isRunning: true,
        startTime: startTime
      }));
      this.startSessionTimer(startTime);
    }
  }

  stopTimer(): void {
    if (this.isTimerRunning) {
      this.isTimerRunning = false;
      this.timerSubscription?.unsubscribe();
      localStorage.removeItem('timerState');
      this.currentSessionTime = '00:00:00';
    }
  }

  // Navigation
  logout(): void {
    // Hier würde die Logout-Logik implementiert
    this.stopTimer();
    localStorage.clear();
    this.router.navigate(['/login']);
    this.closeUserMenu();
  }

  // Utility Methods
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

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  // Event Listeners
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Schließe User Menu wenn außerhalb geklickt wird
    if (!target.closest('.user-dropdown')) {
      this.closeUserMenu();
    }
    
    // Schließe Mobile Menu wenn außerhalb geklickt wird
    if (!target.closest('.navbar-nav') && !target.closest('.mobile-menu-toggle')) {
      this.closeMenu();
    }

    // Schließe Project Modal wenn außerhalb geklickt wird
    if (!target.closest('.project-modal') && !target.closest('[data-project-trigger]')) {
      this.closeProjectModal();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Schließe Mobile Menu bei Größenänderung
    if (window.innerWidth > 768) {
      this.closeMenu();
    }
  }

  // @HostListener('document:keydown.escape', ['$event'])
  // onEscapeKey(event: KeyboardEvent): void {
  //   this.closeMenu();
  //   this.closeUserMenu();
  //   this.closeProjectModal();
  // }
}


