import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnrollProgram, EnrollProgramReq } from '../../../Models/enrollProgram';
import { TrainingProgram } from '../../../Models/trainingProgram';

@Injectable({
  providedIn: 'root'
})
export class EnrollProgramService {
  private enrollUrl = 'https://gymfeemanagementsystem-appservice.azurewebsites.net/api/EnrollProgram'; 
  private trainingProgramUrl = 'https://gymfeemanagementsystem-appservice.azurewebsites.net/training-programs'; 

  constructor(private http: HttpClient) { }

 
  enrollProgram(enrollProgram: EnrollProgramReq): Observable<EnrollProgram> {
    return this.http.post<EnrollProgram>(this.enrollUrl, enrollProgram);
  }

  
  getAllEnrollPrograms(): Observable<EnrollProgram[]> {
    return this.http.get<EnrollProgram[]>(this.enrollUrl);
  }

  
  getEnrollProgramById(enrollProgramId: number): Observable<EnrollProgram> {
    return this.http.get<EnrollProgram>(`${this.enrollUrl}/enrollprogram-id/${enrollProgramId}`);
  }

  
  getTrainingProgramsByMemberId(memberId: number): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.trainingProgramUrl}/${memberId}`);
  }

  
  updateEnrollProgram(enrollProgram: EnrollProgram): Observable<EnrollProgram> {
    return this.http.put<EnrollProgram>(this.enrollUrl, enrollProgram);
  }

  deleteEnrollProgram(enrollProgramId: number): Observable<void> {
    return this.http.delete<void>(`${this.enrollUrl}/${enrollProgramId}`);
  }
}
