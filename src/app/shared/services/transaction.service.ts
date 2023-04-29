import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../classes/transaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transUrl = `${environment.foodOrderingBaseApiUrl}/transactions`;

  constructor(
    private httpClient: HttpClient
  ) { }

  createNewTransaction(transactionDto: Transaction) {
    return this.httpClient.post(this.transUrl, transactionDto);
  }
}
