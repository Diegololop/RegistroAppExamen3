import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { logOutOutline, qrCodeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class HeaderComponent {
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  
  @Output() headerClick = new EventEmitter<string>();

  constructor(private navCtrl: NavController, private authService: AuthService,     private animationController: AnimationController,
  ) { 
    addIcons({ logOutOutline, qrCodeOutline });
  }

  sendClickEvent(buttonName: string) {
    this.headerClick.emit(buttonName);
  }

  logout() {
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController.create()
        .addElement(this.itemTitulo.nativeElement)
        .duration(7000)
        .iterations(Infinity) 
        .keyframes([
          { offset: 0, transform: 'translateX(0%)', opacity: 0 },
          { offset: 0.5, transform: 'translateX(0)', opacity: 1 },
          { offset: 1, transform: 'translateX(100%)', opacity: 0 } 
        ]);

      animation.play();
    }
  }
}
