import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingProgram } from '../../../Models/trainingProgram';

@Component({
  selector: 'app-programmes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programmes.component.html',
  styleUrl: './programmes.component.css'
})
export class ProgrammesComponent implements OnInit {
   programs: TrainingProgram[] = [
    {
        programId: 1,
        branchName: 'Downtown',
        programName: 'Yoga',
        typeId: 101,
        typeName: 'Fitness',
        cost: 2000,
        description: 'Improve your flexibility and mental well-being with our Yoga program.',
        imagePath: '../../../../../assessts/yoga.jpg',
    },
    {
        programId: 2,
        branchName: 'Uptown',
        programName: 'Pilates',
        typeId: 102,
        typeName: 'Strength',
        cost: 2500,
        description: 'Enhance your core strength and posture with Pilates.',
        imagePath: '../../../../../assessts/pilates.jpg',
    },
    {
        programId: 3,
        branchName: 'Midtown',
        programName: 'Zumba',
        typeId: 103,
        typeName: 'Cardio',
        cost: 1800,
        description: 'Enjoy an energetic and fun cardio workout with Zumba.',
        imagePath: '../../../../../assessts/zumba.jpg',
    },
    {
        programId: 4,
        branchName: 'Downtown',
        programName: 'Strength Training',
        typeId: 104,
        typeName: 'Fitness',
        cost: 3000,
        description: 'Build your strength and endurance with our strength training program.',
        imagePath: '../../../../../assessts/strength.jpg',
    },
    {
        programId: 5,
        branchName: 'Uptown',
        programName: 'Aerobics',
        typeId: 105,
        typeName: 'Cardio',
        cost: 2200,
        description: 'Stay active and fit with high-energy aerobics sessions.',
        imagePath: '../../../../../assessts/aerobics.jpg',
    },
    {
        programId: 6,
        branchName: 'Midtown',
        programName: 'CrossFit',
        typeId: 106,
        typeName: 'Fitness',
        cost: 3500,
        description: 'Challenge yourself with high-intensity CrossFit workouts.',
        imagePath: '../../../../../assessts/crossfit.jpg',
    },
    {
        programId: 7,
        branchName: 'Downtown',
        programName: 'Meditation',
        typeId: 107,
        typeName: 'Mental Wellness',
        cost: 1500,
        description: 'Relax and rejuvenate with guided meditation sessions.',
        imagePath: '../../../../../assessts/meditation.jpg',
    },
    {
        programId: 8,
        branchName: 'Uptown',
        programName: 'Kickboxing',
        typeId: 108,
        typeName: 'Martial Arts',
        cost: 2800,
        description: 'Learn self-defense while staying fit with kickboxing.',
        imagePath: '../../../../../assessts/kickboxing.jpg',
    },
    {
        programId: 9,
        branchName: 'Midtown',
        programName: 'Dance Fitness',
        typeId: 109,
        typeName: 'Cardio',
        cost: 2000,
        description: 'Dance your way to fitness with our dance fitness classes.',
        imagePath: '../../../../../assessts/dance.jpg',
    },
];

  constructor() {}

  ngOnInit(): void {}

  addProgram(program: TrainingProgram): void {
    this.programs.push(program);
}

}
