import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterModule],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css'
})
export class ProductListPageComponent implements OnInit {
  private cartService = inject(CartService);
  products$ = this.cartService.products$;

  hoverMessages: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.cartService.fetchProducts().subscribe();
  }

  increaseAmount(product: Product) {
    this.cartService.increaseAmount(product);
  }

  decreaseAmount(product: Product) {
    this.cartService.decreaseAmount(product);
  }

  updateInCartAmount(product: Product, event: Event) {
    this.cartService.updateInCartAmount(product, event);
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
  }

  trackByUid(index: number, product: Product) {
    return product.uid!;
  }

  showHoverMessage(product: Product) {
    if (product.amountInCart === 0 && product.minOrderAmount > 1) {
      this.hoverMessages[product.uid!] = true;
    }
  }

  hideHoverMessage(product: Product) {
    this.hoverMessages[product.uid!] = false;
  }
}
