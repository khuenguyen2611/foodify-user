import { Component, Input, OnInit } from '@angular/core';
import { NewProductSlider } from '../../../data/slider';
import { Product } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-product-box-vertical-slider',
    templateUrl: './product-box-vertical-slider.component.html',
    styleUrls: ['./product-box-vertical-slider.component.scss']
})
export class ProductBoxVerticalSliderComponent implements OnInit {

    @Input() title: string = 'Sản phẩm mới'; // Default
    @Input() category: string = '';
    @Input() type: string = 'fashion'; // Default Fashion

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 10;
    sortBy = 'createdTime';
    sortDir = 'desc'
    theTotalElements = 0;

    public products: Product[] = [];

    public NewProductSliderConfig: any = NewProductSlider;

    constructor(public productService: ProductService,
        private router: Router) {
        // this.productService.getProducts.subscribe(response =>
        //     this.products = response.filter(item => item.type === this.type)
        // );
    }


    ngOnInit(): void {
        this.productService.getProductPagination(this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
            .subscribe(this.processResult())
    }

    goToProduct(id: number) {
        this.router.navigate(['/shop/products', id]).then(() => {
            window.location.reload();
        })
    }

    processResult() {
        return (data: any) => {
            this.products = data.products;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        }
    }
}
