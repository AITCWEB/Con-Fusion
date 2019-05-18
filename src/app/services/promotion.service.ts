import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  constructor(private http: HttpClient, private phms: ProcessHTTPMsgService) {}
  getPromotions(): Observable<Promotion[]> {
    return this.http
      .get<Promotion[]>(`${baseURL}PROMOTIONS`)
      .pipe(catchError(this.phms.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http
      .get<Promotion>(`${baseURL}PROMOTIONS/${id}`)
      .pipe(catchError(this.phms.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http
      .get<Promotion[]>(`${baseURL}PROMOTIONS?featured=true`)
      .pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.phms.handleError));
  }
}
