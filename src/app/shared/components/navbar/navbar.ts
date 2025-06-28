import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports:[CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Menu States
  isMenuOpen = false;
  isUserMenuOpen = false;

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
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) {
      this.closeMenu();
    }
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  // Timer Funktionen
  startTimer(): void {
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
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Schließe Mobile Menu bei Größenänderung
    if (window.innerWidth > 768) {
      this.closeMenu();
    }
  }

  // Keyboard Navigation
  // @HostListener('document:keydown.escape', ['$event'])
  // onEscapeKey(event: KeyboardEvent): void {
  //   this.closeMenu();
  //   this.closeUserMenu();
  // }
}

