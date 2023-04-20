import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { OrderInfo } from "../../shared/classes/OrderInfo";
import { PaymentInfo } from "../../shared/classes/payment-info";
import { ProductDto } from "../../shared/classes/product-dto";
import { Router } from "@angular/router";
import { randomUUID } from "crypto";
import { Address } from 'src/app/shared/classes/address';
import { UserService } from 'src/app/shared/services/user.service';
import { ShippingResponse } from 'src/app/shared/classes/shipping-response';
import { ToastrService } from 'ngx-toastr';
import { OrderDto } from 'src/app/shared/classes/order-dto';
import { OrderDetail } from 'src/app/shared/classes/order-detail'

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    private userId = Number(localStorage.getItem('user-id'))
    private cartProducts: Product[] = JSON.parse(localStorage.getItem('cartItems'));

    addresses: Address[] = [];
    isAddress: boolean = false;
    userName: string = '';
    shippingResponse: ShippingResponse;
    isShipping: boolean = false;
    total: number;

    public checkoutForm: UntypedFormGroup;
    public products: Product[] = [];
    public payment: string = 'CASH';
    public amount: any;
    public paymentUrl: string;
    isGenerated = false;

    constructor(private fb: UntypedFormBuilder,
        public productService: ProductService,
        private orderService: OrderService,
        private userService: UserService,
        private toastService: ToastrService,
        private router: Router
    ) {
        this.checkoutForm = this.fb.group({
            // firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            // lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            // phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            // email: ['', [Validators.required, Validators.email]],
            // address: ['', [Validators.required, Validators.maxLength(50)]],
            address: ['', Validators.required],
            // town: ['', Validators.required],
            // state: ['', Validators.required],
            // postalcode: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.userService.getUserById(this.userId).subscribe((response) => {
            this.userName = response.fullName
        })
        this.userService.getAddressesByUser(this.userId).subscribe((response) => {
            this.addresses = response.addresses;
        })
        this.productService.cartItems.subscribe(response => this.products = response);
        this.getTotal.subscribe(amount => this.amount = amount);
        this.initConfig();
    }

    public get getSubTotal(): Observable<number> {
        return this.productService.cartTotalAmount();
    }

    public get getTotal(): Observable<number> {
        if (this.isAddress && this.shippingResponse?.cost > 0) {
            return this.productService.cartTotalAmount().pipe(map(num => num + this.shippingResponse?.cost));
        }
        else {
            return this.productService.cartTotalAmount();
        }
    }

    // Stripe Payment Gateway
    // stripeCheckout() {
    //     var handler = (<any>window).StripeCheckout.configure({
    //         key: environment.stripe_token, // publishble key
    //         locale: 'auto',
    //         token: (token: any) => {
    //             this.orderService.createOrder(this.products, this.checkoutForm.value, token.id, this.amount);
    //         }
    //     });
    //     handler.open({
    //         name: 'Shopify',
    //         description: 'Online Shopping Food Store',
    //         amount: this.amount * 100
    //     });
    // }

    cashCheckout(): void {
        const details: OrderDetail[] = [];
        const orderTrackingNumber = crypto.randomUUID();
        if (this.isShipping == false) {
            const newOrder = new OrderDto();
            newOrder.address = 'Đến shop lấy'
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
            })

            newOrder.orderDetails = details;
            this.orderService.saveNewOrder(this.userId, newOrder).subscribe({
                next: (order) => {
                    this.toastService.success("Đặt đơn thành công");
                    this.router.navigate(['/home/order', order.id]);
                    localStorage.removeItem('cartItems');
                }
            })
        }
        else if (this.isShipping == true && this.isAddress == true) {
            const newOrder = new OrderDto();

            this.cartProducts.forEach((cartItem) => {
                const detail = new OrderDetail();
                detail.productId = cartItem.id;
                detail.quantity = cartItem.quantity;
                details.push(detail);
            })

            newOrder.address = this.shippingAddress + ", Đà Nẵng"
            newOrder.lat = this.shippingResponse.location.lat;
            newOrder.lng = this.shippingResponse.location.lng;
            newOrder.shippingCost = this.shippingResponse.cost;
            newOrder.orderTrackingNumber = orderTrackingNumber;
            newOrder.paymentMethod = 'CASH';

            newOrder.orderDetails = details;
            this.orderService.saveNewOrder(this.userId, newOrder).subscribe({
                next: (order) => {
                    this.toastService.success("Đặt đơn thành công");
                    this.router.navigate(['/home/order', order.id]);
                    localStorage.removeItem('cartItems');
                }
            })
        }
        else {
            this.toastService.warning("Vui lòng chọn địa chỉ giao hàng trước khi đặt đơn");
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
                this.orderService.createZaloPayOrder(paymentInfo, "Đến shop lấy").subscribe({
                    next: data => {
                        this.paymentUrl = data.paymentOrderUrl;
                    },
                    error: err => console.log(err)
                }
                );

                setTimeout(() => {
                    window.open(this.paymentUrl, '_blank');
                }, 2000);

            })
        }
        else if (this.isShipping == true && this.isAddress == true) {
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
            })
        }
        else {
            this.toastService.warning("Vui lòng chọn địa chỉ giao hàng trước khi đặt đơn");
        }


        // const orderInterval = setInterval(() => {
        //     this.orderService.createZaloPayOrder(paymentInfo).subscribe({
        //             next: data => {
        //                 this.paymentUrl = data.paymentOrderUrl;
        //                 // console.log(data.paymentOrderUrl);
        //                 console.log(this.paymentUrl);
        //                 if (this.paymentUrl !== undefined) {
        //                     clearInterval(orderInterval);
        //                 }
        //                 console.log(this.paymentUrl);
        //             },
        //             error: err => console.log(err)
        //         }
        //     );
        // }, 2000);


    }

    // Paypal Payment Gateway
    private initConfig(): void {
        // this.payPalConfig = {
        //     currency: this.productService.Currency.currency,
        //     clientId: environment.paypal_token,
        //     createOrderOnClient: (data) => < ICreateOrderRequest > {
        //       intent: 'CAPTURE',
        //       purchase_units: [{
        //           amount: {
        //             currency_code: this.productService.Currency.currency,
        //             value: this.amount,
        //             breakdown: {
        //                 item_total: {
        //                     currency_code: this.productService.Currency.currency,
        //                     value: this.amount
        //                 }
        //             }
        //           }
        //       }]
        //   },
        //     advanced: {
        //         commit: 'true'
        //     },
        //     style: {
        //         label: 'paypal',
        //         size:  'small', // small | medium | large | responsive
        //         shape: 'rect', // pill | rect
        //     },
        //     onApprove: (data, actions) => {
        //         this.orderService.createOrder(this.products, this.checkoutForm.value, data.orderID, this.getTotal);
        //         console.log('onApprove - transaction was approved, but not authorized', data, actions);
        //         actions.order.get().then(details => {
        //             console.log('onApprove - you can get full order details inside onApprove: ', details);
        //         });
        //     },
        //     onClientAuthorization: (data) => {
        //         console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        //     },
        //     onCancel: (data, actions) => {
        //         console.log('OnCancel', data, actions);
        //     },
        //     onError: err => {
        //         console.log('OnError', err);
        //     },
        //     onClick: (data, actions) => {
        //         console.log('onClick', data, actions);
        //     }
        // };
    }


    // APP INFO
    checkPaymentStatus() {

    }

    onAddressSelected() {
        this.isAddress = false;
        if (this.shippingAddress) {
            this.isAddress = true;
            const userAddress = this.shippingAddress + ', Đà Nẵng';
            const shopId = this.products[0].id;
            this.orderService.getShippingCost(userAddress, shopId).subscribe((res) => {
                this.shippingResponse = res;
            })
        }
        else {
            this.shippingResponse = undefined;
        }
    }

    onLocalChange() {
        this.checkoutForm.patchValue({ address: [''] });
        this.isAddress = false;
        this.shippingResponse = undefined;
    }

    get shippingAddress() { return this.checkoutForm.get('address').value + ', Đà Nẵng' }
}
