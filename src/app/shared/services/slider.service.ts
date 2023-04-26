import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Slider } from '../classes/slider';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/sliders`

  constructor(private httpClient: HttpClient) { }

  getAllSliders() {
    return this.httpClient.get<Slider[]>(this.baseUrl);
  }
}
