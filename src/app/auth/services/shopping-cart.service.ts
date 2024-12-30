import { Injectable } from '@angular/core';
import { IArticle } from '../interfaces/article';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private cartSubject = new BehaviorSubject<IArticle[]>([]);
  private cart: IArticle[] = [];
  cart$ = this.cartSubject.asObservable();

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
  }

  updateQuantity(articleId: string | number, quantity: number) {
    const article = this.cart.find(item => item.id === articleId.toString());
    if (article) {
      article.g_qPackingUnit = quantity < 1 ? 1 : quantity;
    }
    this.cartSubject.next([...this.cart]);
  }

  removeFromCart(index: number) {
    if (index > -1 && index < this.cart.length) {
      this.cart.splice(index, 1);
    }
    this.cartSubject.next([...this.cart]);
  }

  clearCart() {
    this.cart = [];
    this.cartSubject.next([...this.cart]);
  }

  getTotalItems(): number {
    return this.cart.reduce((total, article) => total + (article.quantity || 0), 0);
  }

  getTotal(): number {
    return this.cart.reduce((total, article) => total + article.basePrice * article.g_qPackingUnit, 0);
  }
}