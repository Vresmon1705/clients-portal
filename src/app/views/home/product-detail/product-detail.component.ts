import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
    private cartService: ShoppingCartService
  ) {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
  }

  ngOnInit(): void {
    //  this.route.paramMap.subscribe(params => {
    //    const productId = Number(params.get('id'));
    //    if (productId) {
    //      const product = this.articleService.getProductById(productId);
    //      if (product) {
    //        this.article = product;
    //        this.similarArticles = this.articleService.getSimilarProducts(productId) ?? [];
    //      } else {
    //        console.error('Producto no encontrado');
    //      }
    //    }
    //  });
  }
  
  loadCart(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  addToCart(article: IArticle | undefined): void {
    if (article) {
      const articleToAdd = { ...article, quantity: this.quantity };
      this.cartService.addToCart(articleToAdd);
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
}