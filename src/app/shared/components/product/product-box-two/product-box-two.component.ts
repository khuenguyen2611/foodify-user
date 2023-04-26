import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {QuickViewComponent} from "../../modal/quick-view/quick-view.component";
import {CartModalComponent} from "../../modal/cart-modal/cart-modal.component";
import {Product} from "../../../classes/product";
import {ProductService} from "../../../services/product.service";
import {FirebaseService} from 'src/app/shared/services/firebase.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-product-box-two',
    templateUrl: './product-box-two.component.html',
    styleUrls: ['./product-box-two.component.scss']
})
export class ProductBoxTwoComponent implements OnInit {
    private userId = this.firebaseService.getUserId();

    @Input() product: Product;
    @Input() currency: any = this.productService.Currency; // Default Currency
    @Input() cartModal: boolean = false; // Default False

    @ViewChild('quickView') QuickView: QuickViewComponent;
    @ViewChild('cartModal') CartModal: CartModalComponent;

    public ImageSrc: string

    constructor(
        private productService: ProductService,
        private firebaseService: FirebaseService,
        private toastrService: ToastrService) {
    }

    ngOnInit(): void {
    }

    addToCart(product: Product) {
        this.productService.addToCart(product);
    }

    addToWishlist(product: Product) {
        this.productService.checkFavouriteProduct(this.userId, product.id).subscribe({
            next: (response) => {
                if (response.isTrue == true) {
                    this.toastrService.success('Sản phẩm đã có trong danh sách yêu thích');
                } else {
                    this.productService.addToWishlist(this.userId, product);
                }
            }
        })
    }
}
