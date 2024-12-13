import { Component,OnInit } from '@angular/core';
import { AboutUsComponent } from '../about-us/about-us.component';
import { BMIComponent } from '../bmi/bmi.component';
import { TrainerComponent } from '../trainer/trainer.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutUsComponent,BMIComponent,TrainerComponent,ContactUsComponent,NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  counters = [
    { label: 'Members', targetValue: 749, currentValue: 0 },
    { label: 'Branches', targetValue: 10, currentValue: 0 },
    { label: 'Skilled Trainers', targetValue: 45, currentValue: 0 },
    { label: 'Team Members', targetValue: 967, currentValue: 0 }
  ];

  ngOnInit() {
    this.animateCounters();
  }

  animateCounters() {
    const duration = 2000; 
    const frameRate = 20; 
    const totalFrames = duration / frameRate;

    this.counters.forEach((counter) => {
      const increment = counter.targetValue / totalFrames;
      let frame = 0;

      const interval = setInterval(() => {
        frame++;
        counter.currentValue = Math.min(
          Math.ceil(counter.currentValue + increment),
          counter.targetValue
        );

        if (frame >= totalFrames) {
          clearInterval(interval);
          counter.currentValue = counter.targetValue; 
        }
      }, frameRate);
    });
  }

}
