import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces/product';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, RouterModule],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css'
})
export class ProductListPageComponent implements OnInit {
  private apiService = inject(ApiService);
  productList: Product[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    if (!this.cartService.productsValue.length) {
      this.apiService.getData().subscribe(res => {
        const products = res.map(product => ({ ...product, amountInCart: 0 }));
        this.cartService.setProducts(products);
        this.productList = products;
      });
    } else {
      this.cartService.products$.subscribe(products => {
        this.productList = products;
      });
    }
  }

  increaseAmount(product: Product) {
    if (product.amountInCart < product.availableAmount) {
      if (product.amountInCart < product.minOrderAmount) {
        product.availableAmount -= product.amountInCart;
        product.amountInCart += product.minOrderAmount;
      } else {
        product.amountInCart++;
        product.availableAmount--;
      }
      this.cartService.updateProduct(product);
    }

  }

  decreaseAmount(product: Product) {
    if (product.amountInCart > 0) {
      if (product.amountInCart === product.minOrderAmount) {
        product.availableAmount += product.amountInCart;
        product.amountInCart = 0;

      } else {
        product.amountInCart--;
        product.availableAmount++;
      }
      this.cartService.updateProduct(product);
    }
  }

  updateInCartAmount(product: Product, event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.valueAsNumber;

    // Minimum is 0
    if (isNaN(value) || value < 0) {
      value = 0;
    }

    // Maximum is availableAmount + current amountInCart
    const max = product.availableAmount + product.amountInCart;
    if (value > max) {
      value = max;
    }

    // Update cart and availableAmount accordingly
    const difference = value - product.amountInCart;
    product.amountInCart = value;
    product.availableAmount -= difference;

    input.value = String(value);

    this.cartService.updateProduct(product);
  }

  removeFromCart(product: Product) {
    product.amountInCart = 0;
    this.cartService.updateProduct(product);
  }
}