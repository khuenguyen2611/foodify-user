import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Comment } from '../classes/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = `${environment.foodOrderingBaseApiUrl}`

  constructor(private httpClient: HttpClient) { }

  getCommentsByProduct(id: number) {
    return this.httpClient.get<CommentResponse>(this.baseUrl + `/products/${id}/comments?pageSize=10`)
  }
}

interface CommentResponse {
  comments: Comment[];
  page: {
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
  };
}
