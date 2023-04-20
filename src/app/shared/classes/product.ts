import {Category} from "./category";
import {ProductImage} from "./product-image";
import {Shop} from "./shop";

// Products
export interface Product {
    // id?: number;
    // title?: string;
    // description?: string;
    // type?: string;
    // brand?: string;
    // collection?: any[];
    // category?: string;
    // price?: number;
    // sale?: boolean;
    // discount?: number;
    // stock?: number;
    // new?: boolean;
    // quantity?: number;
    // tags?: any[];
    // variants?: Variants[];
    // images?: Images[];

    id?: number;
    title?: string;
    type?: string;
    brand?: string;
    collection?: any[];
    category?: string;
    price?: number;
    sale?: boolean;
    discount?: number;
    stock?: number;
    new?: boolean;
    quantity?: number;
    tags?: any[];
    // images?: Images[];

    //Back-end
    name?: string;
    isEnabled: boolean;
    description?: string;
    discountPercent?: number;
    cost?: number;
    averageRating?: number;
    reviewCount: number;
    sold: number;
    shop?: Shop;
    categories: Category[];
    images: ProductImage[];
}

// export interface Images {
//     image_id?: number;
//     id?: number;
//     alt?: string;
//     src?: string;
//     variant_id?: any[];
// }
