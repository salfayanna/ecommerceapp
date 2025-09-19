import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _products = new BehaviorSubject<Product[]>([]);
  products$ = this._products.asObservable();

  constructor(private apiService: ApiService) { }

  get productsValue(): Product[] {
    return this._products.value;
  }

  setProducts(products: Product[]) {
    this._products.next(products);
  }

  fetchProducts(): Observable<Product[]> {
    if (this.productsValue.length) return of(this.productsValue);

    return this.apiService.getData().pipe(
      tap(res => {
        const merged: Product[] = res.map((apiProduct, index) => {
          return {
            ...apiProduct,
            uid: `${apiProduct.id}-${index}`,
            amountInCart: 0,
            availableAmount: apiProduct.availableAmount ?? 0,
            minOrderAmount: apiProduct.minOrderAmount ?? 1
          };
        });
        this.setProducts(merged);
      })
    );
  }


  updateProduct(updated: Product) {
    const newProducts = this.productsValue.map(p =>
      p.uid === updated.uid ? updated : p
    );
    // console.log(newProducts)
    this._products.next(newProducts);
  }

  increaseAmount(product: Product) {
    let increment = 0;
    if (product.amountInCart >= product.minOrderAmount) {
      increment = 1;
    } else {
      increment = product.minOrderAmount - product.amountInCart
    }
    const updated: Product = {
      ...product,
      amountInCart: product.amountInCart + increment,
      availableAmount: product.availableAmount - increment
    };
    this.updateProduct(updated);
  }

  decreaseAmount(product: Product) {
    let decrement = 0;
    if (product.amountInCart > product.minOrderAmount) {
      decrement = 1;
    } else {
      decrement = product.amountInCart
    }
    const updated: Product = {
      ...product,
      amountInCart: product.amountInCart - decrement,
      availableAmount: product.availableAmount + decrement
    };
    this.updateProduct(updated);
  }

  updateInCartAmount(product: Product, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    let finalvalue = 0;

      const parsed = parseInt(value);
      finalvalue = isNaN(parsed) ? 0 : parsed

    const max = product.amountInCart + product.availableAmount;
    if (finalvalue > max) {
      finalvalue = max;
    }

    const updated: Product = {
      ...product,
      amountInCart: finalvalue,
      availableAmount: max - finalvalue
    };
    this.updateProduct(updated);
    input.value = String(finalvalue);
  }

  removeFromCart(product: Product) {
    const max = product.amountInCart + product.availableAmount
    const updated: Product = {
      ...product,
      amountInCart: 0,
      availableAmount: max
    };
    this.updateProduct(updated);
  }
}
