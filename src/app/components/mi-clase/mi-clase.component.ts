import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mi-clase',
  templateUrl: './mi-clase.component.html',
  styleUrls: ['./mi-clase.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule]
})
export class MiClaseComponent implements OnInit {
  private subs: Subscription;
  miclase: any;
  
  constructor(private authService: AuthService, private toastController: ToastController, private translate: TranslateService) { 
    this.subs = this.authService.qrCodeData.subscribe((qr) => {
      if (qr) {
        console.log('Datos QR recibidos:', qr);
        this.miclase = JSON.parse(qr);
      } else {
        console.log('No llegaron datos QR.');
        // Inicializar miclase con un objeto vacío o un objeto con la estructura esperada
        this.miclase = { bloqueInicio: 'No data' };
        this.showToast(this.translate.instant('NoQRDataToast'));
      }
    });
  }

  ngOnInit() {
  }

  cerrarSesion() {
    // Lógica para cerrar sesión
    this.authService.logout(); // Redirige al usuario a la página de login
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      color: 'danger'
    });
    toast.present();
  }
}
