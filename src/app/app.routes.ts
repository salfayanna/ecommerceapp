import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { ProductListPageComponent } from './components/product-list-page/product-list-page.component';

export const routes: Routes = [
  { path: '', component: ProductListPageComponent },
  { path: 'cart', component: CartComponent }
];