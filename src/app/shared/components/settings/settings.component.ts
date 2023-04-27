import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Observable} from 'rxjs';
import {ProductService} from '../../services/product.service';
import {Product} from '../../classes/product';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public products: Product[] = [];
    public search = false;
    isLoggedIn = false;

    constructor(
        private toastService: ToastrService,
        public productService: ProductService, private router: Router) {
    }

    ngOnInit(): void {
        this.productService.cartItems.subscribe(response => this.products = response);
    }

    get getTotal(): Observable<number> {
        return this.productService.cartTotalAmount();
    }

    removeItem(product: any) {
        this.productService.removeCartItem(product);
    }

    onCheckOut() {
        this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));

        if (!this.isLoggedIn) {
            this.toastService.warning('Vui lòng đăng nhập trước khi tiến hành thanh toán');
        } else {
            this.router.navigate(['/shop/checkout']);
        }
    }
}
