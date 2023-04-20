import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StringBoolObject } from '../string-bool-object';
import { Register } from '../classes/register';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/auth`;

  constructor(private httpClient: HttpClient) { }

  checkEmailOrPhoneNumberExist(userDto: Register) {
    return this.httpClient.post<StringBoolObject>(this.baseUrl + `/check`, userDto);
  }

  checkIdentifiedCodeExist(code: string) {
    return this.httpClient.get<StringBoolObject>(this.baseUrl + `/check?code=${code}`)
  }

  //Sign-up new User
  SignUpUser(register: Register) {
    return this.httpClient.post<User>(this.baseUrl + '/signup', register);
  }


}
