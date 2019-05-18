import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
@Injectable({
  providedIn: 'root',
})
export class LeaderService {
  constructor(private http: HttpClient, private phms: ProcessHTTPMsgService) {}
  getLeaders(): Observable<Leader[]> {
    return this.http
      .get<Leader[]>(`${baseURL}leadership`)
      .pipe(catchError(this.phms.handleError));
  }

  getLeader(id: string): Observable<Leader> {
    return this.http
      .get<Leader>(`${baseURL}leadership/${id}`)
      .pipe(catchError(this.phms.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http
      .get<Leader[]>(`${baseURL}leadership?featured=true`)
      .pipe(map(leader => leader[0]))
      .pipe(catchError(this.phms.handleError));
  }
}
