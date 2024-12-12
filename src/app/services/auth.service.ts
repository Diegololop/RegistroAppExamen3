import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showAlertError, showToast } from 'src/app/tools/message-functions';
import { User } from '../model/user';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from './database.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storageAuthUserKey = 'AUTHENTICATED_USER';
  authUser = new BehaviorSubject<User | null>(null);
  isFirstLogin = new BehaviorSubject<boolean>(false);
  storageQrCodeKey = 'QR_CODE';
  qrCodeData = new BehaviorSubject<string | null>(null);
  componenteSeleccionado = new BehaviorSubject<string>('codigoqr');

  constructor(private router: Router,
     private db: DatabaseService,
      private storage: Storage,
      private toastController: ToastController) { }

  async initializeAuthService() {
    try {
      await this.storage.create();
    } catch (error) {
      showAlertError('AuthService.initializeAuthService', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      return Boolean(await this.readAuthUser());
    } catch (error) {
      showAlertError('AuthService.isAuthenticated', error);
      return false;
    }
  }

  async readAuthUser(): Promise<User | null> {
    try {
      const user = (await this.storage.get(this.storageAuthUserKey)) as User | null;
      this.authUser.next(user ?? null);
      return user;
    } catch (error) {
      showAlertError('AuthService.readAuthUser', error);
      return null;
    }
  }

  async saveAuthUser(user: User): Promise<User | null> {
    try {
      await this.storage.set(this.storageAuthUserKey, user);
      this.authUser.next(user);
      return user;
    } catch (error) {
      showAlertError('AuthService.saveAuthUser', error);
      return null;
    }
  }

  async deleteAuthUser(): Promise<boolean> {
    try {
      await this.storage.remove(this.storageAuthUserKey);
      this.authUser.next(null);
      return true;
    } catch (error) {
      showAlertError('AuthService.deleteAuthUser', error);
      return false;
    }
  }

  async login(userName: string, password: string): Promise<boolean> {
    try {
      const user = await this.db.findUser(userName, password);
  
      if (user) {
        const toast = await this.toastController.create({
          message: `¡Bienvenid@ ${user.firstName} ${user.lastName}!`,
          duration: 1000,
          position: 'middle'
        });
        toast.present();
  
        await this.saveAuthUser(user);
        this.isFirstLogin.next(true);
  
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
  
        return true;
      } else {
        const toast = await this.toastController.create({
          message: 'El correo o la contraseña son incorrectos.',
          duration: 1000,
          position: 'middle'
        });
        toast.present();
  
        return false;
      }
    } catch (error) {
      // Manejo de error en el AuthService
      // showAlertError('AuthService.login', error);
      return false;
    }
  }
  

  

  async logout(): Promise<boolean> {
    try {
      const user = await this.readAuthUser();

      if (user) {
        const toast = await this.toastController.create({
          message: `¡Hasta pronto ${user.firstName} ${user.lastName}!`,
          duration: 1000,
          position: 'middle'  // Centrado en la pantalla
        });
        toast.present();
        await this.deleteAuthUser();
      }

      await this.router.navigate(['/login']);
      return true;
    } catch (error) {
      showAlertError('AuthService.logout', error);
      return false;
    }
  }

  // async readQrFromStorage(): Promise<string | null> {
  //   try {
  //     const qrData = await this.storage.get(this.storageQrCodeKey) as string | null;
  //     this.qrCodeData.next(qrData);
  //     return qrData;
  //   } catch (error) {
  //     showAlertError('AuthService.readQrFromStorage', error);
  //     return null;
  //   }
  // }

  // async saveQrToStorage(qrData: string): Promise<string | null> {
  //   try {
  //     await this.storage.set(this.storageQrCodeKey, qrData);
  //     this.qrCodeData.next(qrData);
  //     return qrData;
  //   } catch (error) {
  //     showAlertError('AuthService.saveQrToStorage', error);
  //     return null;
  //   }
  // }

  // async deleteQrFromStorage(): Promise<boolean> {
  //   try {
  //     await this.storage.remove(this.storageQrCodeKey);
  //     this.qrCodeData.next(null);
  //     return true;
  //   } catch (error) {
  //     showAlertError('AuthService.deleteQrFromStorage', error);
  //     return false;
  //   }
  // }
}
