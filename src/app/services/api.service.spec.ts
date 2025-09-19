import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { Product } from '../interfaces/product';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      img: 'img1.jpg',
      availableAmount: 100,
      minOrderAmount: 1,
      price: 10,
      amountInCart: 0
    },
    {
      id: '2',
      name: 'Product 2',
      img: 'img2.jpg',
      availableAmount: 50,
      minOrderAmount: 1,
      price: 20,
      amountInCart: 0
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products via getData', () => {
    service.getData().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('https://63c10327716562671870f959.mockapi.io/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should handle empty response', () => {
    service.getData().subscribe((products) => {
      expect(products.length).toBe(0);
      expect(products).toEqual([]);
    });

    const req = httpMock.expectOne('https://63c10327716562671870f959.mockapi.io/products');
    req.flush([]);
  });

  it('should handle HTTP error', () => {
    service.getData().subscribe({
      next: () => fail('Should have failed with an error'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('https://63c10327716562671870f959.mockapi.io/products');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
