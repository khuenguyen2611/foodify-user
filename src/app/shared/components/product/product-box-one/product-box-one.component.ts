import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from '../../modal/quick-view/quick-view.component';
import { CartModalComponent } from '../../modal/cart-modal/cart-modal.component';
import { Product } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { ToastrService } from "ngx-toastr";
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-product-box-one',
    templateUrl: './product-box-one.component.html',
    styleUrls: ['./product-box-one.component.scss']
})
export class ProductBoxOneComponent implements OnInit {
    private userId: number;
    token: string = localStorage.getItem('jwt-token');
    private isLoggedIn = this.firebaseService.IsLoggedIn();

    @Input() product: Product;
    @Input() currency: any = this.productService.Currency; // Default Currency
    @Input() thumbnail: boolean = false; // Default False
    @Input() onHowerChangeImage: boolean = false; // Default False
    @Input() cartModal: boolean = false; // Default False
    @Input() loader: boolean = false;

    @ViewChild('quickView') QuickView: QuickViewComponent;
    @ViewChild('cartModal') CartModal: CartModalComponent;

    public ImageSrc: string

    constructor(
        private productService: ProductService,
        private userService: UserService,
        private router: Router,
        private firebaseService: FirebaseService) { }

    ngOnInit(): void {
        if (this.loader) {
            setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
        }
        if (this.isLoggedIn) {
            this.userService.getUserByToken(this.token).subscribe((userInfo) => {
                this.userId = userInfo.userId;
            })
        }
    }

    addToCart(product: any) {
        this.productService.addToCart(product);
    }

    addToWishlist(product: any) {
        this.productService.addToWishlist(this.userId, product);
    }

    navigateToProduct(id: number) {
        this.router.navigate(['/shop/products', id]).then(() => {
            window.location.reload()
        })
    }
}
