import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { Product } from '../../interfaces/product';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let messageSubject: Subject<string>;

  const mockProducts: Product[] = [
    { id: '1', name: 'Product 1', img: 'img1.jpg', availableAmount: 10, minOrderAmount: 2, price: 100, amountInCart: 1, uid: '1-0' },
    { id: '2', name: 'Product 2', img: 'img2.jpg', availableAmount: 5, minOrderAmount: 1, price: 200, amountInCart: 0, uid: '2-1' }
  ];

  beforeEach(async () => {
    messageSubject = new Subject<string>();

    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'increaseAmount',
      'decreaseAmount',
      'updateInCartAmount',
      'removeFromCart'
    ], {
      products$: of(mockProducts),
      messageUid$: messageSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } } 
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate cartList with products that have amountInCart > 0', () => {
    expect(component.cartList.length).toBe(1);
    expect(component.cartList[0].uid).toBe('1-0');
  });

  it('should update maxAmountMessageId when messageUid$ emits', async() => {
    messageSubject.next('1-0');
    await fixture.whenStable();
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

  it('should calculate cartTotal correctly', () => {
    expect(component.cartTotal).toBe(100);
  });

  it('should show min order message when needed', () => {
    const product: Product = { ...mockProducts[0], amountInCart: 1, minOrderAmount: 2, uid: '1-0' };
    component.tryShowMinOrderMessage(product);
    expect(component.minOrderMessageId).toBe('1-0');
  });

  it('should hide min order message', () => {
    component.minOrderMessageId = '1-0';
    component.hideMinOrderMessage();
    expect(component.minOrderMessageId).toBe('');
  });

  it('should unsubscribe safely on destroy', () => {
    spyOn(component['sub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['sub'].unsubscribe).toHaveBeenCalled();
  });
});
