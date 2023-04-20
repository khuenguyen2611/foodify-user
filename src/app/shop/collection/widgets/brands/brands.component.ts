import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from '../../../../shared/classes/product';

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

    count = 0;
    @Input() products: Product[] = [];
    @Input() shops: any[] = [];

    @Output() brandsFilter: EventEmitter<any> = new EventEmitter<any>();

    public collapse: boolean = true;
    brands: string[];

    constructor() {
    }

    ngOnInit(): void {
        this.brands = [...new Set(this.products.map(item => item.shop.name))];
    }

    // get filterbyBrand() {
    //   const uniqueBrands = [];
    //   this.products.filter((product) => {
    //     if (product.shop.name) {
    //       const index = uniqueBrands.indexOf(product.shop.name)
    //       if (index === -1) uniqueBrands.push(product.shop.name)
    //     }
    //   })
    //   return uniqueBrands
    // }
    // filterbyBrand() {
    //     const uniqueBrands = [...new Set(this.products.map(item => item.shop.name))];
    //     // this.products.filter((product) => {
    //     //     if (product.shop.name) {
    //     //         const index = uniqueBrands.indexOf(product.shop.name);
    //     //         if (index === -1) uniqueBrands.push(product.shop.name);
    //     //     }
    //     // });
    //     console.log(this.count++);
    //     return uniqueBrands;
    // }

    appliedFilter(event) {
        let index = this.shops.indexOf(event.target.value);  // checked and unchecked value
        if (event.target.checked) {
            this.shops.push(event.target.value); // push in array checked value
        } else {
            this.shops.splice(index, 1);  // removed in array unchecked value
        }
        let shops = this.shops.length ? {shop: this.shops.join(',')} : {shops: null};
        this.brandsFilter.emit(shops);
    }

    // check if the item are selected
    checked(item) {
        if (this.shops.indexOf(item) != -1) {
            return true;
        }
    }

}
