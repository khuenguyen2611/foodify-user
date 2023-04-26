import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { PaymentInfo } from "../../shared/classes/payment-info";
import { ProductDto } from "../../shared/classes/product-dto";
import { Router } from "@angular/router";
import { Address } from 'src/app/shared/classes/address';
import { UserService } from 'src/app/shared/services/user.service';
import { ShippingResponse } from 'src/app/shared/classes/shipping-response';
import { ToastrService } from 'ngx-toastr';
import { OrderDto } from 'src/app/shared/classes/order-dto';
import { OrderDetail } from 'src/app/shared/classes/order-detail'
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { OrderInfo } from 'src/app/shared/classes/order-info';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    private userId: number;
    private token: string = localStorage.getItem('jwt-token')
    private cartProducts: Product[] = JSON.parse(localStorage.getItem('cartItems'));

    addresses: Address[] = [];
    isAddress = false;
    userName = '';
    shippingResponse: ShippingResponse;
    isShipping = false;
    total: number;

    public checkoutForm: UntypedFormGroup;
    public products: Product[] = [];
    public payment = 'CASH';
    public amount: any;
    public paymentUrl: string;
    isGenerated = false;

    isLoggedIn = false;

    constructor(private fb: UntypedFormBuilder,
        public productService: ProductService,
        private orderService: OrderService,
        private userService: UserService,
        private toastService: ToastrService,
        private router: Router
    ) {
        this.checkoutForm = this.fb.group({
            address: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
        this.userService.getUserByToken(this.token).subscribe((userInfo) => {
            this.userId = userInfo.userId;

            this.userService.getUserById(this.userId).subscribe((response) => {
                this.userName = response.fullName
            })
            this.userService.getAddressesByUser(this.userId).subscribe((response) => {
                this.addresses = response.addresses;
            })
            this.productService.cartItems.subscribe(response => this.products = response);
            this.getTotal.subscribe(amount => this.amount = amount);
        })
    }

    public get getSubTotal(): Observable<number> {
        return this.productService.cartTotalAmount();
    }

    public get getTotal(): Observable<number> {
        if (this.isAddress && this.shippingResponse?.cost > 0) {
            return this.productService.cartTotalAmount().pipe(map(num => num + this.shippingResponse?.cost));
        } else {
            return this.productService.cartTotalAmount();
        }
    }

    cashCheckout(): void {
        const details: OrderDetail[] = [];
        const orderTrackingNumber = crypto.randomUUID();
        if (this.isShipping == false) {
            const newOrder = new OrderDto();
            newOrder.address = 'Đến shop lấy';
            newOrder.lat = '0';
            newOrder.lng = '0';
            newOrder.orderTrackingNumber = orderTrackingNumber;
            newOrder.paymentMethod = 'CASH';
            newOrder.shippingCost = 0;

            this.cartProducts.forEach((cartItem) => {
                const detail = new OrderDetail();
                detail.productId = cartItem.id;
                detail.quantity = cartItem.quantity;
                details.push(detail);
            });

            newOrder.orderDetails = details;
            this.orderService.saveNewOrder(this.userId, newOrder).subscribe({
                next: (order) => {
                    localStorage.removeItem('cartItems');
                    this.toastService.success("Đặt đơn thành công");
                    this.router.navigate(['/home/order', order.id]).then(() => { window.location.reload() });

                }
            });
        } else if (this.isShipping == true && this.isAddress == true) {
            const newOrder = new OrderDto();

            this.cartProducts.forEach((cartItem) => {
                const detail = new OrderDetail();
                detail.productId = cartItem.id;
                detail.quantity = cartItem.quantity;
                details.push(detail);
            });

            newOrder.address = this.shippingAddress + ', Đà Nẵng';
            newOrder.lat = this.shippingResponse.location.lat;
            newOrder.lng = this.shippingResponse.location.lng;
            newOrder.shippingCost = this.shippingResponse.cost;
            newOrder.orderTrackingNumber = orderTrackingNumber;
            newOrder.paymentMethod = 'CASH';

            newOrder.orderDetails = details;
            this.orderService.saveNewOrder(this.userId, newOrder).subscribe({
                next: (order) => {
                    localStorage.removeItem('cartItems');
                    this.toastService.success("Đặt đơn thành công");
                    this.router.navigate(['/home/order', order.id]).then(() => { window.location.reload() });
                }
            });
        } else {
            this.toastService.warning('Vui lòng chọn địa chỉ giao hàng trước khi đặt đơn');
        }
    }

    zaloPayCheckout(): void {
        const productsDto: ProductDto[] = [];
        const orderTrackingNumber = crypto.randomUUID();
        for (let i = 0; i < this.products.length; i++) {
            const prodDto = new ProductDto(this.products[i].name, this.products[i].cost.toString(), this.products[i].quantity.toString());
            productsDto[i] = prodDto;
        }

        if (this.isShipping == false) {
            this.getTotal.subscribe(result => {
                const orderInfo: OrderInfo = new OrderInfo('Đến shop lấy', result.toString(), orderTrackingNumber);
                const paymentInfo: PaymentInfo = new PaymentInfo(productsDto, orderInfo);
                this.orderService.createZaloPayOrder(paymentInfo, 'Đến shop lấy').subscribe({
                    next: data => {
                        this.paymentUrl = data.paymentOrderUrl;
                    },
                    error: err => console.log(err)
                }
                );

                setTimeout(() => {
                    window.open(this.paymentUrl, '_blank');
                }, 2000);
            });
        } else if (this.isShipping == true && this.isAddress == true) {
            localStorage.setItem('shippingInfo', JSON.stringify(this.shippingResponse));
            this.getTotal.subscribe(result => {
                const orderInfo: OrderInfo = new OrderInfo(this.shippingAddress, result.toString(), orderTrackingNumber);
                const paymentInfo: PaymentInfo = new PaymentInfo(productsDto, orderInfo);
                this.orderService.createZaloPayOrder(paymentInfo, this.shippingAddress).subscribe({
                    next: data => {
                        this.paymentUrl = data.paymentOrderUrl;
                    },
                    error: err => console.log(err)
                }
                );
                setTimeout(() => {
                    window.open(this.paymentUrl, '_blank');
                }, 2000);
            });
        } else {
            this.toastService.warning('Vui lòng chọn địa chỉ giao hàng trước khi đặt đơn');
        }
    }

    onAddressSelected() {
        this.isAddress = false;
        if (this.shippingAddress) {
            this.isAddress = true;
            const userAddress = this.shippingAddress + ', Đà Nẵng';
            const shopId = this.products[0].shop.id;
            this.orderService.getShippingCost(userAddress, shopId).subscribe((res) => {
                this.shippingResponse = res;
            });
        } else {
            this.shippingResponse = undefined;
        }
    }

    onLocalChange() {
        this.checkoutForm.patchValue({ address: [''] });
        this.isAddress = false;
        this.shippingResponse = undefined;
    }

    get shippingAddress() {
        return this.checkoutForm.get('address').value + ', Đà Nẵng';
    }
}
