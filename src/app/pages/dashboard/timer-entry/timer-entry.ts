import { CommonModule } from '@angular/common';
import { TimerEntry } from '../../../shared/interfaces/timer-entry.interface';
import { Component, OnInit } from '@angular/core';
import { TimerService } from '../../../shared/services/timer.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-timer-entry',
  imports: [CommonModule],
  templateUrl: './timer-entry.html',
  styleUrl: './timer-entry.scss'
})



export class TimerEntryComponent {
 entries$: Observable<TimerEntry[]>;

  constructor(private timerService: TimerService) {
    this.entries$ = this.timerService.entries$;
  }
}