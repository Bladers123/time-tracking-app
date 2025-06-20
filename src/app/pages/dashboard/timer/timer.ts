import { Component } from '@angular/core';
import { TimerService } from '../../../shared/services/timer.service';
import { CommonModule } from '@angular/common';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.html',
  styleUrls: ['./timer.scss'],
})
export class TimerComponent {
  isRunning$: Observable<boolean>;
  duration$: Observable<number>;

  constructor(public timerService: TimerService) {
    this.isRunning$ = timerService.isRunning$;
    this.duration$ = this.timerService.duration$;
  }

  toggleTimer() {
    this.isRunning$.pipe(take(1)).subscribe(isRunning => {
      if (isRunning) {
        this.timerService.stop();
      } else {
        this.timerService.start();
      }
    });
  }
}
