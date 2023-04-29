import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../classes/product';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public products: Product[] = [];
    public search = false;
    private isLoggedIn = this.firebaseService.IsLoggedIn();

    public languages = [{
        name: 'English',
        code: 'en'
    }, {
        name: 'French',
        code: 'fr'
    }];

    public currencies = [{
        name: 'Euro',
        currency: 'EUR',
        price: 0.90 // price of euro
    }, {
        name: 'Rupees',
        currency: 'INR',
        price: 70.93 // price of inr
    }, {
        name: 'Pound',
        currency: 'GBP',
        price: 0.78 // price of euro
    }, {
        name: 'Dollar',
        currency: 'USD',
        price: 1 // price of usd
    }];

    constructor(@Inject(PLATFORM_ID) private platformId: Object,
        private toastService: ToastrService,
        private firebaseService: FirebaseService,
        private router: Router,
        private translate: TranslateService,
        public productService: ProductService) {
        this.productService.cartItems.subscribe(response => this.products = response);
    }

    ngOnInit(): void {
    }


    changeLanguage(code) {
        if (isPlatformBrowser(this.platformId)) {
            this.translate.use(code);
        }
    }

    get getTotal(): Observable<number> {
        return this.productService.cartTotalAmount();
    }

    removeItem(product: any) {
        this.productService.removeCartItem(product);
    }

    changeCurrency(currency: any) {
        this.productService.Currency = currency;
    }

    goToWishlist() {
        if (this.isLoggedIn) {
            this.router.navigate(['/home/wishlist'])
        }
        else {
            this.toastService.warning("Vui lòng đăng nhập để xem danh sách yêu thích của bạn.")
        }
    }

    goToOrder() {
        if (this.isLoggedIn) {
            this.router.navigate(['/home/my-orders'])
        }
        else {
            this.toastService.warning("Vui lòng đăng nhập để xem đơn hàng của bạn.")
        }
    }
}
