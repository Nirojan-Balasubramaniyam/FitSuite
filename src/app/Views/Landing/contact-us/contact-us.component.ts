import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  // FAQ Data
  faqs = [
    {
      question: 'What are your membership plans?',
      answer: 'We offer monthly, quarterly, and annual membership plans to suit your needs.',
      showAnswer: false
    },
    {
      question: 'What facilities do you provide?',
      answer: 'We provide a range of facilities, including a gym, personal training, group classes, and more.',
      showAnswer: false
    },
    {
      question: 'What are your opening hours?',
      answer: 'We are open from 6:00 AM to 10:00 PM on weekdays and 8:00 AM to 8:00 PM on weekends.',
      showAnswer: false
    }
  ];

  // Toggle FAQ Answer Visibility
  toggleFaq(faq: any): void {
    faq.showAnswer = !faq.showAnswer;
  }

  // Form Submission Logic
  onSubmit(): void {
    alert('Your message has been sent. We will get back to you shortly.');
  }

}
