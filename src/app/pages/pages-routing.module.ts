import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WishlistComponent } from './account/wishlist/wishlist.component';
import { CartComponent } from './account/cart/cart.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ContactComponent } from './account/contact/contact.component';
import { CheckoutComponent } from './account/order/checkout.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SearchComponent } from './search/search.component';
import { TypographyComponent } from './typography/typography.component';
import { ReviewComponent } from './review/review.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { CompareOneComponent } from './compare/compare-one/compare-one.component';
import { CompareTwoComponent } from './compare/compare-two/compare-two.component';
import { CollectionComponent } from './collection/collection.component';
import { LookbookComponent } from './lookbook/lookbook.component';
import { ErrorComponent } from './error/error.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { FaqComponent } from './faq/faq.component';
import { ForbiddenComponent } from './account/forbidden/forbidden.component';
import { UserAddressesComponent } from './account/user-addresses/user-addresses.component';
import { OrderListComponent } from './account/order-list/order-list.component';

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
        path: 'cart',
        component: CartComponent
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
        path: 'forget/password',
        component: ForgetPasswordComponent
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
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'order/:id',
        component: CheckoutComponent
    },
    {
        path: 'aboutus',
        component: AboutUsComponent
    },
    {
        path: 'search',
        component: SearchComponent
    },
    {
        path: 'typography',
        component: TypographyComponent
    },
    {
        path: 'review',
        component: ReviewComponent
    },
    {
        path: 'order/success',
        component: OrderSuccessComponent
    },
    {
        path: 'compare/one',
        component: CompareOneComponent
    },
    {
        path: 'compare/two',
        component: CompareTwoComponent
    },
    {
        path: 'collection',
        component: CollectionComponent
    },
    {
        path: 'lookbook',
        component: LookbookComponent
    },
    {
        path: '404',
        component: ErrorComponent
    },
    {
        path: '403',
        component: ForbiddenComponent
    },
    {
        path: 'comingsoon',
        component: ComingSoonComponent
    },
    {
        path: 'faq',
        component: FaqComponent
    }
    // {
    //     path: 'blog/left/sidebar',
    //     component: BlogLeftSidebarComponent
    // },
    // {
    //     path: 'blog/right/sidebar',
    //     component: BlogRightSidebarComponent
    // },
    // {
    //     path: 'blog/no/sidebar',
    //     component: BlogNoSidebarComponent
    // },
    // {
    //     path: 'blog/details',
    //     component: BlogDetailsComponent
    // },
    // {
    //     path: 'portfolio/grid/two',
    //     component: GridTwoComponent
    // },
    // {
    //     path: 'portfolio/grid/three',
    //     component: GridThreeComponent
    // },
    // {
    //     path: 'portfolio/grid/four',
    //     component: GridFourComponent
    // },
    // {
    //     path: 'portfolio/masonry/grid/two',
    //     component: MasonryGridTwoComponent
    // },
    // {
    //     path: 'portfolio/masonry/grid/three',
    //     component: MasonryGridThreeComponent
    // },
    // {
    //     path: 'portfolio/masonry/grid/four',
    //     component: MasonryGridFourComponent
    // },
    // {
    //     path: 'portfolio/masonry/full-width',
    //     component: MasonryFullWidthComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
