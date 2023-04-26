import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BarRatingModule} from 'ngx-bar-rating';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {TranslateModule} from '@ngx-translate/core';

// Header and Footer Components
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';

// Components
import {CategoriesComponent} from './components/categories/categories.component';
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {ProductBoxOneComponent} from './components/product/product-box-one/product-box-one.component';
import {ProductBoxVerticalComponent} from './components/product/product-box-vertical/product-box-vertical.component';
import {
    ProductBoxVerticalSliderComponent
} from './components/product/product-box-vertical-slider/product-box-vertical-slider.component';

// Modals Components
import {QuickViewComponent} from './components/modal/quick-view/quick-view.component';
import {CartVariationComponent} from './components/modal/cart-variation/cart-variation.component';

// Tap To Top
import {TapToTopComponent} from './components/tap-to-top/tap-to-top.component';

// Pipes
import {DiscountPipe} from './pipes/discount.pipe';
import {SettingsComponent} from './components/settings/settings.component';
import {ProductBoxTwoComponent} from "./components/product/product-box-two/product-box-two.component";
import {CartModalComponent} from "./components/modal/cart-modal/cart-modal.component";

@NgModule({
    declarations: [
        FooterComponent,
        HeaderComponent,
        SettingsComponent,
        BreadcrumbComponent,
        CategoriesComponent,
        ProductBoxOneComponent,
        ProductBoxTwoComponent,
        ProductBoxVerticalComponent,
        ProductBoxVerticalSliderComponent,
        QuickViewComponent,
        CartVariationComponent,
        TapToTopComponent,
        DiscountPipe,
        CartModalComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        CarouselModule,
        BarRatingModule,
        LazyLoadImageModule,
        NgxSkeletonLoaderModule,
        TranslateModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        CarouselModule,
        BarRatingModule,
        LazyLoadImageModule,
        NgxSkeletonLoaderModule,
        TranslateModule,
        FooterComponent,
        HeaderComponent,
        BreadcrumbComponent,
        CategoriesComponent,
        ProductBoxOneComponent,
        ProductBoxTwoComponent,
        ProductBoxVerticalComponent,
        ProductBoxVerticalSliderComponent,
        QuickViewComponent,
        CartVariationComponent,
        TapToTopComponent,
        DiscountPipe,
        CartModalComponent
    ]
})
export class SharedModule {
}
