import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimerEntryComponent } from "./pages/dashboard/timer-entry/timer-entry";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TimerEntryComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'time-tracking-app';
}
