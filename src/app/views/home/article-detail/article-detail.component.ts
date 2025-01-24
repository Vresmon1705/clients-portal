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

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private cartService: ShoppingCartService,
    private cdr: ChangeDetectorRef ) { }

  cart: IArticle[] = [];
  article!: IArticle;
  similarArticles: IArticle[] = [];
  quantity: number = 1;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const itemNumber = params.get('itemNumber');
      if (itemNumber) {
        this.articleService.getArticleById(itemNumber).subscribe(
          (data: IArticle) => {
            this.article = data;
          },
          (error) => {
            console.error('Error fetching article details', error);
          }
        );
      }
    });
  }

  loadSimilarArticles(): void {
    if (this.article?.catPrice) {
      this.articleService.getArticlesByCatPrice(this.article.catPrice).subscribe(
        (similarArticles) => {
          this.similarArticles = similarArticles.filter(
            article => article.id !== this.article!.id
          );
          this.cdr.detectChanges();
        },
        (error) => console.error('Error loading similar articles:', error)
      );
    }
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