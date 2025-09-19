import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { Product } from '../interfaces/product';

describe('CartService', () => {
  let service: CartService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getData']);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

it('fetchProducts should call ApiService and merge products if empty', (done) => {
  const apiProducts: Product[] = [
    { id: '1', name: 'Product 1', availableAmount: 10, minOrderAmount: 2, price: 100, amountInCart: 0, uid: '', img: 'img1.jpg' },
    { id: '2', name: 'Product 2', availableAmount: 5, minOrderAmount: 1, price: 200, amountInCart: 0, uid: '', img: 'img2.jpg' }
  ];

  apiServiceSpy.getData.and.returnValue(of(apiProducts));

  service.fetchProducts().subscribe(products => {
    expect(products.length).toBe(2);
    expect(products[0].uid).toBe('1-0');
    expect(products[1].uid).toBe('2-1');
    expect(products[0].amountInCart).toBe(0);
    expect(products[0].availableAmount).toBe(10);
    done();
  });

  expect(apiServiceSpy.getData).toHaveBeenCalled();
});

  it('should return cached products if already fetched', (done) => {
    const cachedProducts: Product[] = [
      { id: '1', name: 'Product 1', uid: '1-0', amountInCart: 0, availableAmount: 10, minOrderAmount: 2, price: 100, img: 'img1.jpg' },
    ];
    service.setProducts(cachedProducts);

    service.fetchProducts().subscribe(products => {
      expect(products).toEqual(cachedProducts);
      done();
    });

    expect(apiServiceSpy.getData).not.toHaveBeenCalled();
  });

  it('updateProduct should update existing product', () => {
    const product: Product = {
      id: '1', name: 'Product 1', uid: '1-0', amountInCart: 0, availableAmount: 10, minOrderAmount: 2, price: 100, img: 'img1.jpg'
    };
    service.setProducts([product]);

    const updated: Product = { ...product, amountInCart: 2 };
    service.updateProduct(updated);

    service.products$.subscribe(products => {
      expect(products[0].amountInCart).toBe(2);
    });
  });

  it('increaseAmount should increment amountInCart respecting minOrderAmount', () => {
    const product: Product = {
      id: '1', name: 'Product 1', uid: '1-0', amountInCart: 0, availableAmount: 10, minOrderAmount: 2, price: 100, img: 'img1.jpg'
    };
    service.setProducts([product]);

    service.increaseAmount(product);

    service.products$.subscribe(products => {
      expect(products[0].amountInCart).toBe(2);
      expect(products[0].availableAmount).toBe(8);
    });
  });

  it('decreaseAmount should decrement amountInCart', () => {
    const product: Product = {
      id: '1', name: 'Product 1', uid: '1-0', amountInCart: 3, availableAmount: 7, minOrderAmount: 2, price: 100, img: 'img1.jpg'
    };
    service.setProducts([product]);

    service.decreaseAmount(product);

    service.products$.subscribe(products => {
      expect(products[0].amountInCart).toBe(2);
      expect(products[0].availableAmount).toBe(8);
    });
  });

  it('removeFromCart should reset amountInCart', () => {
    const product: Product = {
      id: '1', name: 'Product 1', uid: '1-0', amountInCart: 3, availableAmount: 7, minOrderAmount: 2, price: 100, img: 'img1.jpg'
    };
    service.setProducts([product]);

    service.removeFromCart(product);

    service.products$.subscribe(products => {
      expect(products[0].amountInCart).toBe(0);
      expect(products[0].availableAmount).toBe(10);
    });
  });
});
