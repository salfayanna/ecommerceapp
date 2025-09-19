import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartList: Product[] = [];
  private cartService = inject(CartService);

  ngOnInit() {
    this.cartService.products$.subscribe(products => {
      this.cartList = products.filter(product => product.amountInCart > 0);
    });
  }

  increaseAmount(product: Product) {
    this.cartService.increaseAmount(product);
  }

  decreaseAmount(product: Product) {
    this.cartService.decreaseAmount(product);
  }

  updateInCartAmount(product: Product, event: Event) {
    const input = event.target as HTMLInputElement;
    this.cartService.updateInCartAmount(product, event);
    input.value = String(product.amountInCart);
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
  }

  get cartTotal(): number {
    return this.cartList.reduce(
      (sum, product) => sum + product.price * product.amountInCart,
      0
    );
  }
}
