import { Injectable, NgZone } from '@angular/core';
import { showAlertError, showAlertYesNo, showToast } from '../tools/message-functions';
import { BarcodeFormat, BarcodeScanner, ScanResult } from '@capacitor-mlkit/barcode-scanning';
import { MessageEnum } from '../tools/message-enum';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(private readonly ngZone: NgZone) { }

  async scan(): Promise<string> {
    return await this.runGoogleBarcodeScanner();
  }

  private async runGoogleBarcodeScanner(): Promise<string> {
    try {
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(
        async (result) => {
          if (!result.available) 
            await BarcodeScanner.installGoogleBarcodeScannerModule();
        });

      if (!await BarcodeScanner.isSupported()) {
        return Promise.resolve('ERROR: Google Barcode Scanner no es compatible con este celular');
      }

      let status = await BarcodeScanner.checkPermissions();

      if (status.camera === 'denied') {
        status = await BarcodeScanner.requestPermissions();
      }
      
      if (status.camera === 'denied') {
        const resp = await showAlertYesNo(
          'No fue posible otorgar permisos a la cámara. ¿Quiere acceder a las opciones de configuración de la aplicación y darle permiso manualmente?'
        );
        if (resp === MessageEnum.YES) await BarcodeScanner.openSettings();
        return Promise.resolve('');
      }

      await BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
          });
        });
      });

      // Escanea el QR
      const { barcodes }: ScanResult = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode],
      });

      // Retorna el valor del QR sin mostrar el alert
      return Promise.resolve(barcodes[0].displayValue);
      
    } catch(error: any) {
      if (error.message.includes('canceled')) {
        showToast('El escaneo de QR fue cancelado');
        return Promise.resolve('');
      }

      showAlertError('runGoogleBarcodeScanner', error);
      return Promise.resolve('ERROR');
    }
  }

}
