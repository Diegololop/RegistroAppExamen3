// import { CommonModule } from '@angular/common';
// import { Component, ElementRef, Output, ViewChild, OnDestroy, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';
// import { EventEmitter } from '@angular/core';
// import jsQR, { QRCode } from 'jsqr';

// @Component({
//   selector: 'app-qrwebscanner',
//   templateUrl: './qr-web-scanner.component.html',
//   styleUrls: ['./qr-web-scanner.component.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule],
// })
// export class QrWebScannerComponent implements OnDestroy, OnInit {

//   @ViewChild('video') private video!: ElementRef;
//   @ViewChild('canvas') private canvas!: ElementRef;
//   @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
//   @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

//   qrData: string = '';
//   mediaStream: MediaStream | null = null; // Almacena el flujo de medios

//   constructor() { }
  
//   ngOnInit() {
//     this.startQrScanningForWeb(); // Iniciar escaneo al cargar el componente
//   }


//   async startQrScanningForWeb() {
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then(stream => {
//         this.video.nativeElement.srcObject = stream;
//         this.video.nativeElement.play();
//       })
//       .catch(err => {
//         console.error("Error al acceder a la cámara: ", err);
//       });
//   }

//   async verifyVideo() {
//     if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
//       if (this.getQrData()) return;
//       requestAnimationFrame(this.verifyVideo.bind(this));
//     } else {
//       requestAnimationFrame(this.verifyVideo.bind(this));
//     }
//   }

//   getQrData(): boolean {
//     const w: number = this.video.nativeElement.videoWidth;
//     const h: number = this.video.nativeElement.videoHeight;
//     this.canvas.nativeElement.width = w;
//     this.canvas.nativeElement.height = h;
//     const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
//     context.drawImage(this.video.nativeElement, 0, 0, w, h);
//     const img: ImageData = context.getImageData(0, 0, w, h);
//     let qrCode: QRCode  | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
//     if (qrCode) {
//       const data = qrCode.data;
//       if (data !== '') {
//         this.stopCamera();
//         this.scanned.emit(qrCode.data);
//         return true;
//       }
//     }
//     return false;
//   }

//   stopQrScanning(): void {
//     this.stopCamera();
//     this.stopped.emit();
//   }

//   ngOnDestroy() {
//     this.stopCamera();
//   }

//   stopCamera() {
//     if (this.mediaStream) {
//       this.mediaStream.getTracks().forEach(track => track.stop()); // Detén todas las pistas de video
//       this.mediaStream = null;
//     }
//   }
  
// }
