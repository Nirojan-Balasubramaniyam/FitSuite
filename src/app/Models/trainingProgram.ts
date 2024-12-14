export interface TrainingProgram {
  programId: number;
  branchName:string;
  programName:string;
  typeId:number;
  typeName?:string;
  cost:number;
  description:string;
  imagePath:string;
}