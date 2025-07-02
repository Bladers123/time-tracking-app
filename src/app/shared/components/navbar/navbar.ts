
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProjectModalComponent } from "../../../pages/project-modal/project-modal";

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
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProjectModalComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
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

  // Available Projects - Diese werden an die project-modal Komponente weitergegeben
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
      name: 'Mobile App Development',
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
    },
    {
      id: '5',
      name: 'E-Commerce Platform',
      status: 'active',
      weeklyHours: 15.0,
      totalHours: 67.5,
      budget: 80,
      progressPercentage: 84,
      description: 'Entwicklung einer vollständigen E-Commerce-Plattform mit Payment-Integration.',
      client: 'Retail Solutions Ltd',
      startDate: new Date(2024, 9, 1),
      endDate: new Date(2025, 1, 28)
    }
  ];

  // Subscriptions
  private timeSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(private router: Router) { }

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
    const nameParts = this.userName.split(' ');
    this.userInitials = nameParts.map(part => part.charAt(0)).join('').toUpperCase();
  }

  private startClock(): void {
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }

  private loadTimerState(): void {
    // Timer-Status aus localStorage laden
    const savedTimerState = localStorage.getItem('timerState');
    if (savedTimerState) {
      try {
        const timerData = JSON.parse(savedTimerState);
        this.isTimerRunning = timerData.isRunning;
        if (this.isTimerRunning && timerData.startTime) {
          this.startSessionTimer(timerData.startTime);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Timer-Status:', error);
        localStorage.removeItem('timerState');
      }
    }
  }

  private startSessionTimer(startTime?: number): void {
    const start = startTime || Date.now();
    this.timerSubscription?.unsubscribe(); // Vorherigen Timer stoppen

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

  // Projekt Modal Funktionen - Vereinfacht für externe Komponente
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

  // Event Handler für project-modal Komponente
  selectProject(project: Project): void {
    console.log('Projekt ausgewählt:', project.name);
    this.navigateToProject(project.id);
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
    this.closeProjectModal();
  }

  startTimer(project: Project): void {
    console.log('Timer gestartet für Projekt:', project.name);

    // Timer-Status aktualisieren
    this.isTimerRunning = true;
    const startTime = Date.now();

    // Status in localStorage speichern
    localStorage.setItem('timerState', JSON.stringify({
      isRunning: true,
      startTime: startTime,
      projectId: project.id,
      projectName: project.name
    }));

    // Session Timer starten
    this.startSessionTimer(startTime);

    // Optional: Zur Timer-Seite navigieren
    this.router.navigate(['/timer'], {
      queryParams: {
        projectId: project.id,
        projectName: project.name
      }
    });

    this.closeProjectModal();
  }

  createNewProject(): void {
    console.log('Neues Projekt erstellen');
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

  toggleTimer(): void {
    if (this.isTimerRunning) {
      this.stopTimer();
    } else {
      this.startTimerFromNavbar();
    }
  }

  // Navigation und Benutzer-Aktionen
  logout(): void {
    console.log('Benutzer abmelden');

    // Timer stoppen
    this.stopTimer();

    // Alle gespeicherten Daten löschen
    localStorage.clear();
    sessionStorage.clear();

    // Zur Login-Seite navigieren
    this.router.navigate(['/login']);
    this.closeUserMenu();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.closeUserMenu();
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
    this.closeUserMenu();
  }

  // Utility Methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'completed': return '#3b82f6';
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

    // Project Modal wird durch die externe Komponente selbst verwaltet
    // Nur schließen wenn nicht auf den Trigger geklickt wurde
    if (!target.closest('[data-project-trigger]') && !target.closest('app-project-modal')) {
      this.closeProjectModal();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Schließe Mobile Menu bei Größenänderung auf Desktop
    if (window.innerWidth > 768) {
      this.closeMenu();
    }
  }

  // @HostListener('document:keydown.escape', ['$event'])
  // onEscapeKey(event: KeyboardEvent): void {
  //   // Alle Menüs und Modals schließen bei Escape
  //   this.closeMenu();
  //   this.closeUserMenu();
  //   this.closeProjectModal();
  // }

  // Zusätzliche Hilfsmethoden
  getCurrentProjectName(): string {
    const timerState = localStorage.getItem('timerState');
    if (timerState) {
      try {
        const data = JSON.parse(timerState);
        return data.projectName || 'Unbekanntes Projekt';
      } catch {
        return 'Unbekanntes Projekt';
      }
    }
    return 'Kein Projekt';
  }

  hasActiveProjects(): boolean {
    return this.availableProjects.some(project => project.status === 'active');
  }

  getActiveProjectsCount(): number {
    return this.availableProjects.filter(project => project.status === 'active').length;
  }

  getTotalHoursThisWeek(): number {
    return this.availableProjects
      .filter(project => project.status === 'active')
      .reduce((total, project) => total + project.weeklyHours, 0);
  }
}

