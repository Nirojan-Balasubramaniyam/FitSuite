import { Pipe, PipeTransform } from '@angular/core';
import { TrainingProgram } from '../../Models/trainingProgram';

@Pipe({
  name: 'programFilter',
  standalone: true
})
export class ProgramFilterPipe implements PipeTransform {

  transform(trainingPrograms: TrainingProgram[], searchText: string): TrainingProgram[] {
    if (!searchText) {
      return trainingPrograms;  
    }
    
    const normalizedSearchText = searchText.toLowerCase(); 
    
    return trainingPrograms.filter(program =>
      program.programName.toLowerCase().includes(normalizedSearchText) || 
      program.typeName?.toLowerCase().includes(normalizedSearchText) || 
      program.cost.toString().includes(normalizedSearchText) || 
      program.description.toLowerCase().includes(normalizedSearchText)
    );
  }

}
