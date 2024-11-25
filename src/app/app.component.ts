import { Component, computed, effect, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
 
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth.status.enum';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
 
  private authService = inject(AuthService);
  private router = inject(Router);
 
  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatusRead() === AuthStatus.checking) {
      return false;
    }
 
    return true;
  });
 
  public authStatusChangedEffect = effect(() => {
 
    switch (this.authService.authStatusRead()) {
 
      case AuthStatus.checking:
        return;
 
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/home/shopping');
        return;
 
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/login');
        return;
 
    }
 
  });
 
}