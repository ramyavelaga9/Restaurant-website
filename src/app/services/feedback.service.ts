import { Injectable } from '@angular/core';
import {Feedback} from '../shared/feedback';
import {baseURL} from '../shared/baseurl';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  submitFeedback(feedback:Feedback):Observable<Feedback|any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
      return this.http.post(baseURL+'feedback',feedback,httpOptions).
        pipe(catchError(this.processhttpmsgservice.handleError));
  }
  constructor(private http:HttpClient, private processhttpmsgservice:ProcessHTTPMsgService) { }
}
