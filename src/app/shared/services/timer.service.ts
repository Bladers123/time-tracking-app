import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { TimerEntry } from '../interfaces/timer-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class TimerService implements OnDestroy {
  private isRunningSubject = new BehaviorSubject<boolean>(false);
  isRunning$ = this.isRunningSubject.asObservable();

  private startTime: Date | null = null;
  private endTime: Date | null = null;
  private durationSubject = new BehaviorSubject<number>(0); // ms
  duration$ = this.durationSubject.asObservable();

  private intervalSub: Subscription | null = null;

  private entriesSubject = new BehaviorSubject<TimerEntry[]>([]);
  entries$ = this.entriesSubject.asObservable();

  start() {
    if (this.isRunningSubject.value) return;
    this.startTime = new Date();
    this.endTime = null;
    this.durationSubject.next(0);
    this.isRunningSubject.next(true);

    this.intervalSub = interval(250).subscribe(() => {
      if (this.startTime) {
        const diff = new Date().getTime() - this.startTime.getTime();
        this.durationSubject.next(diff);
      }
    });
  }

  stop() {
    if (!this.isRunningSubject.value || !this.startTime) return;
    this.endTime = new Date();
    this.isRunningSubject.next(false);
    if (this.intervalSub) this.intervalSub.unsubscribe();
    if (this.startTime && this.endTime) {
      this.durationSubject.next(this.endTime.getTime() - this.startTime.getTime());
      this.addEntry(this.startTime, this.endTime);
    }
    this.resetTimerValues(false);
  }

  private resetTimerValues(resetDuration = true) {
    if (this.intervalSub) this.intervalSub.unsubscribe();
    this.isRunningSubject.next(false);
    this.startTime = null;
    this.endTime = null;
    if (resetDuration) this.durationSubject.next(0);
  }

  private addEntry(start: Date, end: Date) {
    const entry: TimerEntry = {
      date: start.toLocaleDateString(),
      start: start.toLocaleTimeString(),
      end: end.toLocaleTimeString()
    };
    this.entriesSubject.next([entry, ...this.entriesSubject.value]);
  }

  ngOnDestroy() {
    if (this.intervalSub) this.intervalSub.unsubscribe();
  }

  // Utility für die Komponente:
  formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
