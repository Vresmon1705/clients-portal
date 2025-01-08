import { Injectable } from '@angular/core';
import { IArticle } from '../interfaces/article';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private authService: AuthService) {
    this.loadCart();
  }

  private cartSubject = new BehaviorSubject<IArticle[]>([]);
  private cart: IArticle[] = [];
  cart$ = this.cartSubject.asObservable();

  private saveCart() {
    const userId = this.getCurrentUserId();
    if (userId) {
      const cartData = {
        items: this.cart,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartData));
    }
  }

  loadCart() {
    const userId = this.getCurrentUserId();
    if (userId) {
      const cartData = localStorage.getItem(`cart_${userId}`);
      if (cartData) {
        const { items, timestamp } = JSON.parse(cartData);
        const now = new Date().getTime();
        if (now - timestamp < 24 * 60 * 60 * 1000) {
          this.cart = items;
          this.cartSubject.next([...this.cart]);
        } else {
          this.clearCart();
        }
      } else {
        this.clearCart();
      }
    } else {
      this.clearCart();
    }
  }

  private getCurrentUserId(): string | null {
    const currentUser = this.authService.currentUser();
    return currentUser ? currentUser.taxIdentificationNumber : null;
  }

  getCart(): IArticle[] {
    return this.cart;
  }

  addToCart(article: IArticle) {
    const existingProduct = this.cart.find(item => item.id === article.id);

    if (existingProduct) {
      existingProduct.g_qPackingUnit = (existingProduct.quantity || 0) + (article.quantity || 1);
    } else {
      this.cart.push({ ...article, 
        quantity: article.quantity || 1, 
        staticPackingUnit: article.g_qPackingUnit });
    }
    this.cartSubject.next([...this.cart]);
    this.saveCart();
  }

  updateQuantity(articleId: string | number, quantity: number) {
    const article = this.cart.find(item => item.id === articleId.toString());
    if (article) {
      article.g_qPackingUnit = quantity < 1 ? 1 : quantity;
    }
    this.cartSubject.next([...this.cart]);
    this.saveCart();
  }

  removeFromCart(index: number) {
    if (index > -1 && index < this.cart.length) {
      this.cart.splice(index, 1);
    }
    this.cartSubject.next([...this.cart]);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.cartSubject.next([...this.cart]);
    this.saveCart();
  }

  getTotalItems(): number {
    return this.cart.reduce((total, article) => total + (article.quantity || 0), 0);
  }

  getTotal(): number {
    return this.cart.reduce((total, article) => total + article.basePrice * article.g_qPackingUnit, 0);
  }
}