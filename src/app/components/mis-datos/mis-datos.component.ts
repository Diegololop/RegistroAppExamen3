import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { showAlert, showToast } from 'src/app/tools/message-functions';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, DatePipe, TranslateModule]
})
export class MisDatosComponent implements OnInit {

  user = new User();
  repeticionPassword = '';
  router: any;

  constructor(private authService: AuthService, private bd: DatabaseService) {}

  ngOnInit() {
    this.authService.authUser.subscribe((user) => {
      this.user = user ? user : new User();
      this.repeticionPassword = user ? user.password : '';
    });
  }

  validarCampo(nombreCampo: string, valor: string): boolean {
    if (valor.trim() === '') {
      showAlert(`Debe ingresar un valor para el campo "${nombreCampo}".`);
      return false;
    }
    return true;
  }

  cerrarSesion() {
    // Lógica para cerrar sesión
    this.authService.logout(); // Redirige al usuario a la página de login
  }


  async actualizarPerfil() {
    if (!this.validarCampo('nombre', this.user.firstName)) return;
    if (!this.validarCampo('apellidos', this.user.lastName)) return;
    if (!this.validarCampo('correo', this.user.email)) return;
    if (!this.validarCampo('pregunta secreta', this.user.secretQuestion)) return;
    if (!this.validarCampo('respuesta secreta', this.user.secretAnswer)) return;
    if (!this.validarCampo('contraseña', this.user.password)) return;
    if (this.user.password !== this.repeticionPassword) {
      showAlert('Las contraseñas escritas deben ser iguales.');
      return;
    }
    await this.bd.saveUser(this.user);
    this.authService.saveAuthUser(this.user);
    showToast('Sus datos fueron actualizados');
  }

  logout() {
    this.authService.logout();
  }

}
