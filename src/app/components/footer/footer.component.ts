import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  pawOutline, 
  pencilOutline, 
  qrCodeOutline, 
  documentLockOutline, 
  easelOutline,
  peopleOutline 
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonFooter, 
    IonToolbar, 
    IonSegment, 
    IonSegmentButton, 
    IonIcon
  ]
})
export class FooterComponent implements OnInit {
  componenteSeleccionado: string = 'codigoqr';
  selectedButton = 'welcome';
  @Output() footerClick = new EventEmitter<string>();
  isAdmin = false;

  constructor(private authService: AuthService) { 
    addIcons({
      homeOutline,
      easelOutline,
      pencilOutline,
      documentLockOutline,
      qrCodeOutline,
      pawOutline,
      peopleOutline
    });
  }

  async ngOnInit() {
    const user = await this.authService.readAuthUser();
    this.isAdmin = user?.userName === 'admin';
  }

  sendClickEvent($event: any) {
    this.footerClick.emit(this.selectedButton);
  }

  cambiarComponente(componenteSeleccionado: string) {
    this.componenteSeleccionado = componenteSeleccionado;
    this.authService.componenteSeleccionado.next(this.componenteSeleccionado);
  }
}