import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonToast } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule
  ]
})
export class PreguntaPage implements OnInit {
  user: User | undefined;
  answer: string = '';
  showToast: boolean = false;
  toastMessage: string = '';
  translatedSecretQuestion: string = '';

  constructor(private router: Router, private translate: TranslateService) {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'] as User;
  }

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(['/correo']);
    }
    if (this.user && this.user.secretQuestion) {
      this.translatedSecretQuestion = this.translate.instant(this.user.secretQuestion);
    } else {
      this.translatedSecretQuestion = '';  // O cualquier valor por defecto
    }
  }

  verificarRespuesta() {
    if (!this.answer.trim()) {
      this.presentToast('Por favor, escribe una respuesta.');
      return;
    }

    if (this.answer === this.user?.secretAnswer) {
      this.router.navigate(['/correcto'], { state: { user: this.user } });
    } else {
      this.router.navigate(['/incorrecto']);
    }
  }

  presentToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }
  GoToLogin() {
    this.router.navigate(['/login']); // Reemplaza '/login' con la ruta correcta
  }

  ngOnChanges() {
    if (this.user && this.user.secretQuestion) {
      this.translatedSecretQuestion = this.translate.instant(this.user.secretQuestion);
    }
  }
}
