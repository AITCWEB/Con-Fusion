import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(private http: HttpClient, private phms: ProcessHTTPMsgService) {}
  getDishes(): Observable<Dish[]> {
    return this.http
      .get<Dish[]>(`${baseURL}dishes`)
      .pipe(catchError(this.phms.handleError));
  }

  getDish(id: number): Observable<Dish> {
    return this.http
      .get<Dish>(`${baseURL}dishes/${id}`)
      .pipe(catchError(this.phms.handleError));
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http
      .get<Dish[]>(`${baseURL}dishes?featured=true`)
      .pipe(map(dishes => dishes[0]))
      .pipe(catchError(this.phms.handleError));
  }

  getDishIds(): Observable<number[] | any> {
    return this.getDishes()
      .pipe(map(dishes => dishes.map(dish => dish.id)))
      .pipe(error => error);
  }
  putDish(dish: Dish): Observable<Dish> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .put<Dish>(`${baseURL}dishes/${dish.id}`, dish, httpOptions)
      .pipe(catchError(this.phms.handleError));
  }
}
