import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { environment } from 'src/environments/environment';
import { StringBoolObject } from '../string-bool-object';
import { FirebaseService } from './firebase.service';

const state = {
    products: JSON.parse(localStorage.products || '[]'),
    wishlist: JSON.parse(localStorage.wishlistItems || '[]'),
    compare: JSON.parse(localStorage.compareItems || '[]'),
    cart: JSON.parse(localStorage.cartItems || '[]')
};

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    public Currency = { name: 'VND', currency: 'VND', price: 1 }; // Default Currency
    public OpenCart = false;
    public Products;
    private baseUrl = environment.foodOrderingBaseApiUrl;
    private isLoggedIn = this.firebaseService.IsLoggedIn();


    private productUrl = `${environment.foodOrderingBaseApiUrl}/products`;
    private userUrl = `${environment.foodOrderingBaseApiUrl}/users`;
    private sameShop = false;

    constructor(private httpClient: HttpClient,
        private toastrService: ToastrService,
        private firebaseService: FirebaseService) {
    }

    /*
      ---------------------------------------------
      ---------------  Product  -------------------
      ---------------------------------------------
    */

    // Product
    // this.baseUrl + '/products'
    // assets/data/products.json
    private get products(): Observable<Product[]> {
        this.Products = this.httpClient.get<Product[]>(this.baseUrl + '/v1/products/enable').pipe(map(data => data));

        this.Products.subscribe(next => {
            localStorage.products = JSON.stringify(next);
        });
        this.Products = this.Products.pipe(
            startWith(JSON.parse(localStorage.products || '[]')));
        return this.Products;
    }

    // Get Product Pageable
    getProductPagination(thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
        return this.httpClient.get<GetResponseProducts>(this.productUrl + `?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}"`);
    }

    // Get Products
    public get getProducts(): Observable<Product[]> {
        return this.products;
    }

    // Get Products By Slug
    public getProductBySlug(slug: string): Observable<Product> {
        return this.products.pipe(map(items => {
            return items.find((item: any) => {
                return item.name.replace(' ', '-') === slug;
            });
        }));
    }


    /*
      ---------------------------------------------
      ---------------  Wish List  -----------------
      ---------------------------------------------
    */

    // Get Wishlist Items
    public get wishlistItems(): Observable<Product[]> {
        const itemsStream = new Observable(observer => {
            observer.next(state.wishlist);
            observer.complete();
        });
        return itemsStream as Observable<Product[]>;
    }

    // Add to Wishlist
    public addToWishlist(userId: number, product: Product) {
        if (this.isLoggedIn) {
            return this.httpClient.post<StringBoolObject>(this.userUrl + `/${userId}/loves/${product.id}`, '').subscribe({
                next: () => {
                    this.toastrService.success(`${product.name} đã được thêm vào danh sách yêu thích.`);
                }
            });
        }
        else {
            this.toastrService.warning("Vui lòng đăng nhập trước khi thêm sản phẩm yêu thích ^^")
        }
    }

    // Check Wishlist Product
    checkFavouriteProduct(userId: number, productId: number) {
        return this.httpClient.get<StringBoolObject>(this.userUrl + `/${userId}/loves/${productId}`);
    }

    deleteWishlistItem(userId: number, product: Product) {
        return this.httpClient.delete(this.userUrl + `/${userId}/loves/${product.id}`).subscribe({
            next: () => {
                this.toastrService.warning(`${product.name} đã được xoá khỏi danh sách yêu thích.`);
            }
        });
    }

    // Remove Wishlist items
    public removeWishlistItem(product: Product): any {
        const index = state.wishlist.indexOf(product);
        state.wishlist.splice(index, 1);
        localStorage.setItem('wishlistItems', JSON.stringify(state.wishlist));
        return true;
    }

    /*
      ---------------------------------------------
      -----------------  Cart  --------------------
      ---------------------------------------------
    */

    // Get Cart Items
    public get cartItems(): Observable<Product[]> {
        const itemsStream = new Observable(observer => {
            observer.next(state.cart);
            observer.complete();
        });
        return itemsStream as Observable<Product[]>;
    }

    // Add to Cart
    public addToCart(product: Product): any {
        this.sameShop = false;
        const carts: Product[] = state.cart;
        if (carts.length > 0) {
            carts.forEach((prod) => {
                if (product.shop.name == prod.shop.name) {
                    this.sameShop = true;
                }
            });

            if (this.sameShop) {
                const cartItem = state.cart.find(item => item.id === product.id);
                const qty = product.quantity ? product.quantity : 1;
                const items = cartItem ? cartItem : product;

                if (cartItem) {
                    cartItem.quantity += qty;
                } else {
                    state.cart.push({
                        ...product,
                        quantity: qty
                    });
                }

                this.OpenCart = true; // If we use cart variation modal
                localStorage.setItem('cartItems', JSON.stringify(state.cart));
                this.toastrService.success(`Thêm ${product.name} vào giỏ hàng thành công`);
            }

            if (!this.sameShop) {
                this.toastrService.error('Chỉ thêm được sản phẩm cùng shop vào giỏ hàng!');
            }
        } else {
            const cartItem = state.cart.find(item => item.id === product.id);
            const qty = product.quantity ? product.quantity : 1;
            const items = cartItem ? cartItem : product;
            // const stock = this.calculateStockCounts(items, qty);
            // if (!stock) return false

            if (cartItem) {
                cartItem.quantity += qty;
            } else {
                state.cart.push({
                    ...product,
                    quantity: qty
                });
            }

            this.OpenCart = true; // If we use cart variation modal
            localStorage.setItem('cartItems', JSON.stringify(state.cart));
            this.toastrService.success(`Thêm ${product.name} vào giỏ hàng thành công`);
        }
    }

    // Update Cart Quantity
    public updateCartQuantity(product: Product, quantity: number): Product | boolean {
        return state.cart.find((items, index) => {
            if (items.id === product.id) {
                const qty = state.cart[index].quantity + quantity;
                const stock = this.calculateStockCounts(state.cart[index], quantity);
                if (qty !== 0 && stock) {
                    state.cart[index].quantity = qty;
                }
                localStorage.setItem('cartItems', JSON.stringify(state.cart));
                return true;
            }
        });
    }

    // Calculate Stock Counts
    public calculateStockCounts(product, quantity) {
        const qty = product.quantity + quantity;
        const stock = product.stock;
        if (stock < qty || stock == 0) {
            this.toastrService.error('You can not add more items than available. In stock ' + stock + ' items.');
            return false;
        }
        return true;
    }

    // Remove Cart items
    public removeCartItem(product: Product): any {
        const index = state.cart.indexOf(product);
        state.cart.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(state.cart));
        return true;
    }

    // Total amount
    public cartTotalAmount(): Observable<number> {
        return this.cartItems.pipe(map((product: Product[]) => {
            return product.reduce((prev, curr: Product) => {
                let cost = curr.cost;
                if (curr.discountPercent) {
                    cost = curr.cost - (curr.cost * curr.discountPercent / 100);
                }
                return (prev + cost * curr.quantity) * this.Currency.price;
            }, 0);
        }));
    }

    /*
      ---------------------------------------------
      ------------  Filter Product  ---------------
      ---------------------------------------------
    */

    // Get Product Filter
    public filterProducts(filter?: any): Observable<Product[]> {
        return this.products.pipe(map(product =>
            product.filter((item: Product) => {
                if (!filter.length) {
                    return true;
                }
                const Tags = filter.some((prev) => { // Match Tags
                    if (item.categories) {
                        if (item.categories.includes(prev)) {
                            return prev;
                        }
                    }
                });
                return Tags;
            })
        ));
    }

    // Sorting Filter
    public sortProducts(products: Product[], payload: string): any {

        if (payload === 'ascending') {
            return products.sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                } else if (a.id > b.id) {
                    return 1;
                }
                return 0;
            });
        } else if (payload === 'a-z') {
            return products.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        } else if (payload === 'z-a') {
            return products.sort((a, b) => {
                if (a.name > b.name) {
                    return -1;
                } else if (a.name < b.name) {
                    return 1;
                }
                return 0;
            });
        } else if (payload === 'low') {
            return products.sort((a, b) => {
                if (a.cost < b.cost) {
                    return -1;
                } else if (a.cost > b.cost) {
                    return 1;
                }
                return 0;
            });
        } else if (payload === 'high') {
            return products.sort((a, b) => {
                if (a.cost > b.cost) {
                    return -1;
                } else if (a.cost < b.cost) {
                    return 1;
                }
                return 0;
            });
        }
    }

    /*
      ---------------------------------------------
      ------------- Product Pagination  -----------
      ---------------------------------------------
    */
    public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
        // calculate total pages
        const totalPages = Math.ceil(totalItems / pageSize);

        // Paginate Range
        const paginateRange = 3;

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage: number, endPage: number;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage < paginateRange - 1) {
            startPage = 1;
            endPage = startPage + paginateRange - 1;
        } else {
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        };
    }

    getProductById(id: number) {
        return this.httpClient.get<Product>(this.productUrl + `/${id}`);
    }

}

export interface GetResponseProductNoParam {
    products: Product[];
}

export interface Page {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

interface GetResponseProducts {
    products: Product[];
    page: {
        pageNo: number,
        pageSize: number,
        totalElements: number,
        totalPages: number,
    };
}
