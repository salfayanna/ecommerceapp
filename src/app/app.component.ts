import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Product } from './interfaces/product';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// export class AppComponent {
//   title = 'ecommerce-app';
// }

export class AppComponent implements OnInit {
  private apiService = inject(ApiService);
  productList: Product[] = [];

  ngOnInit(): void {
    this.apiService.getData().subscribe(res => this.productList = res);
  }
}