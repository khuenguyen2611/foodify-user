import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {PagesRoutingModule} from './pages-routing.module';

import {GalleryModule} from 'ng-gallery';
import {LightboxModule} from 'ng-gallery/lightbox';

// Pages Components
import {WishlistComponent} from './account/wishlist/wishlist.component';
import {DashboardComponent} from './account/dashboard/dashboard.component';
import {LoginComponent} from './account/login/login.component';
import {RegisterComponent} from './account/register/register.component';
import {ProfileComponent} from './account/profile/profile.component';
import {CheckoutComponent} from './account/order/checkout.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {UserAddressesComponent} from './account/user-addresses/user-addresses.component';
import {OrderListComponent} from './account/order-list/order-list.component';

@NgModule({
    declarations: [
        WishlistComponent,
        DashboardComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        CheckoutComponent,
        AboutUsComponent,
        UserAddressesComponent,
        OrderListComponent
    ],
    imports: [
        CommonModule,
        GalleryModule,
        LightboxModule,
        SharedModule,
        PagesRoutingModule
    ]
})
export class PagesModule {
}
