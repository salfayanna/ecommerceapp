import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
private http = inject(HttpClient);
  private readonly apiUrl = 'https://63c10327716562671870f959.mockapi.io/products';

  getData(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}