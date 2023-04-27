import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../classes/product";

@Component({
    selector: 'app-product-box-vertical',
    templateUrl: './product-box-vertical.component.html',
    styleUrls: ['./product-box-vertical.component.scss']
})
export class ProductBoxVerticalComponent implements OnInit {

    @Input() product: Product;
    @Input() currency: any;

    public ImageSrc: string

    constructor() {
    }

    ngOnInit(): void {

    }
}
