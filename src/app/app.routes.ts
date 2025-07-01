import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ProjectComponent } from './pages/project/project';
import { TaskComponent } from './pages/task/task';
import { TimeEntryComponent } from './pages/time-entry/time-entry';
import { ReportComponent } from './pages/report/report';
import { LoginComponent } from './pages/login/login';


export const routes: Routes = [         
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'project/:id', component: ProjectComponent },
  { path: 'entries', component: TimeEntryComponent },
  { path: 'tasks', component: TaskComponent },
  { path: 'reports', component: ReportComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/dashboard' }
];
