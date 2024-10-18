import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpComponent { 
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openChatbot() {
    // Acción para abrir el Chatbot
    console.log('Abrir Chatbot');
  }

  openWhatsApp() {
    // Acción para abrir WhatsApp
    console.log('Abrir WhatsApp');
  }
}
