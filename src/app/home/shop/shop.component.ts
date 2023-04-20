import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../shared/data/slider';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

    public products: Product[] = [];
    public trendingProducts: Product[] = [];
    public bestSellingProducts: Product[] = [];
    public ProductSliderConfig: any = ProductSlider;

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 10;
    sortBy = 'id';
    sortDir = 'asc'
    theTotalElements = 0;

    constructor(public productService: ProductService) {
        this.productService.getProducts.subscribe(response =>
            this.products = response
        );
    }

    // Sliders
    public sliders = [{
        title: '',
        subTitle: 'Giảm giá 10%',
        image: 'assets/images/slider/qc/qc-01.jpg'
    }, {
        title: 'save 10%',
        subTitle: 'fresh vegetables',
        image: 'assets/images/slider/qc/qc-02.jpg'
    }];

    // Blogs
    public blogs = [{
        image: 'assets/images/blog/6.jpg',
        date: '25 January 2018',
        title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
        by: 'John Dio'
    }, {
        image: 'assets/images/blog/7.jpg',
        date: '26 January 2018',
        title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
        by: 'John Dio'
    }, {
        image: 'assets/images/blog/8.jpg',
        date: '27 January 2018',
        title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
        by: 'John Dio'
    }, {
        image: 'assets/images/blog/9.jpg',
        date: '28 January 2018',
        title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
        by: 'John Dio'
    }]

    ngOnInit(): void {
        this.getTrendingProducts();
        this.getBestSellingProducts();
    }

    getTrendingProducts() {
        this.productService.getProductPagination(this.thePageNumber - 1, this.thePageSize, 'averageRating', 'desc')
            .subscribe(this.processTrendingResult())
    }

    getBestSellingProducts() {
        this.productService.getProductPagination(this.thePageNumber - 1, this.thePageSize, 'sold', 'desc')
            .subscribe(this.processBestSellingResult())
    }

    processTrendingResult() {
        return (data: any) => {
            this.trendingProducts = data.products;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        }
    }

    processBestSellingResult() {
        return (data: any) => {
            this.bestSellingProducts = data.products;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        }
    }

}
