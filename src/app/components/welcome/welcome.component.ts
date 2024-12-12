import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { IonButton } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import jsQR, { QRCode } from 'jsqr';
import { Capacitor } from '@capacitor/core';
import { FooterComponent } from '../footer/footer.component';
import { ScannerService } from 'src/app/services/scanner.service';
import { Asistencia } from 'src/app/model/asistencia';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [IonButton, TranslateModule]
})
export class WelcomeComponent implements OnInit {

  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(FooterComponent) footer!: FooterComponent;

  componenteSeleccionado = 'welcome';
  qrData: string = '';
  mediaStream: MediaStream | null = null; // Almacena el flujo de medios
  user: User = new User();
  public escaneando = false;

  constructor(private auth: AuthService, private router: Router,
    private authService: AuthService, private scanner : ScannerService
  ) { 
    this.auth.authUser.subscribe((user) => {
      console.log(user);
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit() {}


  cerrarSesion() {
    // Lógica para cerrar sesión
    this.authService.logout(); // Redirige al usuario a la página de login
  }

  public async comenzarEscaneoQR() {
    if (this.esDispositivoMovil()) {
      try {
        // Usa ScannerService en dispositivos móviles
        const qrData = await this.scanner.scan();
        
        if (qrData) {
          this.escaneando = false;
          this.scanned.emit(qrData); 
          this.showasistenciaComponent(qrData);
        }
      } catch (error) {
        console.error('Error al escanear QR en móvil:', error);
      }
    } else {
      // Usa getUserMedia para escaneo en el navegador
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      this.video.nativeElement.srcObject = this.mediaStream;
      this.video.nativeElement.setAttribute('playsinline', 'true');
      this.video.nativeElement.play();
      this.escaneando = true;
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  private esDispositivoMovil(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      console.log(qrCode.data)
      if (data !== '') {
        this.escaneando = false;
        this.detenerCamara();
        this.scanned.emit(qrCode.data);
        return true;
      }
    }
    return false;
  }

  stopQrScanning(): void {
    this.detenerCamara();
    this.stopped.emit();
  }

  ngOnDestroy() {
    this.detenerCamara();
  }

  detenerCamara() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detén todas las pistas de video
      this.mediaStream = null; // Limpia el flujo de medios
    }
  }

  showasistenciaComponent(qr: string){
    console.log('verificando qr',qr)
    if (qr === '') {
      this.footer.cambiarComponente('welcome');
      return;
    }
    if (Asistencia.isValidAsistenciaQrCode(qr, true)) {
      this.authService.qrCodeData.next(qr);
      console.log('qr valido:',qr)
      this.footer.cambiarComponente('miclase');
      console.log('aqui',qr)
    } else {
      this.footer.cambiarComponente('welcome');
    }
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }
  
}
