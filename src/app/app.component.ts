import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./components/menu/menu.component";
import { MaterialModule } from './material/material.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-bank';
}
