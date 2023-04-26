import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, TemplateRef, ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Product} from '../../../classes/product';
import {ProductService} from '../../../../shared/services/product.service';

@Component({
    selector: 'app-quick-view',
    templateUrl: './quick-view.component.html',
    styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy {

    @Input() product: Product;
    @Input() currency: any;
    @ViewChild('quickView', {static: false}) QuickView: TemplateRef<any>;

    public closeResult: string;
    public ImageSrc: string;
    public counter = 1;
    public modalOpen = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                private router: Router, private modalService: NgbModal,
                public productService: ProductService) {
    }

    ngOnInit(): void {
    }

    openModal() {
        this.modalOpen = true;
        if (isPlatformBrowser(this.platformId)) { // For SSR
            this.modalService.open(this.QuickView, {
                size: 'lg',
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
                windowClass: 'Quickview'
            }).result.then((result) => {
                `Result ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    // Get Product Color
    Color(variants) {
        const uniqColor = [];
        for (let i = 0; i < Object.keys(variants).length; i++) {
            if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
                uniqColor.push(variants[i].color);
            }
        }
        return uniqColor;
    }

    // Increment
    increment() {
        this.counter++;
    }

    // Decrement
    decrement() {
        if (this.counter > 1) {
            this.counter--;
        }
    }

    // Add to cart
    async addToCart(product: any) {
        product.quantity = this.counter || 1;
        const status = await this.productService.addToCart(product);
        if (status) {
            this.router.navigate(['/shop/cart']);
        }
    }

    ngOnDestroy() {
        if (this.modalOpen) {
            this.modalService.dismissAll();
        }
    }
}
