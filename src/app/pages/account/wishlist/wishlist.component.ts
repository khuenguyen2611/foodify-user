import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/shared/classes/product';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
    private userId: number;
    token: string = localStorage.getItem('jwt-token');
    public products?: Product[] = [];

    private productId: number;
    public message = '';

    @ViewChild('DeleteModal') deleteModal: TemplateRef<any>;
    @ViewChild('MessageModal') messageModal: TemplateRef<any>;

    constructor(
        private firebaseService: FirebaseService,
        private userService: UserService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.userService.getUserByToken(this.token).subscribe(userInfo => {
            this.userId = userInfo.userId;
            this.loadFavouriteProducts();
        })
    }



    processLoveProducts() {
        return (data: any) => {
            this.products = data.products;
        }
    }


    loadFavouriteProducts() {
        this.userService.getFavouriteProductsByUser(this.userId).subscribe(this.processFavouriteProducts());
    }

    processFavouriteProducts() {
        return (data: any) => {
            this.products = data.products;
        };
    }

    openDeleteModal(id: number) {
        this.productId = id;
        this.modalService.open(this.deleteModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
                windowClass: 'Quickview'
            });
    }

    deleteFavouriteProduct() {
        this.userService.deleteFavouriteProductByUser(this.userId, this.productId).subscribe({
            next: () => {
                this.modalService.dismissAll();
                this.message = 'Xoá sản phẩm thành công.';
                this.modalService.open(this.messageModal,
                    {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true,
                        windowClass: 'Quickview'
                    });
                this.loadFavouriteProducts();
            }
        });
    }
}
