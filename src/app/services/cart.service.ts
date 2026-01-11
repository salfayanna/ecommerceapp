import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _products = new BehaviorSubject<Product[]>([]);
  products$ = this._products.asObservable();
  private messageSubject = new BehaviorSubject<string>('');
  messageUid$ = this.messageSubject.asObservable();
  private readonly STORAGE_KEY = 'cart_state';

  constructor(private apiService: ApiService) { }

  get productsValue(): Product[] {
    return this._products.value;
  }

  setProducts(products: Product[]) {
    this._products.next(products);
    this.saveCartState(products);
  }

  private saveCartState(products: Product[]) {
    const state = products
        .filter(p => p.amountInCart > 0)
        .map(p => ({ uid: p.uid, amountInCart: p.amountInCart }));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  private getCartState(): { uid: string, amountInCart: number }[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  fetchProducts(): Observable<Product[]> {
    if (this.productsValue.length) return of(this.productsValue);

    return this.apiService.getData().pipe(
      map(res => {
        const savedState = this.getCartState();
        const merged: Product[] = res.map((apiProduct, index) => {
          const uid = `${apiProduct.id}-${index}`;
          const savedItem = savedState.find(item => item.uid === uid);
          const amountInCart = savedItem ? savedItem.amountInCart : 0;
          const availableAmount = (apiProduct.availableAmount ?? 0) - amountInCart;

          return {
            ...apiProduct,
            uid: uid,
            amountInCart: amountInCart,
            availableAmount: availableAmount,
            minOrderAmount: apiProduct.minOrderAmount ?? 1
          };
        });
        return merged;
      }),
      tap(merged => this.setProducts(merged))
    );
  }

  updateProduct(updated: Product) {
    const newProducts = this.productsValue.map(p =>
      p.uid === updated.uid ? updated : p
    );
    this.setProducts(newProducts);
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

    const parsed = parseInt(value, 10);
    finalValue = isNaN(parsed) ? 0 : Math.max(0, parsed);

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
