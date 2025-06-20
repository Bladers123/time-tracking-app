import { Component } from '@angular/core';
import { TimerEntry } from '../../../shared/interfaces/timer-entry.interface';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-timer-entry',
  imports: [CommonModule],
  templateUrl: './timer-entry.html',
  styleUrl: './timer-entry.scss'
})



export class TimerEntryComponent {
  isRunning = false;
  startTime: Date | null = null;
  endTime: Date | null = null;
  entries: TimerEntry[] = []; // <-- Richtiger Typ

  startStopTimer() {
    if (!this.isRunning) {
      this.startTime = new Date();
      this.endTime = null;
      this.isRunning = true;
    } else {
      this.endTime = new Date();
      this.isRunning = false;
      if (this.startTime && this.endTime) {
        this.addEntry(this.startTime, this.endTime);
      }
    }
  }

  resetTimer() {
    this.startTime = null;
    this.endTime = null;
    this.isRunning = false;
  }

  addEntry(start: Date, end: Date) {
    this.entries.unshift({
      date: start.toLocaleDateString(),
      start: start.toLocaleTimeString(),
      end: end.toLocaleTimeString()
    });
    this.resetTimer();
  }
}
