import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IArticle } from '../../../auth/interfaces/article';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../../auth/services/shopping-cart.service';
import { ArticleService } from '../../../auth/services/article.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { SidebarCartComponent } from '../shopping/sidebar-cart/sidebar-cart.component';
import { HelpComponent } from '../../../shared/help/help.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    SidebarCartComponent,
    HelpComponent
  ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailComponent implements OnInit {
  article: IArticle | undefined;
  similarArticles: IArticle[] = [];
  cart: IArticle[] = [];
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private cartService: ShoppingCartService,
    private cdr: ChangeDetectorRef
  ) {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      console.log('Product ID:', productId);

      if (productId) {
        this.articleService.getProductById(productId).subscribe(
          (product) => {
            this.article = product;
            console.log('Producto cargado:', this.article);
            this.cdr.detectChanges(); 
            this.loadSimilarArticles();
          },
          (error) => {
            console.error('Error al cargar el producto:', error);
          }
        );
      }
    });
  }

  loadSimilarArticles(): void {
    if (this.article?.id) {
      this.articleService.getSimilarProducts(this.article.id).subscribe(
        (similarProducts) => {
          this.similarArticles = similarProducts;
          console.log('Productos similares cargados:', this.similarArticles);
        },
        (error) => {
          console.error('Error al cargar productos similares:', error);
        }
      );
    }
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }
  
  addToCart(): void {
    if (this.article) {
      const articleToAdd = { ...this.article, quantity: this.quantity };
      this.cartService.addToCart(articleToAdd);
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado al carrito',
        position: 'top-end',
        toast: true,
        timer: 1000,
        showConfirmButton: false
      });
    }
  }
}