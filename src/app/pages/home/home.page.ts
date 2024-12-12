import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone'
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { Asistencia } from 'src/app/model/asistencia';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MisDatosComponent } from 'src/app/components/mis-datos/mis-datos.component';
import { MiClaseComponent } from 'src/app/components/mi-clase/mi-clase.component';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TranslateModule, 
    IonContent,
    HeaderComponent, 
    FooterComponent,
    WelcomeComponent,
    ForumComponent,
    MisDatosComponent,
    MiClaseComponent,
    UsuariosComponent
  ],
})
export class HomePage {
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'welcome';
  user: User = new User();

  constructor(
    private auth: AuthService, 
    private scanner: ScannerService,
    private authService: AuthService, 
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.changeComponent('welcome');
  }

  async headerClick(button: string) {
    if (button === 'scan' && Capacitor.getPlatform() === 'web')
      this.selectedComponent = 'qrwebscanner';

    if (button === 'scan' && Capacitor.getPlatform() !== 'web')
      this.showDinoComponent(await this.scanner.scan());
  }

  webQrScanned(qr: string) {
    this.showDinoComponent(qr);
  }

  webQrStopped() {
    this.changeComponent('welcome');
  }

  showDinoComponent(qr: string) {
    if (Asistencia.isValidAsistenciaQrCode(qr)) {
      this.auth.qrCodeData.next(qr);
      this.changeComponent('mi-clase');
      return;
    }
    
    this.changeComponent('welcome');
  }

  footerClick(button: string) {
    this.selectedComponent = button;
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }

  ngOnInit() {
    this.router.navigate(['home']);
  }
}