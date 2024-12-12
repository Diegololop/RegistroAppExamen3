import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { WelcomeComponent } from './components/welcome/welcome.component'; // Importa tu componente
import { RouterModule, Routes } from '@angular/router';

const routes:Routes=[
  { path: 'welcome', component: WelcomeComponent },

];
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, WelcomeComponent, RouterModule], // Agrega WelcomeComponent a las importaciones
})
export class AppComponent {
  constructor() {}
}
