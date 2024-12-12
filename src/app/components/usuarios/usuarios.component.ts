import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  currentUser: User | null = null;

  constructor(
    private db: DatabaseService,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
    this.currentUser = await this.authService.readAuthUser();
  }

  async cargarUsuarios() {
    this.usuarios = await this.db.readUsers();
  }

  async eliminarUsuario(userName: string) {
    if (this.currentUser?.userName === 'admin' && userName === 'admin') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No puedes eliminar tu propia cuenta de administrador',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.db.deleteByUserName(userName);
            await this.cargarUsuarios();
          }
        }
      ]
    });

    await alert.present();
  }
}