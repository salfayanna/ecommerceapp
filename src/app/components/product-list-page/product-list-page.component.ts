import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RouterModule  } from '@angular/router';
import { Product } from '../../interfaces/product';


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

  ngOnInit(): void {
    this.apiService.getData().subscribe(res => {
      this.productList = res.map(product => ({
        ...product,
        amountInCart: 0
      }));
    });
  }

  increaseAmount(product: Product) {
    if (product.amountInCart < product.availableAmount) {
      product.amountInCart++;
      product.availableAmount--;
    }

  }

  decreaseAmount(product: Product) {
    if (product.amountInCart > 0) {
      product.amountInCart--;
      product.availableAmount++;
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
  }

  removeFromCart(product: Product) {
    product.amountInCart = 0;
  }

  // openModal() {
    // //open product info mondal window
  // }

  // Check if item is in cart, if true check amount in cart. 
  // Limit number to available amount. 
  // Save in cart data and pass to cart view.
}
