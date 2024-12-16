import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactUs, ContactUsService } from '../../../Service/ContactUs/contact-us.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly contactUsService:ContactUsService,
    private readonly toastr:ToastrService,
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const form = this.contactForm.value
      const data:ContactUs = {
        name: form.name,
        email: form.email,
        message: form.message,
        submittedAt: new Date(),
      }
      this.contactUsService.addContactUsMessage(data).subscribe({
        next: (response) => {
        },
        complete:()=>{
          this.toastr.success("Send Message Successfully",'')
        }
      })
      this.contactForm.reset();
    }
  }

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
}
