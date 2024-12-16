import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch, BranchReq } from '../../Models/branch';
import { PaginationResponse } from '../../Models/pagination';
import { Member } from '../../Models/member';
import { Observable } from 'rxjs';
import { ProgramType } from '../../Models/programType';
import { Staff } from '../../Models/staff';
import { TrainingProgram } from '../../Models/trainingProgram';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private branchUrl = 'https://gymfeemanagementsystem-appservice.azurewebsites.net/api/Branch';
  private memberUrl = 'https://gymfeemanagementsystem-appservice.azurewebsites.net/api/Member';
  private trainingProgramUrl = 'https://gymfeemanagementsystem-appservice.azurewebsites.net/api/TrainingProgram';  
  private programTypeUrl = 'https://gymfeemanagementsystem-appservice.azurewebsites.net/api/ProgramType';  


  constructor(private http: HttpClient) { }

  getAllBranches() {
    return this.http.get<PaginationResponse<Branch>>(this.branchUrl);
  }

  createBranch(branchRequest: BranchReq): Observable<any> {
    return this.http.post<any>(`${this.branchUrl}`, branchRequest);
  }

  deleteBranch(BranchId: number) {
    return this.http.delete(this.branchUrl + '/' + BranchId);
  }

  getBranch(BranchId: number) {
    return this.http.get<Branch>(this.branchUrl + '/' + BranchId);
  }

  updateBranch(branchId: number, branch: BranchReq) {
    return this.http.put(this.branchUrl + '/' + branchId, branch);
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

  updateMemberPassword(memberId: number, password: string) {
    const payload = { password }; // Send the password inside an object
    return this.http.put(`${this.memberUrl}/update-password/${memberId}`, payload);
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


  private staffUrl = `https://gymfeemanagementsystem-appservice.azurewebsites.net/api/Staff`; 

 

  // Get all staff with pagination
  getAllStaffs(pageNumber: number, pageSize: number, isActive: boolean): Observable<PaginationResponse<Staff>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('isActive', isActive.toString());
  
    return this.http.get<PaginationResponse<Staff>>(this.staffUrl, { params });
  }
  

  // Add a new staff member
  addStaff(formData: FormData): Observable<string> {
    return this.http.post<string>(this.staffUrl, formData, {
      responseType: 'text' as 'json'  // Ensure the response is treated as plain text
    });
  }

  // Get staff by ID
  getStaffById(staffId: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.staffUrl}/${staffId}`);
  }

  // Update staff details
  updateStaff(staffId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.staffUrl}/${staffId}`, formData);
  }

  // Delete a staff member
  deleteStaff(staffId: number): Observable<any> {
    return this.http.delete(`${this.staffUrl}/${staffId}`);
  }

  // Staff login
  login(email: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.get<any>(`${this.staffUrl}/login`, { params });
  }



}
