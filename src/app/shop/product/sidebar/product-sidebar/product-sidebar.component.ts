import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { Comment } from 'src/app/shared/classes/comment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-product-sidebar',
    templateUrl: './product-sidebar.component.html',
    styleUrls: ['./product-sidebar.component.scss']
})
export class ProductSidebarComponent implements OnInit {
    private userId: number;
    private token: string = localStorage.getItem('jwt-token')

    comments: Comment[] = [];

    public product: Product;
    public counter = 1;
    public activeSlide: any = 0;
    public mobileSidebar = false;
    public active = 1;
    public isWishlist = false;

    public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
    public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private userService: UserService,
        private router: Router,
        private toastService: ToastrService,
        private commentService: CommentService,
        public productService: ProductService) {

    }

    ngOnInit() {
        this.userService.getUserByToken(this.token).subscribe((userInfo) => {
            this.userId = userInfo.userId;
            this.loadProductData();
            this.loadCommentData();
        })
    }

    loadProductData() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.productService.getProductById(id).subscribe((product) => {
            this.product = product;
            this.productService.checkFavouriteProduct(this.userId, this.product.id).subscribe((response) => {
                this.isWishlist = response.isTrue;
            });
        });
    }

    loadCommentData() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.commentService.getCommentsByProduct(id).subscribe((data) => {
            this.comments = data.comments;
        });
    }

    // Add to cart
    async addToCart(product: any) {
        const res = await this.productService.addToCart(product);
        console.log(res);
    }

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
