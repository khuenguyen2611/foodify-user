import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Ng5SliderModule} from 'ng5-slider';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {SharedModule} from '../shared/shared.module';
import {ShopRoutingModule} from './shop-routing.module';

// Product Details Components
import {ProductSidebarComponent} from './product/sidebar/product-sidebar/product-sidebar.component';
// Product Details Widget Components
import {ServicesComponent} from './product/widgets/services/services.component';
import {SocialComponent} from './product/widgets/social/social.component';
import {RelatedProductComponent} from './product/widgets/related-product/related-product.component';

// Collection Components
import {CollectionLeftSidebarComponent} from './collection/collection-left-sidebar/collection-left-sidebar.component';

// Collection Widgets
import {GridComponent} from './collection/widgets/grid/grid.component';
import {PaginationComponent} from './collection/widgets/pagination/pagination.component';
import {BrandsComponent} from './collection/widgets/brands/brands.component';
import {PriceComponent} from './collection/widgets/price/price.component';

import {CartComponent} from './cart/cart.component';
import {WishlistComponent} from './wishlist/wishlist.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {SuccessComponent} from './checkout/success/success.component';

import {RouterModule} from '@angular/router';


@NgModule({
    declarations: [
        ProductSidebarComponent,
        ServicesComponent,
        SocialComponent,
        RelatedProductComponent,
        CollectionLeftSidebarComponent,
        GridComponent,
        PaginationComponent,
        BrandsComponent,
        PriceComponent,
        CartComponent,
        WishlistComponent,
        CheckoutComponent,
        SuccessComponent
    ],
    imports: [
        CommonModule,
        Ng5SliderModule,
        InfiniteScrollModule,
        SharedModule,
        ShopRoutingModule,
        RouterModule
    ]
})
export class ShopModule {
}
