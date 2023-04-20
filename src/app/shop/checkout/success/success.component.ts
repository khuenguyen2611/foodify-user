import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { response } from "express";
import { map } from "rxjs/operators";
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { Product } from 'src/app/shared/classes/product';
import { OrderDetail } from 'src/app/shared/classes/order-detail';
import { OrderDto } from 'src/app/shared/classes/order-dto';
import { ShippingResponse } from 'src/app/shared/classes/shipping-response';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/classes/transaction';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, OnDestroy {
    private userId: number = this.firebaseService.getUserId();
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
        private firebaseService: FirebaseService,
        private toastService: ToastrService,
        private userService: UserService,
        private transactionService: TransactionService,
        private router: Router) {
    }

    ngOnInit(): void {
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
                        const transaction = new Transaction();
                        transaction.id = order.orderTrackingNumber;
                        transaction.productCost = order.productCost;
                        transaction.shippingCost = order.shippingCost;
                        transaction.total = order.total;
                        this.userService.getUserById(this.userId).subscribe((user) => {
                            transaction.userFullName = user.fullName;
                            this.transactionService.createNewTransaction(transaction).subscribe(() => {
                                this.toastService.success("Đặt đơn thành công");
                                this.newId = order.id;
                                localStorage.removeItem('cartItems');
                                localStorage.removeItem('checkoutItems');
                                localStorage.removeItem('shippingInfo');
                            })
                        })
                    }
                })
            }
        });

    }

    goToOrder() {
        this.router.navigate(['/home/order', this.newId]).then(() => { window.location.reload() });
    }

    // ngAfterViewInit() {
    //     this.nextStep();
    //     this.orderStatusInterval = setInterval(() => {
    //         this.orderService.getOrderStatusUpdates(this.orderDetails.orderId).subscribe(
    //             (next: string) => {
    //                 if (this.orderStatus !== next) {
    //                     this.nextStep();
    //                     this.orderStatus = next;
    //                 }
    //             }
    //         );
    //     }, 5000);
    // }

    // nextStep() {
    //     this.currentStep++;
    //     if (this.currentStep > this.numSteps) {
    //         this.currentStep = 1;
    //     }
    //     var stepper = document.getElementById("stepper1");
    //     var steps = stepper.getElementsByClassName("step");

    //     Array.from(steps).forEach((step, index) => {
    //         let stepNum = index + 1;
    //         if (stepNum === this.currentStep) {
    //             this.addClass(step, "editing");
    //         } else {
    //             this.removeClass(step, "editing");
    //         }
    //         if (stepNum < this.currentStep) {
    //             this.addClass(step, "done");
    //         } else {
    //             this.removeClass(step, "done");
    //         }
    //     });
    // }

    // hasClass(elem, className) {
    //     return new RegExp(" " + className + " ").test(" " + elem.className + " ");
    // }

    // addClass(elem, className) {
    //     if (!this.hasClass(elem, className)) {
    //         elem.className += " " + className;
    //     }
    // }

    // removeClass(elem, className) {
    //     var newClass = " " + elem.className.replace(/[\t\r\n]/g, " ") + " ";
    //     if (this.hasClass(elem, className)) {
    //         while (newClass.indexOf(" " + className + " ") >= 0) {
    //             newClass = newClass.replace(" " + className + " ", " ");
    //         }
    //         elem.className = newClass.replace(/^\s+|\s+$/g, "");
    //     }
    // }

    ngOnDestroy(): void {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('checkoutItems');
    }
}
