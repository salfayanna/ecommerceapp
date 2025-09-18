import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _products = new BehaviorSubject<Product[]>([]);
  products$ = this._products.asObservable();

  constructor(private apiService: ApiService) {}

  get productsValue(): Product[] {
    return this._products.value;
  }

  setProducts(products: Product[]) {
    this._products.next(products);
  }

  /** Fetch products once; assign unique uid to each product */
  fetchProducts(): Observable<Product[]> {
    if (this.productsValue.length) return of(this.productsValue);

    return this.apiService.getData().pipe(
      tap(res => {
        const merged: Product[] = res.map((apiProduct, index) => {
          return {
            ...apiProduct,
            uid: `${apiProduct.id}-${index}`, // unique key
            amountInCart: 0,
            availableAmount: apiProduct.availableAmount ?? 0,
            minOrderAmount: apiProduct.minOrderAmount ?? 1
          };
        });
        this.setProducts(merged);
      })
    );
  }

  /** Update a product immutably using uid */
  updateProduct(updated: Product) {
    const newProducts = this.productsValue.map(p =>
      p.uid === updated.uid ? updated : p
    );
    this._products.next(newProducts);
  }

  /** Increase amount in cart */
  increaseAmount(product: Product) {
    if (product.amountInCart < product.amountInCart + product.availableAmount) {
      const maxIncrement = Math.min(product.minOrderAmount, product.availableAmount);
      const increment = product.amountInCart < product.minOrderAmount ? maxIncrement : 1;

      const updated: Product = {
        ...product,
        amountInCart: product.amountInCart + increment,
        availableAmount: product.availableAmount - increment
      };
      this.updateProduct(updated);
    }
  }

  /** Decrease amount in cart */
  decreaseAmount(product: Product) {
    if (product.amountInCart > 0) {
      const decrement = product.amountInCart <= product.minOrderAmount ? product.amountInCart : 1;
      const updated: Product = {
        ...product,
        amountInCart: product.amountInCart - decrement,
        availableAmount: product.availableAmount + decrement
      };
      this.updateProduct(updated);
    }
  }

  /** Update amount from input */
  updateInCartAmount(product: Product, value: number) {
    if (isNaN(value) || value < 0) value = 0;

    const max = product.amountInCart + product.availableAmount;
    if (value > max) value = max;

    const diff = value - product.amountInCart;
    const updated: Product = {
      ...product,
      amountInCart: value,
      availableAmount: product.availableAmount - diff
    };
    this.updateProduct(updated);
  }

  /** Remove product from cart */
  removeFromCart(product: Product) {
    const updated: Product = {
      ...product,
      amountInCart: 0,
      availableAmount: product.amountInCart + product.availableAmount
    };
    this.updateProduct(updated);
  }
}
