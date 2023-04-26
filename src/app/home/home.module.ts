import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {HomeRoutingModule} from './home-routing.module';
import {ShopComponent} from './shop/shop.component';

// Widget Components
import {SliderComponent} from './widgets/slider/slider.component';
import {ServicesComponent} from './widgets/services/services.component';

@NgModule({
    declarations: [
        ShopComponent,
        SliderComponent,
        ServicesComponent,
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule
    ]
})
export class HomeModule {
}
