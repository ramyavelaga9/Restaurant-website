import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
// import { PROMOTIONS } from '../shared/promotions';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {ProcessHTTPMsgService } from './process-httpmsg.service';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {baseURL} from '../shared/baseurl';
import {map,catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL+'promotions').
      pipe(catchError(this.processhttpmsgservice.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL+'promotions/'+id).
        pipe(catchError(this.processhttpmsgservice.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL+'promotions?featured=true').
    pipe(map(dishes=>dishes[0])).pipe(catchError(this.processhttpmsgservice.handleError));
  }
  
  constructor(private http:HttpClient, private processhttpmsgservice:ProcessHTTPMsgService) { }
}
