import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar";
import { FooterComponent } from "./shared/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent, FooterComponent] ,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'time-tracking-app';
}
