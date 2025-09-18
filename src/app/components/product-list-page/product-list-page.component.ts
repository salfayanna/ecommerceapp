import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule, RouterModule],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css'
})
export class ProductListPageComponent implements OnInit {
  private cartService = inject(CartService);
  products$ = this.cartService.products$;

  ngOnInit(): void {
    this.cartService.fetchProducts().subscribe();
  }

  increaseAmount(product: Product) {
    this.cartService.increaseAmount(product);
  }

  decreaseAmount(product: Product) {
    this.cartService.decreaseAmount(product);
  }

  updateInCartAmount(product: Product, value: number) {
    this.cartService.updateInCartAmount(product, value);
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
  }

  trackByUid(index: number, product: Product) {
    return product.uid;
  }
}
