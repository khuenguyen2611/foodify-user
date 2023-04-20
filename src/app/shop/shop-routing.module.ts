import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';
import { ThreeColumnComponent } from './product/three-column/three-column.component';
import { FourImageComponent } from './product/four-image/four-image.component';
import { BundleProductComponent } from './product/bundle-product/bundle-product.component';
import { ImageOutsideComponent } from './product/image-outside/image-outside.component';

import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';
import { CollectionNoSidebarComponent } from './collection/collection-no-sidebar/collection-no-sidebar.component';
import {
    CollectionInfinitescrollComponent
} from './collection/collection-infinitescroll/collection-infinitescroll.component';

import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CompareComponent } from './compare/compare.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';

import { Resolver } from '../shared/services/resolver.service';

const routes: Routes = [
    {
        path: 'products/:id',
        component: ProductLeftSidebarComponent
    },
    {
        path: 'product/three/column/:slug',
        component: ThreeColumnComponent,
        resolve: {
            data: Resolver
        }
    },
    {
        path: 'product/four/image/:slug',
        component: FourImageComponent,
        resolve: {
            data: Resolver
        }
    },
    {
        path: 'product/bundle/:slug',
        component: BundleProductComponent,
        resolve: {
            data: Resolver
        }
    },
    {
        path: 'product/image/outside/:slug',
        component: ImageOutsideComponent,
        resolve: {
            data: Resolver
        }
    },
    {
        path: 'products',
        component: CollectionLeftSidebarComponent
    },
    {
        path: 'collection/no/sidebar',
        component: CollectionNoSidebarComponent
    },
    {
        path: 'collection/infinitescroll',
        component: CollectionInfinitescrollComponent
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
        path: 'compare',
        component: CompareComponent
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
