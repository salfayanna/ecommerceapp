import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListPageComponent } from './product-list-page.component';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { Product } from '../../interfaces/product';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let messageSubject: Subject<string>;

  const mockProducts: Product[] = [
    { id: '1', name: 'Product 1', img: 'img1.jpg', availableAmount: 10, minOrderAmount: 2, price: 100, amountInCart: 0, uid: '1-0' },
    { id: '2', name: 'Product 2', img: 'img2.jpg', availableAmount: 5, minOrderAmount: 1, price: 200, amountInCart: 0, uid: '2-1' }
  ];

  beforeEach(async () => {
    messageSubject = new Subject<string>();

    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'fetchProducts',
      'increaseAmount',
      'decreaseAmount',
      'updateInCartAmount',
      'removeFromCart'
    ]);

    cartServiceSpy.fetchProducts.and.returnValue(of(mockProducts));

    (cartServiceSpy as any).products$ = of(mockProducts);
    (cartServiceSpy as any).messageUid$ = messageSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchProducts on init', () => {
    expect(cartServiceSpy.fetchProducts).toHaveBeenCalled();
  });

  it('should subscribe to messageUid$ and update maxAmountMessageId', async() => {
    messageSubject.next('1-0');
    await fixture.whenStable()
    expect(component.maxAmountMessageId).toBe('1-0');

    messageSubject.next('');
    await fixture.whenStable()
    expect(component.maxAmountMessageId).toBe('');
  });

  it('should call increaseAmount on CartService', () => {
    const product = mockProducts[0];
    component.increaseAmount(product);
    expect(cartServiceSpy.increaseAmount).toHaveBeenCalledWith(product);
  });

  it('should call decreaseAmount on CartService', () => {
    const product = mockProducts[0];
    component.decreaseAmount(product);
    expect(cartServiceSpy.decreaseAmount).toHaveBeenCalledWith(product);
  });

  it('should call updateInCartAmount on CartService', () => {
    const product = mockProducts[0];
    const event = { target: { value: '3' } } as unknown as Event;
    component.updateInCartAmount(product, event);
    expect(cartServiceSpy.updateInCartAmount).toHaveBeenCalledWith(product, event);
  });

  it('should call removeFromCart on CartService', () => {
    const product = mockProducts[0];
    component.removeFromCart(product);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(product);
  });

  it('should return product.uid in trackByUid', () => {
    const product = mockProducts[0];
    expect(component.trackByUid(0, product)).toBe('1-0');
  });

  it('should show min order message when needed', () => {
    const product: Product = { ...mockProducts[0], amountInCart: 1, minOrderAmount: 2, uid: '1-0' };
    component.tryShowMinOrderMessage(product);
    expect(component.minOrderMessageId).toBe(product.uid!);
  });

  it('should hide min order message', () => {
    component.minOrderMessageId = '1-0';
    component.hideMinOrderMessage();
    expect(component.minOrderMessageId).toBe('');
  });

  it('should unsubscribe on destroy safely', () => {
    spyOn(component['sub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['sub'].unsubscribe).toHaveBeenCalled();
  });
});
