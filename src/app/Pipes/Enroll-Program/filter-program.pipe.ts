import { Pipe, PipeTransform } from '@angular/core';
import { TrainingProgram } from '../../Models/trainingProgram';

@Pipe({
  name: 'filterProgram',
  standalone: true
})
export class FilterProgramPipe implements PipeTransform {

  transform(programsByType: { [typeId: number]: TrainingProgram[] }, searchQuery: string): { [typeId: number]: TrainingProgram[] } {
    if (!searchQuery) return programsByType; // If no search query, return the original array

    const filteredProgramsByType: { [typeId: number]: TrainingProgram[] } = {};

    for (const typeId in programsByType) {
      const filteredPrograms = programsByType[typeId].filter(program =>
        program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.typeName?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredPrograms.length > 0) {
        filteredProgramsByType[typeId] = filteredPrograms;
      }
    }

    return filteredProgramsByType;
  }

}
