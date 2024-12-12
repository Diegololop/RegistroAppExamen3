import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonToast } from '@ionic/angular/standalone';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule
  ]
})
export class CorreoPage implements OnInit {
  email: string = '';
  showToast: boolean = false;
  toastMessage: string = '';

  constructor(private dbService: DatabaseService, private router: Router) { }

  ngOnInit() {
    this.email = '';
  }

  async validarCorreo() {
    if (!this.email) {
      this.presentToast('Por favor, ingresa un correo electrónico.');
      return;
    }
  
    try {
      const user: User | undefined = await this.dbService.findUserByEmail(this.email);
      
      if (user) {
        this.router.navigate(['/pregunta'], { state: { user } });
      } else {
        this.router.navigate(['/incorrecto']);
      }
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      this.presentToast('Hubo un error al buscar el usuario.');
    }
  }

  presentToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }
  GoToLogin() {
    this.router.navigate(['/login']); // Reemplaza '/login' con la ruta correcta
  }
}
