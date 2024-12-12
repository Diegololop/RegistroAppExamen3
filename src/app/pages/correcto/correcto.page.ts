import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { User } from '../../model/user'; // Asegúrate de que la ruta sea correcta
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [
    IonIcon, 
    IonButton, 
    IonCardContent, 
    IonCardTitle, 
    IonCardHeader, 
    IonCard, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    TranslateModule]
})
export class CorrectoPage implements OnInit {
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  user: User | undefined; // Define la variable para el usuario
  password: string | undefined; // Define la variable para la contraseña

  constructor(private router: Router) { }
  

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user']; // Obtener el usuario pasado

    if (this.user) {
      this.password = this.user.password; // Captura la contraseña del usuario
    } else {
      console.log('No se encontró información del usuario.');
    }
  }
  
  GoToLogin() {
    this.router.navigate(['/login']); // Reemplaza '/login' con la ruta correcta
  }
}
