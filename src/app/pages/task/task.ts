import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { FormsModule } from '@angular/forms';





interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  projectName: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: Date;
  createdDate: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  subtasks: Subtask[];
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdDate: Date;
}

interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
}


@Component({
  selector: 'app-task',
  imports: [CommonModule, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './task.html',
  styleUrl: './task.scss'
})



export class TaskComponent implements OnInit {

  // Task management
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedTask: Task | null = null;

  // Filters
  selectedStatus = 'all';
  selectedProject = 'all';
  selectedPriority = 'all';
  selectedAssignee = 'all';
  searchQuery = '';
  showOverdueOnly = false;

  // View options
  viewMode: 'list' | 'kanban' | 'calendar' = 'list';
  sortBy: 'dueDate' | 'priority' | 'created' | 'title' = 'dueDate';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Statistics
  taskStats: TaskStats = {
    total: 0,
    todo: 0,
    inProgress: 0,
    review: 0,
    done: 0,
    overdue: 0,
    dueToday: 0,
    dueThisWeek: 0
  };

  // Available options
  availableProjects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'API Development' },
    { id: '4', name: 'Database Migration' }
  ];

  availableAssignees = [
    'Max Mustermann',
    'Anna Schmidt',
    'Tom Weber',
    'Lisa Müller'
  ];

  statusOptions = [
    { value: 'todo', label: 'Zu erledigen', color: '#64748b' },
    { value: 'in_progress', label: 'In Bearbeitung', color: '#3b82f6' },
    { value: 'review', label: 'Review', color: '#f59e0b' },
    { value: 'done', label: 'Erledigt', color: '#10b981' }
  ];

  priorityOptions = [
    { value: 'low', label: 'Niedrig', color: '#64748b' },
    { value: 'medium', label: 'Mittel', color: '#3b82f6' },
    { value: 'high', label: 'Hoch', color: '#f59e0b' },
    { value: 'urgent', label: 'Dringend', color: '#ef4444' }
  ];

  // Modal states
  showTaskModal = false;
  showCreateModal = false;
  isEditMode = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
    this.calculateStats();
    this.applyFilters();
  }

  // Data loading
  private loadTasks(): void {
    // Beispiel-Daten generieren
    this.tasks = [
      {
        id: '1',
        title: 'Homepage Design überarbeiten',
        description: 'Das aktuelle Design der Homepage entspricht nicht mehr den modernen Standards und muss überarbeitet werden.',
        projectId: '1',
        projectName: 'Website Redesign',
        status: 'in_progress',
        priority: 'high',
        assignee: 'Max Mustermann',
        dueDate: new Date(2024, 11, 15),
        createdDate: new Date(2024, 10, 20),
        estimatedHours: 16,
        actualHours: 8,
        tags: ['design', 'frontend', 'ui'],
        subtasks: [
          { id: '1-1', title: 'Wireframes erstellen', completed: true, createdDate: new Date(2024, 10, 21) },
          { id: '1-2', title: 'Mockups designen', completed: true, createdDate: new Date(2024, 10, 22) },
          { id: '1-3', title: 'Responsive Design', completed: false, createdDate: new Date(2024, 10, 23) }
        ]
      },
      {
        id: '2',
        title: 'API Endpoints dokumentieren',
        description: 'Alle neuen API Endpoints müssen vollständig dokumentiert werden.',
        projectId: '3',
        projectName: 'API Development',
        status: 'todo',
        priority: 'medium',
        assignee: 'Anna Schmidt',
        dueDate: new Date(2024, 11, 20),
        createdDate: new Date(2024, 10, 18),
        estimatedHours: 8,
        tags: ['documentation', 'api'],
        subtasks: [
          { id: '2-1', title: 'Endpoint Liste erstellen', completed: false, createdDate: new Date(2024, 10, 19) },
          { id: '2-2', title: 'Swagger Dokumentation', completed: false, createdDate: new Date(2024, 10, 19) }
        ]
      },
      {
        id: '3',
        title: 'Mobile App Testing',
        description: 'Umfassende Tests der Mobile App auf verschiedenen Geräten durchführen.',
        projectId: '2',
        projectName: 'Mobile App',
        status: 'review',
        priority: 'urgent',
        assignee: 'Tom Weber',
        dueDate: new Date(2024, 11, 10),
        createdDate: new Date(2024, 10, 15),
        estimatedHours: 12,
        actualHours: 10,
        tags: ['testing', 'mobile', 'qa'],
        subtasks: [
          { id: '3-1', title: 'iOS Testing', completed: true, createdDate: new Date(2024, 10, 16) },
          { id: '3-2', title: 'Android Testing', completed: true, createdDate: new Date(2024, 10, 17) },
          { id: '3-3', title: 'Bug Report erstellen', completed: false, createdDate: new Date(2024, 10, 18) }
        ]
      },
      {
        id: '4',
        title: 'Datenbank Migration abschließen',
        description: 'Die Migration der Legacy-Datenbank muss finalisiert werden.',
        projectId: '4',
        projectName: 'Database Migration',
        status: 'done',
        priority: 'high',
        assignee: 'Lisa Müller',
        dueDate: new Date(2024, 10, 30),
        createdDate: new Date(2024, 10, 1),
        completedDate: new Date(2024, 10, 28),
        estimatedHours: 20,
        actualHours: 18,
        tags: ['database', 'migration', 'backend'],
        subtasks: [
          { id: '4-1', title: 'Schema Migration', completed: true, createdDate: new Date(2024, 10, 2) },
          { id: '4-2', title: 'Daten Migration', completed: true, createdDate: new Date(2024, 10, 10) },
          { id: '4-3', title: 'Testing & Validation', completed: true, createdDate: new Date(2024, 10, 20) }
        ]
      },
      {
        id: '5',
        title: 'Performance Optimierung',
        description: 'Die Ladezeiten der Website müssen verbessert werden.',
        projectId: '1',
        projectName: 'Website Redesign',
        status: 'todo',
        priority: 'low',
        dueDate: new Date(2024, 11, 25),
        createdDate: new Date(2024, 10, 25),
        estimatedHours: 6,
        tags: ['performance', 'optimization'],
        subtasks: []
      }
    ];
  }

  private calculateStats(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    this.taskStats = {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'todo').length,
      inProgress: this.tasks.filter(t => t.status === 'in_progress').length,
      review: this.tasks.filter(t => t.status === 'review').length,
      done: this.tasks.filter(t => t.status === 'done').length,
      overdue: this.tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done').length,
      dueToday: this.tasks.filter(t => t.dueDate && this.isSameDay(t.dueDate, today)).length,
      dueThisWeek: this.tasks.filter(t => t.dueDate && t.dueDate >= today && t.dueDate <= weekEnd).length
    };
  }

  // Filter and search
  applyFilters(): void {
    let filtered = [...this.tasks];

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === this.selectedStatus);
    }

    // Project filter
    if (this.selectedProject !== 'all') {
      filtered = filtered.filter(task => task.projectId === this.selectedProject);
    }

    // Priority filter
    if (this.selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === this.selectedPriority);
    }

    // Assignee filter
    if (this.selectedAssignee !== 'all') {
      filtered = filtered.filter(task => task.assignee === this.selectedAssignee);
    }

    // Overdue filter
    if (this.showOverdueOnly) {
      const today = new Date();
      filtered = filtered.filter(task => 
        task.dueDate && task.dueDate < today && task.status !== 'done'
      );
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'dueDate':
          const aDate = a.dueDate?.getTime() || Infinity;
          const bDate = b.dueDate?.getTime() || Infinity;
          comparison = aDate - bDate;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'created':
          comparison = b.createdDate.getTime() - a.createdDate.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return this.sortDirection === 'desc' ? -comparison : comparison;
    });

    this.filteredTasks = filtered;
  }

  // Task management
  createTask(): void {
    this.selectedTask = null;
    this.isEditMode = false;
    this.showCreateModal = true;
  }

  editTask(task: Task): void {
    this.selectedTask = { ...task };
    this.isEditMode = true;
    this.showCreateModal = true;
  }

  deleteTask(taskId: string): void {
    if (confirm('Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?')) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.calculateStats();
      this.applyFilters();
    }
  }

  duplicateTask(task: Task): void {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (Kopie)`,
      status: 'todo',
      createdDate: new Date(),
      completedDate: undefined,
      actualHours: undefined,
      subtasks: task.subtasks.map(st => ({
        ...st,
        id: `${Date.now()}-${st.id}`,
        completed: false,
        createdDate: new Date()
      }))
    };

    this.tasks.unshift(newTask);
    this.calculateStats();
    this.applyFilters();
  }

  updateTaskStatus(taskId: string, newStatus: Task['status']): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      if (newStatus === 'done') {
        task.completedDate = new Date();
      } else {
        task.completedDate = undefined;
      }
      this.calculateStats();
      this.applyFilters();
    }
  }

  toggleSubtask(taskId: string, subtaskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      const subtask = task.subtasks.find(st => st.id === subtaskId);
      if (subtask) {
        subtask.completed = !subtask.completed;
      }
    }
  }

  // View management
  setViewMode(mode: 'list' | 'kanban' | 'calendar'): void {
    this.viewMode = mode;
  }

  setSortBy(field: typeof this.sortBy): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  // Navigation
  navigateToProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }

  startTimer(task: Task): void {
    this.router.navigate(['/zeiten'], { 
      queryParams: { 
        projectId: task.projectId,
        taskDescription: task.title 
      } 
    });
  }

  // Utility functions
  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  getStatusColor(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.color : '#64748b';
  }

  getPriorityLabel(priority: string): string {
    const option = this.priorityOptions.find(opt => opt.value === priority);
    return option ? option.label : priority;
  }

  getPriorityColor(priority: string): string {
    const option = this.priorityOptions.find(opt => opt.value === priority);
    return option ? option.color : '#64748b';
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'done') return false;
    return task.dueDate < new Date();
  }

  isDueToday(task: Task): boolean {
    if (!task.dueDate) return false;
    return this.isSameDay(task.dueDate, new Date());
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getCompletionPercentage(task: Task): number {
    if (task.subtasks.length === 0) {
      return task.status === 'done' ? 100 : 0;
    }
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  trackBySubtaskId(index: number, subtask: Subtask): string {
    return subtask.id;
  }

  getTasksByStatus(statusValue: string): Task[] {
  return this.filteredTasks.filter(t => t.status === statusValue);
}

}

