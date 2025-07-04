import { CommonModule } from '@angular/common';
import { TimerEntry } from '../../../shared/interfaces/timer-entry.interface';
import { Component, OnInit } from '@angular/core';
import { TimerService } from '../../../shared/services/timer.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-project-entry',
  imports: [CommonModule],
  templateUrl: './project-entry.html',
  styleUrl: './project-entry.scss'
})



export class ProjectEntryComponent {
 entries$: Observable<TimerEntry[]>;

  constructor(private timerService: TimerService) {
    this.entries$ = this.timerService.entries$;
  }
}