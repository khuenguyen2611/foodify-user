import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Address } from '../classes/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl = `${environment.foodOrderingBaseApiUrl}/addresses`

  constructor(private httpClient: HttpClient) { }

  getAddressById(id: number) {
    return this.httpClient.get<Address>(this.baseUrl + `/${id}`);
  }

}
