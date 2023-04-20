import { Product } from "./product";

export class OrderDetail {
    productId: number;
    quantity: number;
}

export class OrderDetailResponse {
    product: Product;
    quantity: number;
}