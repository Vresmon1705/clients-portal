import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    {
      id: 1, name: 'Bali Amarillo',
      description: 'Descripción del producto 1',
      price: 27231.58, 
      image: 'assets/images/image2.png',
      quantity: 1,
      images: ['url-imagen-3.jpg', 'url-imagen-4.jpg'],
      videos: ['url-video-2.mp4']
    },
    {
      id: 2, name: 'Alaska',
      description: 'Descripción del producto 2',
      price: 13863.16, 
      image: 'assets/images/image.png',
      quantity: 1,
      images: ['url-imagen-3.jpg', 'url-imagen-4.jpg'],
      videos: ['url-video-2.mp4']
    },
  ];

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getSimilarProducts(currentProductId: number): Product[] {
    return this.products.filter(product => product.id !== currentProductId).slice(0, 4);
  }

  getProducts(): Product[] {
    return this.products;
  }

}
