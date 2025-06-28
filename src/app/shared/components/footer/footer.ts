import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription, interval } from 'rxjs';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  // Firmen-/App-Informationen
  companyName = 'Zeiterfassung Pro';
  companyDescription = 'Professionelle Zeiterfassung für Teams und Freelancer. Verwalten Sie Ihre Projekte, tracken Sie Ihre Zeit und erstellen Sie detaillierte Berichte.';
  appVersion = '2.1.4';
  lastUpdateDate = new Date('2024-12-15');
  supportEmail = 'support@zeiterfassung-pro.de';

  // UI-Konfiguration
  showLogo = true;
  showSessionStats = true;
  showScrollToTop = false;
  isMobileView = false;

  // Server-Status
  isServerOnline = true;

  // Session-Statistiken
  todayTotalTime = '00:00:00';
  todayProjectCount = 0;
  todayBreakTime = '00:00:00';
  isCurrentlyTracking = false;

  // Aktuelle Zeit
  currentYear = new Date().getFullYear();

  // Social Media Links
  socialLinks: SocialLink[] = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/zeiterfassung-pro',
      icon: 'icon-linkedin'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/zeiterfassung_pro',
      icon: 'icon-twitter'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/zeiterfassung-pro',
      icon: 'icon-github'
    }
  ];

  // Subscriptions
  private statsSubscription?: Subscription;
  private serverStatusSubscription?: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.checkMobileView();
    this.loadSessionStats();
    this.startStatsUpdater();
    this.checkServerStatus();
  }

  ngOnDestroy(): void {
    this.statsSubscription?.unsubscribe();
    this.serverStatusSubscription?.unsubscribe();
  }

  // Initialisierung
  private checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  private loadSessionStats(): void {
    // Hier würden normalerweise die Session-Statistiken aus einem Service geladen
    // Beispiel-Daten
    const savedStats = localStorage.getItem('todayStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      this.todayTotalTime = stats.totalTime || '00:00:00';
      this.todayProjectCount = stats.projectCount || 0;
      this.todayBreakTime = stats.breakTime || '00:00:00';
      this.isCurrentlyTracking = stats.isTracking || false;
    } else {
      // Standard-Werte setzen
      this.updateSessionStats();
    }
  }

  private startStatsUpdater(): void {
    // Aktualisiere Statistiken alle 30 Sekunden
    this.statsSubscription = interval(30000).subscribe(() => {
      this.updateSessionStats();
    });
  }

  private updateSessionStats(): void {
    // Hier würde normalerweise ein Service die aktuellen Statistiken liefern
    // Beispiel-Implementierung
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Simuliere Daten basierend auf LocalStorage oder Service
    const timerState = localStorage.getItem('timerState');
    if (timerState) {
      const timer = JSON.parse(timerState);
      this.isCurrentlyTracking = timer.isRunning || false;
    }

    // Beispiel-Berechnung der Tageszeit
    const mockTotalMinutes = Math.floor(Math.random() * 480) + 60; // 1-8 Stunden
    this.todayTotalTime = this.formatMinutesToTime(mockTotalMinutes);
    this.todayProjectCount = Math.floor(Math.random() * 5) + 1;
    this.todayBreakTime = this.formatMinutesToTime(Math.floor(mockTotalMinutes * 0.1));

    // Speichere Statistiken
    const stats = {
      totalTime: this.todayTotalTime,
      projectCount: this.todayProjectCount,
      breakTime: this.todayBreakTime,
      isTracking: this.isCurrentlyTracking,
      lastUpdate: now.toISOString()
    };
    localStorage.setItem('todayStats', JSON.stringify(stats));
  }

  private formatMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  }

  private checkServerStatus(): void {
    // Simuliere Server-Status-Check
    this.serverStatusSubscription = interval(60000).subscribe(() => {
      // Hier würde normalerweise ein Health-Check API-Call gemacht
      this.isServerOnline = Math.random() > 0.1; // 90% Uptime Simulation
    });
  }

  // Event Handlers
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(): void {
  //   // Zeige "Scroll to Top" Button ab 300px Scroll-Position
  //   this.showScrollToTop = window.pageYOffset > 300;
  // }

  // @HostListener('window:resize', ['$event'])
  // onResize(): void {
  //   this.checkMobileView();
  // }

  // Utility Methods
  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  copyEmailToClipboard(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.supportEmail).then(() => {
        // Hier könnte eine Toast-Notification angezeigt werden
        console.log('E-Mail-Adresse in Zwischenablage kopiert');
      });
    }
  }

  // Getter für Template
  get hasActiveSocialLinks(): boolean {
    return this.socialLinks.length > 0;
  }

  get formattedLastUpdate(): string {
    return this.lastUpdateDate.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Debug-Methoden (können in Produktion entfernt werden)
  refreshStats(): void {
    this.updateSessionStats();
  }

  toggleServerStatus(): void {
    this.isServerOnline = !this.isServerOnline;
  }

  resetSessionStats(): void {
    this.todayTotalTime = '00:00:00';
    this.todayProjectCount = 0;
    this.todayBreakTime = '00:00:00';
    this.isCurrentlyTracking = false;
    localStorage.removeItem('todayStats');
  }
}

