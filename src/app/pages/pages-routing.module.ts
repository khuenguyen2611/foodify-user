import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {WishlistComponent} from './account/wishlist/wishlist.component';
import {DashboardComponent} from './account/dashboard/dashboard.component';
import {LoginComponent} from './account/login/login.component';
import {RegisterComponent} from './account/register/register.component';
import {ProfileComponent} from './account/profile/profile.component';
import {CheckoutComponent} from './account/order/checkout.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {UserAddressesComponent} from './account/user-addresses/user-addresses.component';
import {OrderListComponent} from './account/order-list/order-list.component';


const routes: Routes = [
    {
        path: 'wishlist',
        component: WishlistComponent
    },
    {
        path: 'my-orders',
        component: OrderListComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'addresses',
        component: UserAddressesComponent
    },
    {
        path: 'order/:id',
        component: CheckoutComponent
    },
    {
        path: 'aboutus',
        component: AboutUsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
