import { Injectable } from '@angular/core';
import { WorkoutPlan } from '../../../Models/workoutPlans';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkouplanService {

  private workoutPlanUrl = 'https://localhost:7220/api/WorkoutPlan';  


  constructor(private http: HttpClient) {}

  
  AddWorkOutPlans(data:WorkOutPlanRequest){
    return this.http.post(this.workoutPlanUrl, data);
  };

  
  GetUniqueMembers(){
    return this.http.get(`${this.workoutPlanUrl}/UniqueMembers}`)
  }

  getWorkoutplansForMember(memberId: number) {
    return this.http.get<WorkoutPlan[]>(
      `${this.workoutPlanUrl}/Done/${memberId}`
    );
  }

  GetAllWorkOutPlan(memberId: number){
    return this.http.get<WorkoutPlan[]>(
      `${this.workoutPlanUrl}/All/${memberId}`
    );
  }

  StartPlan(Id:number){
    return this.http.get<WorkoutPlan[]>(
      `${this.workoutPlanUrl}/Start/${Id}`
    );
  }

  EndPlan(Id:number){
    return this.http.get<WorkoutPlan[]>(
      `${this.workoutPlanUrl}/End/${Id}`
    );
  }
}

export interface WorkOutPlanRequest {
  name:string;
  repsCount: number;
  weight: number;
  staffId: number;
  memberId: number;
}
