import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService{
  private cartSubject = new BehaviorSubject<Product[]>([]);
  cart$ = this.cartSubject.asObservable(); 
  private cart: Product[] = [];

  getCart(): Product[] {
    return this.cart;
  }

  addToCart(product: Product) {
    const existingProduct = this.cart.find(item => item.id === product.id);
    
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.cart.push({ ...product });
    }
    
    this.cartSubject.next([...this.cart]); 
  }

  updateQuantity(productId: number, quantity: number) {
    const product = this.cart.find(item => item.id === productId);
    if (product) {
      product.quantity = quantity;
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
}