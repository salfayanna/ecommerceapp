import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartList: Product[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.products$.subscribe(products => {
    this.cartList = products.filter(product => product.amountInCart > 0);
  });
  }

  increaseAmount(product: Product) {
    if (product.amountInCart < product.availableAmount) {
      product.amountInCart++;
      product.availableAmount--;
      this.cartService.updateProduct(product);
    }

  }

  decreaseAmount(product: Product) {
    if (product.amountInCart > 0) {
      product.amountInCart--;
      product.availableAmount++;
      this.cartService.updateProduct(product);
    }
  }

  updateInCartAmount(product: Product, event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.valueAsNumber;

    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > product.availableAmount) {
      value = product.availableAmount;
    }

    product.amountInCart = value;
    input.value = String(value);

    this.cartService.updateProduct(product);
  }

  removeFromCart(product: Product) {
    product.amountInCart = 0;
    this.cartService.updateProduct(product);
  }

}
