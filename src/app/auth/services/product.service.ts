import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    {
      id: 1, name: 'Producto 1',
      description: 'Descripción del producto 1',
      price: 100, image: 'path_to_image',
      quantity: 1,
      images: ['url-imagen-3.jpg', 'url-imagen-4.jpg'],
      videos: ['url-video-2.mp4']
    },
    {
      id: 2, name: 'Producto 2',
      description: 'Descripción del producto 2',
      price: 150, image: 'path_to_image',
      quantity: 1,
      images: ['url-imagen-3.jpg', 'url-imagen-4.jpg'],
      videos: ['url-video-2.mp4']
    },
    {
      id: 3, name: 'Producto 3',
      description: 'Descripción del producto 3',
      price: 300, image: 'path_to_image',
      quantity: 1,
      images: ['url-imagen-3.jpg', 'url-imagen-4.jpg'],
      videos: ['url-video-2.mp4']
    },
    {
      id: 4, name: 'Producto 4',
      description: 'Descripción del producto 4',
      price: 150, image: 'path_to_image',
      quantity: 1,
      images: ['url-imagen-3.jpg', 'url-imagen-4.jpg'],
      videos: ['url-video-2.mp4']
    },
    {
      id: 5, name: 'Producto 5',
      description: 'Descripción del producto 5',
      price: 500, image: 'path_to_image',
      quantity: 1,
      images: ['url-imagen-3.jpg', 'url-imagen-4.jpg'],
      videos: ['url-video-2.mp4']
    },
    {
      id: 6, name: 'Producto 6',
      description: 'Descripción del producto 6',
      price: 150, image: 'path_to_image',
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
