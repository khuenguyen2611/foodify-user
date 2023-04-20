import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Product } from '../classes/product';
import { ProductService } from './product.service';

@Injectable({
    providedIn: 'root'
})
export class Resolver implements Resolve<Product> {

    public product: Product = {
        averageRating: 0,
        categories: [],
        cost: 0,
        description: "",
        discountPercent: 0,
        id: 0,
        images: [],
        isEnabled: false,
        name: "",
        quantity: 0,
        reviewCount: 0,
        shop: null,
        sold: 0
    };

    constructor(
        private router: Router,
        public productService: ProductService
    ) {
    }

    // Resolver
    async resolve(route: ActivatedRouteSnapshot): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.productService.getProductBySlug(route.params.slug).subscribe(product => {
            if (!product) { // When product is empty redirect 404
                this.router.navigateByUrl('/pages/404', { skipLocationChange: true });
            } else {
                this.product = product;
            }
        });
        return this.product;
    }
}
