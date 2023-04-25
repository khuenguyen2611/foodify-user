export class OrderInfo {

    private _appUserName?: string;
    private _amount?: string;
    private _orderId?: string;

    constructor(appUserName: string, amount: string, orderId: string) {
        this._appUserName = appUserName;
        this._amount = amount;
        this._orderId = orderId;
    }

    get appUserName(): string {
        return this._appUserName;
    }

    set appUserName(value: string) {
        this._appUserName = value;
    }

    get amount(): string {
        return this._amount;
    }

    set amount(value: string) {
        this._amount = value;
    }

    get orderId(): string {
        return this._orderId;
    }

    set orderId(value: string) {
        this._orderId = value;
    }
}
