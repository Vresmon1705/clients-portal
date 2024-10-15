import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    {
      id: 1, name: 'Producto 1',
      description: 'Su socio confiable, enfocado en ofrecer la más alta calidad y servicio. Nuvant atiende a los diferentes mercados a nivel mundial y se esfuerza constantemente por desarrollar nuevos productos de alta especificación técnica. Nuestros productos con su excelente desempeño y durabilidad, pueden ser utilizados en una amplia gama de aplicaciones, cumpliendo con los requisitos de los respectivos mercados. Nuestra mayor fortaleza es la relación con nuestros clientes junto a un equipo de personas altamente capacitadas que trabajan hacia la excelencia y los más altos estándares de calidad.',
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
  ];

  constructor() { }

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
