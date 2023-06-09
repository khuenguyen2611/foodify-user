import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../classes/product';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
    selector: 'app-cart-variation',
    templateUrl: './cart-variation.component.html',
    styleUrls: ['./cart-variation.component.scss']
})
export class CartVariationComponent implements OnInit, OnDestroy {

    @Input() direction = 'right'; // Default Direction Right

    public products: Product[] = [];

    isLoggedIn = false;

    constructor(public productService: ProductService,
                private toastService: ToastrService,
                private router: Router) {
        this.productService.cartItems.subscribe(response => this.products = response);
    }

    ngOnInit(): void {
        this.productService.OpenCart = false;
    }

    closeCart() {
        this.productService.OpenCart = false;
    }

    get getTotal(): Observable<number> {
        return this.productService.cartTotalAmount();
    }

    removeItem(product: any) {
        this.productService.removeCartItem(product);
    }

    checkout() {
        this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));

        if (!this.isLoggedIn) {
            this.toastService.warning('Vui lòng đăng nhập trước khi tiến hành thanh toán', );
        } else {
            this.router.navigate(['/shop/checkout']);
        }
    }

    ngOnDestroy(): void {
        this.closeCart();
    }
}
