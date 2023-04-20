import { OrderDetail, OrderDetailResponse } from "./order-detail";
import { Shop } from "./shop";
import { User } from "./user";

export class OrderDto {
    address: string;
    lat: string;
    lng: string;
    orderDetails: OrderDetail[];
    orderTrackingNumber: string;
    paymentMethod: string;
    shippingCost: number;
    status: string = 'AWAITING';
}

export class OrderResponse {
    id: number;
    address: string;
    shipper: Shipper;
    orderTrackingNumber: string;
    paymentMethod: string;
    productCost: number;
    shippingCost: number;
    total: number;
    orderTime: string;
    status: string;
    orderDetails: OrderDetailResponse[];
}

export class OrderResponsePageable {
    orders: OrderResponse[];
}

export class Shipper {
    user: User;
    shop: Shop;
}