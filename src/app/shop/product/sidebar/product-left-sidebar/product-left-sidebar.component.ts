import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { Comment } from 'src/app/shared/classes/comment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-product-left-sidebar',
    templateUrl: './product-left-sidebar.component.html',
    styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {
    private userId = this.firebaseService.getUserId();

    comments: Comment[] = [];

    public product: Product;
    public counter: number = 1;
    public activeSlide: any = 0;
    public selectedSize: any;
    public mobileSidebar: boolean = false;
    public active = 1;
    public isWishlist: boolean = false;

    @ViewChild("sizeChart") SizeChart: SizeModalComponent;

    public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
    public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router,
        private toastService: ToastrService,
        private commentService: CommentService,
        public productService: ProductService) {

    }

    ngOnInit() {
        this.loadProductData();
        this.loadCommentData();
    }

    loadProductData() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.productService.getProductById(id).subscribe((product) => {
            this.product = product;
            this.productService.checkLoveProduct(this.userId, this.product.id).subscribe((response) => {
                this.isWishlist = response.isTrue;
            })
        })
    }

    loadCommentData() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.commentService.getCommentsByProduct(id).subscribe((data) => {
            this.comments = data.comments;
        })
    }



    // Get Product Color
    // Color(variants) {
    //     const uniqColor = []
    //     for (let i = 0; i < Object.keys(variants).length; i++) {
    //         if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
    //             uniqColor.push(variants[i].color)
    //         }
    //     }
    //     return uniqColor
    // }

    // Get Product Size
    Size(variants) {
        const uniqSize = []
        for (let i = 0; i < Object.keys(variants).length; i++) {
            if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
                uniqSize.push(variants[i].size)
            }
        }
        return uniqSize
    }

    selectSize(size) {
        this.selectedSize = size;
    }

    // Increament
    increment() {
        this.counter++;
    }

    // Decrement
    decrement() {
        if (this.counter > 1) this.counter--;
    }

    // Add to cart
    async addToCart(product: any) {
        const res = await this.productService.addToCart(product);
        console.log(res)
    }

    // Buy Now
    // async buyNow(product: any) {
    //     product.quantity = this.counter || 1;
    //     const status = await this.productService.addToCart(product);
    //     if (status)
    //         this.router.navigate(['/shop/checkout']);
    // }

    // Add to Wishlist
    addToWishlist(product: Product) {
        this.productService.addToWishlist(this.userId, product);
        this.isWishlist = true;
    }

    deleteWishlistItem(product: Product) {
        this.productService.deleteWishlistItem(this.userId, product);
        this.isWishlist = false;
    }

    // Toggle Mobile Sidebar
    toggleMobileSidebar() {
        this.mobileSidebar = !this.mobileSidebar;
    }

}
