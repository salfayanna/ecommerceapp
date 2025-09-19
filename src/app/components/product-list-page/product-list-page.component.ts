import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces/product';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

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
  private sub = new Subscription();

  minOrderMessageId: string = '';
  maxAmountMessageId: string = '';

  ngOnInit(): void {
    this.sub.add(this.cartService.fetchProducts().subscribe());
    
    this.sub.add(this.cartService.messageUid$.subscribe(uid => {
      this.maxAmountMessageId = uid;
    }));
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

  tryShowMinOrderMessage(product: Product) {
    if (product.amountInCart < product.minOrderAmount && product.minOrderAmount > 1) {
      this.minOrderMessageId = product.uid!;
    }
  }

  hideMinOrderMessage() {
    this.minOrderMessageId = '';
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
