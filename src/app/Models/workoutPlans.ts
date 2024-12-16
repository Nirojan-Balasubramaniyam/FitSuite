export interface WorkoutPlanReq {
    name: string;        
    repsCount: number;   
    weight: number;      
    staffId: number;      
  }
  
  export interface WorkoutPlan {
    workoutPlanId:number,
    name:string,
    repsCount:number,
    weight:number,
    staffId :number,
    memberId:number,
    startTime:Date,
    endTime:Date,
    isDone:boolean
  }
  