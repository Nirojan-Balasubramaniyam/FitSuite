import { Pipe, PipeTransform } from '@angular/core';
import { WorkoutPlan } from '../../Models/workoutPlans';

@Pipe({
  name: 'workoutPlanFilter',
  standalone: true
})
export class WorkoutPlanFilterPipe implements PipeTransform {

  transform(workoutPlans: WorkoutPlan[], searchText: string): WorkoutPlan[] {
      if (!searchText) {
        return workoutPlans;  
      }
      
      const normalizedSearchText = searchText.toLowerCase(); 
      
      return workoutPlans.filter(workout =>
        workout.name.toLowerCase().includes(normalizedSearchText) || 
        workout.repsCount.toString().includes(normalizedSearchText) || 
        workout.weight.toString().includes(normalizedSearchText)  
     
      );
    }
}

