import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CartService {
  private _products = new BehaviorSubject<Product[]>([]);
  products$ = this._products.asObservable();

  get productsValue(): Product[] {
    return this._products.value;
  }

  setProducts(products: Product[]) {
    this._products.next(products);
  }

  updateProduct(product: Product) {
    const current = this._products.value.map(p =>
      p.id === product.id ? { ...p, ...product } : p
    );
    this._products.next(current);
  }
}