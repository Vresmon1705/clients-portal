import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private cart: Product[] = [];

  getCart(): Product[] {
    return this.cart;
  }

  addToCart(product: Product) {
    const existingProduct = this.cart.find(item => item.id === product.id);
    
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.cart.push({...product});
    }
  }

  updateQuantity(productId: number, quantity: number) {
    const product = this.cart.find(item => item.id === productId);
    if (product) {
      product.quantity = quantity;
    }
  }

  removeFromCart(index: number) {
    if (index > -1 && index < this.cart.length) {
      this.cart.splice(index, 1);
    }
  }

  clearCart() {
    this.cart = [];
  }

}
