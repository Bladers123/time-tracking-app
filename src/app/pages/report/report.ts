import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { FormsModule } from '@angular/forms';


interface ReportData {
  period: string;
  totalHours: number;
  billableHours: number;
  projects: ProjectReport[];
  dailyBreakdown: DailyReport[];
}

interface ProjectReport {
  id: string;
  name: string;
  totalHours: number;
  billableHours: number;
  percentage: number;
  client?: string;
}

interface DailyReport {
  date: Date;
  totalHours: number;
  billableHours: number;
  projects: { [key: string]: number };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}


@Component({
  selector: 'app-report',
  imports: [CommonModule, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './report.html',
  styleUrl: './report.scss'
})





export class ReportComponent implements OnInit {
  // Report configuration
  selectedPeriod = 'month';
  selectedProject = 'all';
  showBillableOnly = false;

  // Report data
  reportData: ReportData = {
    period: 'Dieser Monat',
    totalHours: 0,
    billableHours: 0,
    projects: [],
    dailyBreakdown: []
  };

  // Chart data
  projectChartData: ChartData = {
    labels: [],
    datasets: []
  };

  timelineChartData: ChartData = {
    labels: [],
    datasets: []
  };

  // Available projects
  availableProjects = [
    { id: '1', name: 'Website Redesign', client: 'Tech Solutions GmbH' },
    { id: '2', name: 'Mobile App', client: 'StartUp Innovations' },
    { id: '3', name: 'API Development', client: 'Enterprise Corp' },
    { id: '4', name: 'Database Migration', client: 'Legacy Systems Inc' }
  ];

  // Summary statistics
  summaryStats = {
    averageHoursPerDay: 0,
    mostProductiveDay: '',
    topProject: '',
    billablePercentage: 0,
    totalDays: 0,
    workingDays: 0
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.generateReportData();
    this.calculateSummaryStats();
    this.generateChartData();
  }

  // Data generation
  private generateReportData(): void {
    // Beispiel-Daten generieren basierend auf ausgewähltem Zeitraum
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now);

    switch (this.selectedPeriod) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        this.reportData.period = 'Diese Woche';
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        this.reportData.period = 'Dieser Monat';
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        this.reportData.period = 'Dieses Quartal';
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        this.reportData.period = 'Dieses Jahr';
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        this.reportData.period = 'Dieser Monat';
    }

    // Projekt-Reports generieren
    this.reportData.projects = this.availableProjects.map(project => {
      const totalHours = Math.floor(Math.random() * 80) + 20;
      const billableHours = Math.floor(totalHours * (0.7 + Math.random() * 0.3));

      return {
        id: project.id,
        name: project.name,
        client: project.client,
        totalHours,
        billableHours,
        percentage: 0 // Wird später berechnet
      };
    });

    // Gesamtstunden berechnen
    this.reportData.totalHours = this.reportData.projects.reduce((sum, p) => sum + p.totalHours, 0);
    this.reportData.billableHours = this.reportData.projects.reduce((sum, p) => sum + p.billableHours, 0);

    // Prozentsätze berechnen
    this.reportData.projects.forEach(project => {
      project.percentage = this.reportData.totalHours > 0
        ? Math.round((project.totalHours / this.reportData.totalHours) * 100)
        : 0;
    });

    // Tägliche Aufschlüsselung generieren
    this.generateDailyBreakdown(startDate, endDate);
  }

  private generateDailyBreakdown(startDate: Date, endDate: Date): void {
    this.reportData.dailyBreakdown = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const hasWork = !isWeekend && Math.random() > 0.2; // 80% Chance für Arbeit an Werktagen

      if (hasWork) {
        const totalHours = Math.floor(Math.random() * 6) + 2; // 2-8 Stunden
        const billableHours = Math.floor(totalHours * (0.6 + Math.random() * 0.4));

        const projects: { [key: string]: number } = {};
        let remainingHours = totalHours;

        // Stunden auf Projekte verteilen
        this.availableProjects.forEach((project, index) => {
          if (remainingHours > 0 && Math.random() > 0.3) {
            const hours = index === this.availableProjects.length - 1
              ? remainingHours
              : Math.min(Math.floor(Math.random() * remainingHours) + 1, remainingHours);
            projects[project.id] = hours;
            remainingHours -= hours;
          }
        });

        this.reportData.dailyBreakdown.push({
          date: new Date(currentDate),
          totalHours,
          billableHours,
          projects
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  private calculateSummaryStats(): void {
    const breakdown = this.reportData.dailyBreakdown;

    if (breakdown.length === 0) {
      this.summaryStats = {
        averageHoursPerDay: 0,
        mostProductiveDay: 'Keine Daten',
        topProject: 'Keine Daten',
        billablePercentage: 0,
        totalDays: 0,
        workingDays: 0
      };
      return;
    }

    // Durchschnittliche Stunden pro Tag
    const totalHours = breakdown.reduce((sum, day) => sum + day.totalHours, 0);
    this.summaryStats.averageHoursPerDay = Math.round((totalHours / breakdown.length) * 10) / 10;

    // Produktivster Tag
    const mostProductiveDay = breakdown.reduce((max, day) =>
      day.totalHours > max.totalHours ? day : max
    );
    this.summaryStats.mostProductiveDay = mostProductiveDay.date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit'
    });

    // Top Projekt
    const topProject = this.reportData.projects.reduce((max, project) =>
      project.totalHours > max.totalHours ? project : max
    );
    this.summaryStats.topProject = topProject.name;

    // Abrechenbare Prozent
    this.summaryStats.billablePercentage = this.reportData.totalHours > 0
      ? Math.round((this.reportData.billableHours / this.reportData.totalHours) * 100)
      : 0;

    // Arbeitstage
    this.summaryStats.workingDays = breakdown.length;
    this.summaryStats.totalDays = this.getDaysBetween(
      breakdown[0]?.date || new Date(),
      breakdown[breakdown.length - 1]?.date || new Date()
    );
  }

  private generateChartData(): void {
    // Projekt-Verteilungs-Chart
    this.projectChartData = {
      labels: this.reportData.projects.map(p => p.name),
      datasets: [{
        label: 'Stunden',
        data: this.reportData.projects.map(p => p.totalHours),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4'
        ],
        borderColor: [
          '#2563eb',
          '#059669',
          '#d97706',
          '#dc2626',
          '#7c3aed',
          '#0891b2'
        ]
      }]
    };

    // Timeline-Chart
    const last7Days = this.reportData.dailyBreakdown.slice(-7);
    this.timelineChartData = {
      labels: last7Days.map(day =>
        day.date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit' })
      ),
      datasets: [
        {
          label: 'Gesamtstunden',
          data: last7Days.map(day => day.totalHours),
          backgroundColor: ['rgba(59, 130, 246, 0.5)'],
          borderColor: ['#3b82f6']
        },
        {
          label: 'Abrechenbare Stunden',
          data: last7Days.map(day => day.billableHours),
          backgroundColor: ['rgba(16, 185, 129, 0.5)'],
          borderColor: ['#10b981']
        }
      ]
    };
  }

  // Event handlers
  onPeriodChange(): void {
    this.generateReportData();
    this.calculateSummaryStats();
    this.generateChartData();
  }

  onProjectChange(): void {
    // Filter implementieren wenn nötig
    this.generateChartData();
  }

  onBillableToggle(): void {
    // Filter implementieren wenn nötig
    this.generateChartData();
  }

  // Export functions
  exportToPDF(): void {
    // PDF-Export implementieren
    console.log('Exportiere Bericht als PDF...');
  }

  exportToCSV(): void {
    // CSV-Export implementieren
    const csvData = this.generateCSVData();
    this.downloadCSV(csvData, `zeitbericht_${this.selectedPeriod}.csv`);
  }

  exportToExcel(): void {
    // Excel-Export implementieren
    console.log('Exportiere Bericht als Excel...');
  }

  private generateCSVData(): string {
    let csv = 'Datum,Projekt,Gesamtstunden,Abrechenbare Stunden\n';

    this.reportData.dailyBreakdown.forEach(day => {
      Object.entries(day.projects).forEach(([projectId, hours]) => {
        const project = this.availableProjects.find(p => p.id === projectId);
        const projectName = project ? project.name : 'Unbekannt';
        const billableHours = Math.floor(hours * 0.8); // Beispiel-Berechnung

        csv += `${day.date.toLocaleDateString('de-DE')},${projectName},${hours},${billableHours}\n`;
      });
    });

    return csv;
  }

  private downloadCSV(csvData: string, filename: string): void {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Navigation
  navigateToProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }

  navigateToTimeEntries(): void {
    this.router.navigate(['/zeiten']);
  }

  // Utility functions
  formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  private getDaysBetween(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }

  getProjectColor(index: number): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[index % colors.length];
  }

  trackByProjectId(index: number, project: ProjectReport): string {
    return project.id;
  }

  trackByDate(index: number, day: DailyReport): string {
    return day.date.toISOString();
  }

  getProjectEntries(projectsObj: { [key: string]: number }) {
    const entries = Object.entries(projectsObj).map(([projectId, hours], idx) => {
      const project = this.availableProjects.find(p => p.id === projectId);
      return {
        id: projectId,
        name: project ? project.name : 'Unbekannt',
        hours,
        color: this.getProjectColor(idx)
      };
    });
    return entries;
  }


}

