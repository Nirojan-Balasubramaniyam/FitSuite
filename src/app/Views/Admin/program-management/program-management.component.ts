import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../Service/Staff/admin.service';
import { TrainingProgram } from '../../../Models/trainingProgram';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgramType } from '../../../Models/programType';
import { ProgramFilterPipe } from '../../../Pipes/Program-Filter/program-filter.pipe';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-program-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule ,MatIconModule, MatDividerModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule, ProgramFilterPipe],
  templateUrl: './program-management.component.html',
  styleUrl: './program-management.component.css'
})
export class ProgramManagementComponent {

  isLightTheme: boolean = true;
  trainingPrograms: TrainingProgram[] = [];
  programTypes: ProgramType[] = [];
  modalRef?: BsModalRef;
  programId: number = 0;
  programName:string="";
  programForm: FormGroup;
  searchText: string = '';
  fullImgPath: string = "https://gymfeemanagementsystem-appservice.azurewebsites.net";

  @ViewChild('trainingProgramForm') trainingProgramForm!: TemplateRef<any>;



  constructor(
    private themeService: ThemeService,
    private adminService: AdminService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    this.programForm = this.fb.group({
      programName: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      imageFile: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });
    this.spinner.show();
    this.loadTrainingPrograms();
    this.loadProgramTypes();
  }

  loadTrainingPrograms(): void {
    this.adminService.getAllTrainingPrograms().subscribe(
      (response) => {
        this.trainingPrograms = response; // Assign response to trainingPrograms array
        console.log('Loaded training programs:', this.trainingPrograms);
        this.spinner.hide();

      },
      (error) => {
        this.spinner.hide();
        console.error('Error loading training programs:', error);
      }
    );
  }

  loadProgramTypes(): void {
    this.adminService.getAllProgramTypes().subscribe(
      (response) => {
        this.programTypes = response;

        this.spinner.hide();

      },
      (error) => {
        this.spinner.hide();
        console.error('Error loading programtype:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.programForm.valid) {
      const formdata = this.programForm.value;
      const formData = new FormData();

      formData.append('TypeId', this.programForm.get('typeId')?.value);
      formData.append('ProgramName', this.programForm.get('programName')?.value);
      formData.append('Cost', this.programForm.get('cost')?.value);
      formData.append('Description', this.programForm.get('description')?.value);

      const imageFile = this.programForm.get('imageFile')?.value;
      if (imageFile) {
        formData.append('ImageFile', imageFile, imageFile.name);  
      }

      if (this.programId != 0) {
        // If programId exists, update the Training Program
        this.adminService.updateTrainingProgram(this.programId, formData).subscribe(
          (response) => {
            console.log('Training Program updated successfully', response);
            this.toastr.success("Training Program updated successfully", "Training Program Update", {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr'
            });
            this.modalRef?.hide();
            this.loadTrainingPrograms();
            this.programId = 0;
            this.programForm.reset();
          },
          error => {
            console.log('Error updating Training Program', error);
            this.toastr.error('There was an error updating the Training Program.', 'Error');
          }
        );
      } else {
        // If no programId, create a new Training Program
        this.adminService.createTrainingProgram(formData).subscribe(
          (response) => {
            console.log('Training Program created successfully, token:', response);
            this.toastr.success("Training Program created successfully", "Training Program Creation", {
              timeOut: 5000,
              closeButton: true,
              easing: 'ease-in',
              progressBar: true,
              toastClass: 'ngx-toastr'
            });
            this.modalRef?.hide();
            this.programId = 0;
            this.programForm.reset();
            this.loadTrainingPrograms();
          },
          error => {
            console.log('Error creating Training Program', error);
            this.toastr.error('There was an error creating the Training Program.', 'Error');
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }

  onEdit(programId: number): void {
    const program = this.trainingPrograms.find(p => p.programId === programId);
    if (program) {
      this.programId = programId; // Store programId for updating

      // Patch the form with the selected program's data
      this.programForm.patchValue({
        programId: program.programId,
        programName: program.programName,
        typeId: program.typeId,
        cost: program.cost,
        description: program.description,
        imagePath: program.imagePath || ''
      });

      this.openModalWithClass(this.trainingProgramForm);

    }
  }

  isRequired(field: string): boolean {
    return this.programForm.get(field)?.hasValidator(Validators.required) ?? false;
  }
  

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.programForm.patchValue({
        imageFile: file
      });
    }
  }

  getLabelBackground() {
    return this.isLightTheme ? 'white' : 'var(--bs-dark-bg-subtle)';
  }

  decline() {
    this.modalRef?.hide();
  }

  confirm() {
    this.adminService.deleteTrainingProgram(this.programId).subscribe(
      (response) => {

        this.toastr.success("Training Program Deleted successfully", "Delete Training Program", {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr'
        });
        this.modalRef?.hide();
        this.programId = 0;
        this.loadTrainingPrograms();
      },
      error => {
        console.log('Error creating Training Program', error);
        this.toastr.error('There was an error delete the Training Program.', 'Error');
      }
    );
    this.modalRef?.hide();
  }


  openModal(template: TemplateRef<void>, Id: number) {
    this.programId = Id;
    const findedProgram = this.trainingPrograms.find(p => p.programId === Id);
    if(findedProgram){
      this.programName = findedProgram.programName
    }

    this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'modal-md' }) );
  }

  openModalWithClass(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    this.modalRef.onHide?.subscribe(() => {
      this.programForm.reset();
      // Reset form when modal is closed
    });
  }

}
