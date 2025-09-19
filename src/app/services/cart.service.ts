import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _products = new BehaviorSubject<Product[]>([]);
  products$ = this._products.asObservable();
  private messageSubject = new BehaviorSubject<string>('');
  messageUid$ = this.messageSubject.asObservable();

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
    map(res => {
      const merged: Product[] = res.map((apiProduct, index) => ({
        ...apiProduct,
        uid: `${apiProduct.id}-${index}`,
        amountInCart: 0,
        availableAmount: apiProduct.availableAmount ?? 0,
        minOrderAmount: apiProduct.minOrderAmount ?? 1
      }));
      this.setProducts(merged);
      return merged; // <-- emit merged array
    })
  );
}


  updateProduct(updated: Product) {
    const newProducts = this.productsValue.map(p =>
      p.uid === updated.uid ? updated : p
    );
    this._products.next(newProducts);
  }

  increaseAmount(product: Product) {
    let increment = 0;
    if (product.availableAmount == 0) {
      return;
    }

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
    let finalValue = 0;

    const parsed = parseInt(value);
    finalValue = isNaN(parsed) ? 0 : parsed;

    const max = product.amountInCart + product.availableAmount;
    if (finalValue > max) {
      finalValue = max;
      this.showMessageTimeout(product.uid!);
    }

    if (finalValue < product.minOrderAmount) {
      finalValue = 0;
    }

    const updated: Product = {
      ...product,
      amountInCart: finalValue,
      availableAmount: max - finalValue
    };
    this.updateProduct(updated);
    input.value = String(finalValue);
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

  private showMessageTimeout(uid: string, duration = 3000) {
    this.messageSubject.next(uid);

    setTimeout(() => {
      this.messageSubject.next('');
    }, duration);
  }
}
