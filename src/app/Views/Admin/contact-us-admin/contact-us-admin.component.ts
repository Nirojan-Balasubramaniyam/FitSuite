import { Component } from '@angular/core';
import {
  ContactUsService,
  GetContactUs,
} from '../../../Service/ContactUs/contact-us.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailService } from '../../../Service/Admin/MailService/mail.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us-admin',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './contact-us-admin.component.html',
  styleUrl: './contact-us-admin.component.css',
})
export class ContactUsAdminComponent {

  responseForm!: FormGroup;
  allMessages: GetContactUs[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  currentLength: number = 0;
  totalItems: number = 0;

  constructor(
    private contactService: ContactUsService,
    private readonly sendMailService: MailService,
    private readonly tostar: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadMessages();
    this.initializeForm();
  }

  initializeForm(): void {
    this.responseForm = this.fb.group({
      senderName: [{ value: '', disabled: true }], 
      messagePreview: [{ value: '', disabled: true }], 
      response: ['', [Validators.required]]
    });
  }

  loadMessages() {
    this.contactService
      .getContactUsMessage(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.allMessages = response.data;
          this.totalItems = response.totalRecords;
        },
        complete: () => {
          this.currentLength = this.allMessages.length;
          this.totalPages =
            Math.ceil(this.totalItems / this.pageSize) <= 0
              ? 0
              : Math.ceil(this.totalItems / this.pageSize);
        },
        error: (error: any) => {
          console.log(error.error);
        },
      });
  }

  refreshMessages() {
    this.loadMessages();
  }


  selectedMessage!:GetContactUs
  response(message: GetContactUs) {
    this.responseForm.patchValue({
      senderName: message.name,
      messagePreview: message.message
    });
    this.selectedMessage = message
  }

  openDeleteModal(id: number) {

  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMessages();
    }
  }

  onSubmitResponse(){
    if(this.selectedMessage){
      const data: any = {
        name:this.selectedMessage.name,
        adminResponse:this.responseForm.value.response,
        email:this.selectedMessage.email,
        emailType: 2,
        messageId:this.selectedMessage.messageId
      };

      this.sendMailService.sendMessageResponse(data).subscribe({
        next: (response: any) => {},
        complete: () => {
          this.loadMessages();
          this.tostar.success('Message sent successfully');
        },
      });
    }
  }
}
