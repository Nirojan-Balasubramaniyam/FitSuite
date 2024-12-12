import { TrainingProgram } from "./trainingProgram";

export interface ProgramType {
    typeId: number;
    typeName: string;
    trainingPrograms?: TrainingProgram[]; 
  }