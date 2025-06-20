import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TimerEntryComponent } from "./timer-entry/timer-entry";
import { TimerComponent } from './timer/timer';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TimerEntryComponent, TimerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {

}
