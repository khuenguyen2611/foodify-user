import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {QuickViewComponent} from '../../modal/quick-view/quick-view.component';
import {Product} from '../../../classes/product';
import {ProductService} from '../../../services/product.service';
import {Router} from '@angular/router';
import {FirebaseService} from 'src/app/shared/services/firebase.service';

@Component({
    selector: 'app-product-box-one',
    templateUrl: './product-box-one.component.html',
    styleUrls: ['./product-box-one.component.scss']
})
export class ProductBoxOneComponent implements OnInit {
    private userId = this.firebaseService.getUserId();

    @Input() product: Product;
    @Input() currency: any = this.productService.Currency; // Default Currency
    @Input() thumbnail = false; // Default False
    @Input() onHowerChangeImage = false; // Default False
    @Input() cartModal = false; // Default False
    @Input() loader = false;

    @ViewChild('quickView') QuickView: QuickViewComponent;
    // @ViewChild("cartModal") CartModal: CartModalComponent;

    public ImageSrc: string;

    constructor(
        private productService: ProductService,
        private router: Router,
        private firebaseService: FirebaseService) {
    }

    ngOnInit(): void {
        if (this.loader) {
            setTimeout(() => {
                this.loader = false;
            }, 2000); // Skeleton Loader
        }
    }

    // Change Variants Image
    ChangeVariantsImage(src) {
        this.ImageSrc = src;
    }

    addToCart(product: any) {
        this.productService.addToCart(product);
    }

    addToWishlist(product: any) {
        this.productService.addToWishlist(this.userId, product);
    }

    navigateToProduct(id: number) {
        this.router.navigate(['/shop/products', id]).then(() => {
            window.location.reload();
        });
    }
}
