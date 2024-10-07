import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import { Product } from '../../../auth/interfaces/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingComponent { 

  
  constructor(private cartService: ShoppingCartService) {}


  products = [
    {
      id: 1,
      name: 'Producto 1',
      description: 'Descripción del Producto 1',
      price: 100,
      image: 'image-url-1',
      quantity: 1 
    },
    {
      id: 2,
      name: 'Producto 2',
      description: 'Descripción del Producto 2',
      price: 200,
      image: 'image-url-2',
      quantity: 1
    }
  ];

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    console.log('Producto añadido al carrito:', product); 
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Producto agregado al carrito"
    });
  }
}
