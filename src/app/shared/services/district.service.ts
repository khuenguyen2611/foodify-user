import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { District } from '../classes/district';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/districts`

  constructor(private httpClient: HttpClient) { }

  getAllDistricts() {
    return this.httpClient.get<District[]>(this.baseUrl);
  }
}
