export class ProductDto {
    private _name?: string;
    private _price?: string;
    private _quantity?: string;

    constructor(name: string, price: string, quantity: string) {
        this._name = name;
        this._price = price;
        this._quantity = quantity;
    }
    
    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get price(): string {
        return this._price;
    }

    set price(value: string) {
        this._price = value;
    }

    get quantity(): string {
        return this._quantity;
    }

    set quantity(value: string) {
        this._quantity = value;
    }
}
