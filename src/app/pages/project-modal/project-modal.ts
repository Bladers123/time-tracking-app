import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';



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

interface StatusFilter {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.scss'
})



export class ProjectModalComponent implements OnInit, OnChanges {
  // Input Properties - Diese werden von der Navbar übergeben
  @Input() isOpen: boolean = false;
  @Input() projects: Project[] = [];

  // Output Events - Diese werden an die Navbar zurückgesendet
  @Output() onClose = new EventEmitter<void>();
  @Output() onProjectSelect = new EventEmitter<Project>();
  @Output() onStartTimer = new EventEmitter<Project>();
  @Output() onCreateNew = new EventEmitter<void>();

  // Interne Zustandsvariablen
  searchTerm: string = '';
  activeFilter: string = 'all';
  filteredProjects: Project[] = [];

  // Filter-Konfiguration
  statusFilters: StatusFilter[] = [
    { value: 'all', label: 'Alle', icon: 'icon-folder' },
    { value: 'active', label: 'Aktiv', icon: 'icon-play' },
    { value: 'paused', label: 'Pausiert', icon: 'icon-pause' },
    { value: 'completed', label: 'Abgeschlossen', icon: 'icon-check' }
  ];

  ngOnInit(): void {
    this.updateFilteredProjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] || changes['isOpen']) {
      this.updateFilteredProjects();
    }
  }

  // Modal-Steuerung
  closeModal(): void {
    this.onClose.emit();
  }

  onOverlayClick(): void {
    this.closeModal();
  }

  // Projekt-Aktionen
  selectProject(project: Project): void {
    this.onProjectSelect.emit(project);
  }

  viewProjectDetails(project: Project): void {
    // Projekt-Details anzeigen (gleiche Aktion wie selectProject)
    this.selectProject(project);
  }

  startProjectTimer(project: Project): void {
    this.onStartTimer.emit(project);
  }

  createNewProject(): void {
    this.onCreateNew.emit();
  }

  // Such- und Filter-Funktionen
  onSearchChange(): void {
    this.updateFilteredProjects();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.updateFilteredProjects();
  }

  setFilter(filterValue: string): void {
    this.activeFilter = filterValue;
    this.updateFilteredProjects();
  }

  private updateFilteredProjects(): void {
    let filtered = [...this.projects];

    // Status-Filter anwenden
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(project => project.status === this.activeFilter);
    }

    // Such-Filter anwenden
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchLower) ||
        project.client?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower)
      );
    }

    this.filteredProjects = filtered;
  }

  // Utility-Methoden
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

  getFilterCount(filterValue: string): number {
    if (filterValue === 'all') {
      return this.projects.length;
    }
    return this.projects.filter(project => project.status === filterValue).length;
  }

  getFilterLabel(filterValue: string): string {
    const filter = this.statusFilters.find(f => f.value === filterValue);
    return filter ? filter.label : 'Unbekannt';
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  // Statistik-Methoden für Footer
  getTotalHours(): number {
    return this.projects.reduce((total, project) => total + project.totalHours, 0);
  }

  getWeeklyHours(): number {
    return this.projects
      .filter(project => project.status === 'active')
      .reduce((total, project) => total + project.weeklyHours, 0);
  }

  getActiveProjectsCount(): number {
    return this.projects.filter(project => project.status === 'active').length;
  }

  getPausedProjectsCount(): number {
    return this.projects.filter(project => project.status === 'paused').length;
  }

  getCompletedProjectsCount(): number {
    return this.projects.filter(project => project.status === 'completed').length;
  }

  // Erweiterte Utility-Methoden
  getProjectsByStatus(status: string): Project[] {
    return this.projects.filter(project => project.status === status);
  }

  getAverageProgress(): number {
    if (this.projects.length === 0) return 0;
    const totalProgress = this.projects.reduce((sum, project) => sum + project.progressPercentage, 0);
    return Math.round(totalProgress / this.projects.length);
  }

  getProjectsNearDeadline(days: number = 7): Project[] {
    const now = new Date();
    const deadline = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

    return this.projects.filter(project => {
      if (!project.endDate || project.status === 'completed') return false;
      return project.endDate <= deadline;
    });
  }

  isProjectOverdue(project: Project): boolean {
    if (!project.endDate || project.status === 'completed') return false;
    return project.endDate < new Date();
  }

  getProjectDuration(project: Project): number {
    if (!project.startDate || !project.endDate) return 0;
    const diffTime = project.endDate.getTime() - project.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Tage
  }

  getProjectRemainingDays(project: Project): number {
    if (!project.endDate || project.status === 'completed') return 0;
    const now = new Date();
    const diffTime = project.endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Tage
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatHours(hours: number): string {
    if (hours === 0) return '0h';
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    return `${hours}h`;
  }

  // Keyboard-Navigation
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  // Erweiterte Such-Funktionen
  highlightSearchTerm(text: string): string {
    if (!this.searchTerm.trim()) return text;

    const searchRegex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(searchRegex, '<mark>$1</mark>');
  }

  // Sortier-Funktionen
  sortProjectsByName(): Project[] {
    return [...this.filteredProjects].sort((a, b) => a.name.localeCompare(b.name));
  }

  sortProjectsByProgress(): Project[] {
    return [...this.filteredProjects].sort((a, b) => b.progressPercentage - a.progressPercentage);
  }

  sortProjectsByDeadline(): Project[] {
    return [...this.filteredProjects].sort((a, b) => {
      if (!a.endDate && !b.endDate) return 0;
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return a.endDate.getTime() - b.endDate.getTime();
    });
  }

  sortProjectsByHours(): Project[] {
    return [...this.filteredProjects].sort((a, b) => b.totalHours - a.totalHours);
  }

  // Export-Funktionen
  exportProjectsToCSV(): void {
    const headers = ['Name', 'Status', 'Client', 'Progress', 'Total Hours', 'Weekly Hours', 'Budget'];
    const csvContent = [
      headers.join(','),
      ...this.projects.map(project => [
        `"${project.name}"`,
        project.status,
        `"${project.client || ''}"`,
        `${project.progressPercentage}%`,
        project.totalHours,
        project.weeklyHours,
        project.budget || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projekte_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Validierungs-Methoden
  isValidProject(project: Project): boolean {
    return !!(
      project.id &&
      project.name &&
      project.status &&
      typeof project.progressPercentage === 'number' &&
      typeof project.totalHours === 'number' &&
      typeof project.weeklyHours === 'number'
    );
  }

  // Performance-Optimierung
  shouldShowProject(project: Project): boolean {
    // Zusätzliche Logik für Performance-Optimierung bei vielen Projekten
    return this.isValidProject(project);
  }

  // Accessibility-Hilfsmethoden
  getAriaLabel(project: Project): string {
    return `Projekt ${project.name}, Status: ${this.getStatusText(project.status)}, ${project.progressPercentage}% abgeschlossen`;
  }

  getStatusAriaLabel(status: string): string {
    const statusText = this.getStatusText(status);
    const count = this.getFilterCount(status);
    return `Filter ${statusText}, ${count} Projekte`;
  }
}



