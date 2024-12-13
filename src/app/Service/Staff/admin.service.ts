import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from '../../Models/branch';
import { PaginationResponse } from '../../Models/pagination';
import { Member } from '../../Models/member';
import { Observable } from 'rxjs';
import { TrainingProgram } from '../../Models/trainingProgram';
import { ProgramType } from '../../Models/programType';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private branchUrl = 'https://localhost:7220/api/Branch';
  private memberUrl = 'https://localhost:7220/api/Member';
  private trainingProgramUrl = 'https://localhost:7220/api/TrainingProgram';  
  private programTypeUrl = 'https://localhost:7220/api/ProgramType';  


  constructor(private http: HttpClient) { }

  getAllBranches() {
    return this.http.get<PaginationResponse<Branch>>(this.branchUrl);
  }

  createBranch(Branch: Branch) {
    return this.http.post(this.branchUrl, Branch);
  }

  deleteBranch(BranchId: number) {
    return this.http.delete(this.branchUrl + '/' + BranchId);
  }

  getBranch(BranchId: number) {
    return this.http.get<Branch>(this.branchUrl + '/' + BranchId);
  }

  updateBranch(Branch: Branch, BranchId: number) {
    return this.http.put(this.branchUrl + '/' + BranchId, Branch);
  }

  //Member API

  getAllMembers(pageNumber: number, pageSize: number, isActive: boolean, branchId: number): Observable<PaginationResponse<Member>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('isActive', isActive.toString())
      .set('branchId', branchId.toString());

    return this.http.get<PaginationResponse<Member>>(this.memberUrl, { params });
  }

  createMember(formData: FormData): Observable<string> {
    return this.http.post<string>(this.memberUrl, formData, {
      responseType: 'text' as 'json'  // Ensure the response is treated as plain text
    });
  }

  getMember(memberId: number) {
    return this.http.get<Member>(`${this.memberUrl}/${memberId}`);
  }

  updateMember(memberId: number, formData: FormData) {
    return this.http.put(`${this.memberUrl}/${memberId}`, formData);
  }


  deleteMember(memberId: number) {
    return this.http.delete(`${this.memberUrl}/${memberId}`);
  }


  // TrainingProgram API

  
  getAllTrainingPrograms() {
    return this.http.get<TrainingProgram[]>(this.trainingProgramUrl);
  }


  createTrainingProgram(formData: FormData) {
    return this.http.post(this.trainingProgramUrl, formData);
  }

 
  deleteTrainingProgram(programId: number) {
    return this.http.delete(`${this.trainingProgramUrl}/${programId}`);
  }

  
  getTrainingProgramById(programId: number) {
    return this.http.get<TrainingProgram>(`${this.trainingProgramUrl}/${programId}`);
  }

  
  updateTrainingProgram( programId: number, formData: FormData) {
    return this.http.put(`${this.trainingProgramUrl}/${programId}`, formData);
  }

  // ProgramType API

  getAllProgramTypes(): Observable<ProgramType[]> {
    return this.http.get<ProgramType[]>(this.programTypeUrl);
  }

  // Fetch a Program Type by ID
  getProgramTypeById(typeId: number): Observable<ProgramType> {
    return this.http.get<ProgramType>(`${this.programTypeUrl}/${typeId}`);
  }

  
  createProgramType(newProgramType: ProgramType): Observable<ProgramType> {
    return this.http.post<ProgramType>(this.programTypeUrl, newProgramType);
  }

 
  updateProgramType(typeId: number, updatedProgramType: ProgramType): Observable<ProgramType> {
    return this.http.put<ProgramType>(`${this.programTypeUrl}/${typeId}`, updatedProgramType);
  }

  
  deleteProgramType(typeId: number): Observable<void> {
    return this.http.delete<void>(`${this.programTypeUrl}/${typeId}`);
  }



}
