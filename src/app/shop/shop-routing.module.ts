import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductSidebarComponent} from './product/sidebar/product-sidebar/product-sidebar.component';
import {CollectionLeftSidebarComponent} from './collection/collection-left-sidebar/collection-left-sidebar.component';
import {CartComponent} from './cart/cart.component';
import {WishlistComponent} from './wishlist/wishlist.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {SuccessComponent} from './checkout/success/success.component';

const routes: Routes = [
    {
        path: 'products/:id',
        component: ProductSidebarComponent
    },
    {
        path: 'products',
        component: CollectionLeftSidebarComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'wishlist',
        component: WishlistComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    {
        path: 'checkout/success/:id',
        component: SuccessComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShopRoutingModule {
}
