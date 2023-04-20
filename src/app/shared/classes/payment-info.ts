import {ProductDto} from './product-dto';
import {OrderInfo} from './OrderInfo';

export class PaymentInfo {

    private _items: ProductDto[];
    private _orderInfo: OrderInfo;

    constructor(items: ProductDto[], orderInfo: OrderInfo) {
        this._items = items;
        this._orderInfo = orderInfo;
    }

    get items(): ProductDto[] {
        return this._items;
    }

    set items(value: ProductDto[]) {
        this._items = value;
    }

    get orderInfo(): OrderInfo {
        return this._orderInfo;
    }

    set orderInfo(value: OrderInfo) {
        this._orderInfo = value;
    }
}
