import { Component, OnInit } from '@angular/core';
import { TrainingProgram } from '../../../Models/TrainingProgram';
import { CommonModule } from '@angular/common';

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
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
    {
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
    {
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
    {
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
    {
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
    {
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
    {
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
    {
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
    {
      title: 'Yoga',
      price: 2000,
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius libero soluta impedit eligendi? Quibusdam, laudantium.',
      imageUrl: '/assessts/yoga.jpg'
    },
   
   
   
    
  ];

  constructor() {}

  ngOnInit(): void {}

  addProgram(program: TrainingProgram): void {
    this.programs.push(program);
}

}
