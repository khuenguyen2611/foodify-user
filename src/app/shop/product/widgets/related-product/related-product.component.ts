import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { Category } from 'src/app/shared/classes/category';

@Component({
    selector: 'app-related-product',
    templateUrl: './related-product.component.html',
    styleUrls: ['./related-product.component.scss']
})
export class RelatedProductComponent implements OnInit {

    @Input() type: string;
    @Input() categories: Category[] = [];
    public products: Product[] = [];

    constructor(public productService: ProductService) {

    }

    ngOnInit(): void {
        this.productService.getProducts.subscribe(response =>
            this.products = response.filter(item => item.categories[0].name === this.type)
        );
    }
}
