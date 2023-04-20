export class ShippingResponse {
    distance: number;
    cost: number;
    location: Location
}

export class Location {
    lat: string;
    lng: string;
}