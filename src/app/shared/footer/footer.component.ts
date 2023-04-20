import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../classes/product';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  products: Product[] = [];

  @Input() class: string = 'footer-light' // Default class 
  @Input() themeLogo: string = 'assets/images/icon/logo.png' // Default Logo
  @Input() newsletter: boolean = true; // Default True

  public today: number = Date.now();

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productService.getProductPagination(0, 5, 'sold', 'desc').subscribe((data) => {
      this.products = data.products;
    })
  }

}
