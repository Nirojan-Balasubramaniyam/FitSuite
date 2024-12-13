import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NgFor,CommonModule],
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


  testimonials = [
    {
      personName: 'Alex Johnson',
      profession: 'Fitness Enthusiast',
      imagepath: '../../../../../assessts/testimonial/testimonial-1.jpg',
      rating: 5,
      feedback: 'Joining this gym has been a life-changing decision. The trainers are professional, and the equipment is top-notch. I’ve never felt more motivated to stay fit!'
    },
    {
      personName: 'Sophia Martinez',
      profession: 'Yoga Instructor',
      imagepath: '../../../../../assessts/testimonial/testimonial-1.jpg',
      rating: 4,
      feedback: 'The variety of classes here is incredible. From yoga to strength training, there’s something for everyone. The community is supportive and welcoming.'
    },
    {
      personName: 'Michael Carter',
      profession: 'Athlete',
      imagepath: '../../../../../assessts/testimonial/testimonial-1.jpg',
      rating: 5,
      feedback: 'As an athlete, I need a gym that meets my rigorous training needs. This gym delivers beyond expectations with its advanced facilities and expert trainers.'
    },
    {
      personName: 'Emily Davis',
      profession: 'Personal Trainer',
      imagepath: '../../../../../assessts/testimonial/testimonial-1.jpg',
      rating: 4,
      feedback: 'I love the atmosphere here! It’s clean, well-maintained, and the staff genuinely care about your fitness journey. Highly recommended for anyone serious about health and wellness.'
    },
    {
      personName: 'Chris Wilson',
      profession: 'Business Owner',
      imagepath: '../../../../../assessts/testimonial/testimonial-1.jpg',
      rating: 4,
      feedback: 'Balancing work and fitness is tough, but this gym makes it easy. Their flexible hours and personal training sessions have helped me stay in great shape!'
    }
  ];

  generateStars(rating: number): boolean[] {
    return Array(5)
      .fill(true)
      .map((_, index) => index < rating);
  }

}
