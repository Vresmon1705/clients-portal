import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
//import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../auth/services/auth.service';
import { ShoppingCartService } from '../../auth/services/shopping-cart.service';
import { IArticle } from '../../auth/interfaces/article';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatToolbarModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  constructor(
    private authService: AuthService,
    private cartService: ShoppingCartService,
    private router: Router) { }

  TwoLetters: string = '';
  isCartOpen = false;
  cart: IArticle[] = [];

  public user = computed(() => this.authService.currentUser());

  public roleUser = computed<string[]>(() => {
    const roles = this.authService.currentUserRole();
    return roles ?? [];
  });

  hasRole(rol: string): boolean {
    return this.roleUser().includes(rol);
  }

  disabled: boolean = true;

  public dropdownToggle = false;

  public sidebaMenuKpi = [
    { label: 'Shopping', icon: 'bar_chart', url: 'home/shopping' },
  ]

  public isDrawerOpen = true;

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  toogleSesion() {
    this.dropdownToggle = !this.dropdownToggle;
  }

  onLogout() {
    this.authService.logout();
  }

  TwoLettersOfEmail(user: any): string {
    let name = user?.name || '';
    return name && name.length >= 2 ? name.substring(0, 2).toUpperCase() : '';
  }

  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const matDrawerContent = document.querySelector('.mat-drawer-content');
    const matDrawer = document.querySelector('.mat-drawer');
    if (this.isDarkMode) {
      matDrawerContent?.classList.add('dark-mode');
      matDrawer?.classList.add('dark-mode');
    } else {
      matDrawerContent?.classList.remove('dark-mode');
      matDrawer?.classList.remove('dark-mode');
    }
  }

  loadCart() {
    this.cart = this.cartService.getCart();
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart() {
    this.isCartOpen = false;
  }

  getTotal(): number {
    return this.cart.reduce((total, article) => total + article.basePrice * article.quantity, 0);
  }

  goToCart() {
    this.closeCart();
    this.router.navigate(['/home/shopping-cart']);
  }
}