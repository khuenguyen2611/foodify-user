import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { Product } from 'src/app/shared/classes/product';
import { OrderDetail } from 'src/app/shared/classes/order-detail';
import { OrderDto } from 'src/app/shared/classes/order-dto';
import { ShippingResponse } from 'src/app/shared/classes/shipping-response';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, OnDestroy {
    private userId: number;
    private token = localStorage.getItem('jwt-token');
    private cartProducts: Product[] = JSON.parse(localStorage.getItem('cartItems'));
    private shippingInfo: ShippingResponse = JSON.parse(localStorage.getItem('shippingInfo'));

    status = '1';
    public orderDetails: Order = {};
    currentStep = 1;
    numSteps = 4;
    orderStatus = 'AWAITING';
    orderId: number;
    orderStatusInterval;
    newId: number;

    constructor(public productService: ProductService,
        private orderService: OrderService,
        private toastService: ToastrService,
        private userService: UserService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.userService.getUserByToken(this.token).subscribe(userInfo => {
            this.userId = userInfo.userId;

            const details: OrderDetail[] = [];

            this.cartProducts.forEach((cartItem) => {
                const detail = new OrderDetail();
                detail.productId = cartItem.id;
                detail.quantity = cartItem.quantity;
                details.push(detail);
            })

            this.orderService.checkoutItems.subscribe({
                next: (res) => {
                    this.orderDetails = res;
                    const newOrder = new OrderDto();

                    if (res.shippingAddress == 'Đến shop lấy') {
                        newOrder.address = res.shippingAddress;
                        newOrder.lat = '0';
                        newOrder.lng = '0';
                        newOrder.shippingCost = 0;
                    }
                    else {
                        newOrder.address = res.shippingAddress;
                        newOrder.lat = this.shippingInfo.location.lat;
                        newOrder.lng = this.shippingInfo.location.lng;
                        newOrder.shippingCost = this.shippingInfo.cost;
                    }
                    newOrder.paymentMethod = 'ZALO PAY'
                    newOrder.orderDetails = details;
                    newOrder.orderTrackingNumber = res.orderId;

                    this.orderService.saveNewOrder(this.userId, newOrder).subscribe({
                        next: (order) => {
                            this.router.navigate(['/home/order', order.id]).then(() => { window.location.reload() });
                        }
                    })
                }
            });
        })
    }

    goToOrder() {
        this.router.navigate(['/home/order', this.newId]).then(() => {
            window.location.reload();
        });
    }

    ngOnDestroy(): void {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('checkoutItems');
    }
}
