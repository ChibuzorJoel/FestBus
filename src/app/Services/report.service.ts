import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {


  private apiUrl = 'https://your-backend-api-url.com/report';  // Replace with your backend API endpoint

  constructor(private http: HttpClient) { }

  // Function to submit the report data to the server
  submitReport(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}