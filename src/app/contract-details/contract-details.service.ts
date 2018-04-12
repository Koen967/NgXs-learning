import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ContractDetail } from './contract-details.model';

@Injectable()
export class ContractDetailsService {
  url = 'http://accountmanagement.tf2.inforit.local/api/contracts/ng2';

  constructor(private http: HttpClient) {}

  getContractDetailsFromId(id: number): Observable<ContractDetail> {
    return this.http.get<ContractDetail>(this.url + '/contract-details/' + id);
  }
}
