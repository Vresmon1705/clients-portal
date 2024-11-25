import { Injectable } from '@angular/core';
import { IArticle } from '../interfaces/article';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService{
 
  private cartSubject = new BehaviorSubject<IArticle[]>([]);
  cart$ = this.cartSubject.asObservable();
  private cart: IArticle[] = [];

  getCart(): IArticle[] {
    return this.cart;
  }

  addToCart(article: IArticle) {
    const existingProduct = this.cart.find(item => item.id === article.id);
    
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + (article.quantity || 1);
    } else {
      this.cart.push({ ...article, quantity: article.quantity || 1 });
    }
    this.cartSubject.next([...this.cart]); 
  }

  updateQuantity(articleId: string | number, quantity: number) {
    const article = this.cart.find(item => item.id === articleId.toString());
    if (article) {
      article.quantity = quantity;
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
    const totalItems = this.cart.reduce((total, article) => {
      return total + (article.quantity || 0);
    }, 0);
    return totalItems;
  }  

  getTotal(): number {
    return this.cart.reduce((total, article) => total + article.price * article.quantity, 0);
  }
}