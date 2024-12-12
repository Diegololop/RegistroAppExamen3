import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/model/user';
import { EducationalLevel } from 'src/app/model/educational-level';
import { addIcons } from 'ionicons';
import { personAddOutline } from 'ionicons/icons';

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule]
})
export class RegistrarmePage {
  user: User = new User();
  repeticionPassword: string = '';
  niveles: EducationalLevel[] = [];
  
  constructor(
    private router: Router,
    private db: DatabaseService,
    private alertController: AlertController
  ) {
    this.inicializarUsuario();
    addIcons({ personAddOutline });
  }

  private inicializarUsuario() {
    this.user = new User();
    this.niveles = EducationalLevel.getLevels();
    this.user.educationalLevel = this.niveles[0];
    this.user.dateOfBirth = null!; // Cambiamos esto para que empiece vacío
    this.user.image = 'default-image.jpg';
  }

  private validarFecha(fecha: string): boolean {
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!regex.test(fecha)) return false;
    
    const [dia, mes, anio] = fecha.split('/').map(Number);
    const fechaObj = new Date(anio, mes - 1, dia);
    
    return fechaObj.getDate() === dia &&
           fechaObj.getMonth() === mes - 1 &&
           fechaObj.getFullYear() === anio;
  }

  async registrarUsuario() {
    if (!this.validarCampos()) {
      return;
    }

    // Validar formato de fecha
    const fechaStr = this.user.dateOfBirth as any as string;
    if (!this.validarFecha(fechaStr)) {
      await this.mostrarError('El formato de fecha debe ser DD/MM/AAAA');
      return;
    }

    if (this.user.password !== this.repeticionPassword) {
      await this.mostrarError('Las contraseñas no coinciden');
      return;
    }

    const existingUser = await this.db.readUser(this.user.userName);
    if (existingUser) {
      await this.mostrarError('El nombre de usuario ya existe');
      return;
    }

    try {
      const [dia, mes, anio] = (this.user.dateOfBirth as any as string).split('/').map(Number);
      this.user.dateOfBirth = new Date(anio, mes - 1, dia);
      
      await this.db.saveUser(this.user);
      await this.mostrarExito('Usuario registrado correctamente');
      this.router.navigate(['/login']);
    } catch (error) {
      await this.mostrarError('Error al registrar usuario');
    }
  }

  private validarCampos(): boolean {
    if (!this.user.userName || !this.user.password || !this.user.email || 
        !this.user.firstName || !this.user.lastName || !this.user.secretQuestion || 
        !this.user.secretAnswer || !this.user.dateOfBirth || !this.user.address) {
      this.mostrarError('Todos los campos son obligatorios');
      return false;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.mostrarError('El formato del correo electrónico no es válido');
      return false;
    }

    // Validar longitud mínima de contraseña
    if (this.user.password.length < 4) {
      this.mostrarError('La contraseña debe tener al menos 4 caracteres');
      return false;
    }

    return true;
  }

  private async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async mostrarExito(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  volver() {
    this.router.navigate(['/login']);
  }
}