import { Component, inject, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Product } from '../../interfaces/product';


@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [NgFor],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css'
})
export class ProductListPageComponent implements OnInit {
    private apiService = inject(ApiService);
  productList: Product[] = [];

  ngOnInit(): void {
    this.apiService.getData().subscribe(res => this.productList = res);
  }
}
