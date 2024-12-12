import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
    , LanguageComponent       // CGV-Lista de idiomas
  ]
})
export class LoginPage implements ViewWillEnter {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  userName: string;
  password: string;

  constructor(
      private router: Router,
      private translate: TranslateService,
      private authService: AuthService,
      private alertController: AlertController // CGV-Para mostrar alertas
  ) { 
    this.userName = 'atorres';
    this.password = '1234';
    addIcons({ colorWandOutline }); 
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  async ingresar() {
    const loginSuccessful = await this.authService.login(this.userName, this.password);
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Usuario o contraseña incorrectos',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  registerNewUser() {}

  recuperarContrasena() {
    this.router.navigate(['/correo']);
  }

  goToRoute(){
    this.router.navigate(['/map']);
  }

  registrarme() {
    this.router.navigate(['/registrarme']);
  }

  
}
