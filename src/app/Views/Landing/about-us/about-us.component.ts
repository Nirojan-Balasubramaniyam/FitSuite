import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NgFor],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  facilities = [
    {
      name: 'Cardio Zone',
      description: 'State-of-the-art treadmills, ellipticals, and cycling machines.',
      image: '/assessts/facility1.jpg'
    },
    {
      name: 'Weight Training',
      description: 'Free weights, machines, and strength-training equipment.',
      image: '/assessts/facility2.jpg'
    },
    {
      name: 'Yoga Studio',
      description: 'Peaceful space for yoga and meditation sessions.',
      image: '/assessts/facility3.jpg'
    },
    {
      name: 'Swimming Pool',
      description: 'Indoor heated pool for laps and relaxation.',
      image: '/assessts/facility4.jpg'
    },
    {
      name: 'Sauna & Steam',
      description: 'Relax and rejuvenate with our sauna and steam rooms.',
      image: '/assessts/facility5.jpg'
    },
    {
      name: 'Indoor Running Track',
      description: 'Climate-controlled running track for year-round exercise.',
      image: '/assessts/facility6.jpg'

    }
  ];

}
