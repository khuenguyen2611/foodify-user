import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../classes/user';
import { Address } from '../classes/address';
import { StringBoolObject } from '../string-bool-object';
import { Product } from '../classes/product';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = `${environment.foodOrderingBaseApiUrl}/users`

  constructor(private httpClient: HttpClient) { }

  getUserById(id: number) {
    return this.httpClient.get<User>(this.baseUrl + `/${id}`);
  }

  getUserByEmail(email: string) {
    return this.httpClient.get<User>(this.baseUrl + `/email/${email}`);
  }

  editUser(userId: number, user: User) {
    return this.httpClient.put<User>(this.baseUrl + `/${userId}`, user);
  }

  //Addresses
  getAddressesByUser(userId: number) {
    return this.httpClient.get<ResponseAddresses>(this.baseUrl + `/${userId}/addresses`);
  }

  createAddressForUser(userId: number, address: Address) {
    return this.httpClient.post<StringBoolObject>(this.baseUrl + `/${userId}/addresses`, address)
  }

  updateUserAddress(userId: number, addressId: number, updateAddress: Address) {
    return this.httpClient.put<Address>(this.baseUrl + `/${userId}/addresses/${addressId}`, updateAddress)
  }

  updateUserDefaultAddress(userId: number, defaultAddressId: number) {
    return this.httpClient.put(this.baseUrl + `/${userId}/addresses/default?addressId=${defaultAddressId}`, '');
  }

  deleteUserAddress(userId: number, addressId: number) {
    return this.httpClient.delete(this.baseUrl + `/${userId}/addresses/${addressId}`)
  }

  //Products
  getLoveProductsByUser(userId: number) {
    return this.httpClient.get<ResponseProducts>(this.baseUrl + `/${userId}/loves`)
  }

  deleteLoveProductByUser(userId: number, productId: number) {
    return this.httpClient.delete(this.baseUrl + `/${userId}/loves/${productId}`)
  }
}

interface ResponseAddresses {
  addresses: Address[];
  page: {
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
  };
}

interface ResponseProducts {
  products: Product[];
  page: {
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
  };
}