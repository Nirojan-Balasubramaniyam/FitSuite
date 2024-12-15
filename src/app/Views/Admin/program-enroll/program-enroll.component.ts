import { Component, HostListener, TemplateRef } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Member } from '../../../Models/member';
import { ProgramType } from '../../../Models/programType';
import { TrainingProgram } from '../../../Models/trainingProgram';
import { AdminService } from '../../../Service/Staff/admin.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EnrollProgramService } from '../../../Service/Admin/Enroll-Program/enroll-program.service';
import { PaymentService } from '../../../Service/Admin/Payment/payment.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EnrollProgram, EnrollProgramReq } from '../../../Models/enrollProgram';
import { ToastrService } from 'ngx-toastr';
import { Payment, PaymentReq } from '../../../Models/payment';
import { FilterProgramPipe } from '../../../Pipes/Enroll-Program/filter-program.pipe';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-program-enroll',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxSpinnerModule,
    FilterProgramPipe,
    NgSelectModule],
  templateUrl: './program-enroll.component.html',
  styleUrl: './program-enroll.component.css'
})
export class ProgramEnrollComponent {
 

  isLightTheme: boolean = true;
  branchId: number = 0;
  totalRecords: number = 0;
  members: Member[] = [];
  months: any[] = [];
  programTypes: ProgramType[] = [];
  programs: TrainingProgram[] = []; // List of all programs (instead of grouped by type)
  programsByType: { [typeId: number]: TrainingProgram[] } = {}; // Grouped by typeId
  enrolledProgramsByType: { [typeId: number]: number[] } = {};
  selectedMember: number | null = null;
  selectedMonth: number = 1;
  selectedPrograms: number[] = []; // Store selected program IDs
  enrolledPrograms: number[] = []; // Store enrolled program IDs
  currentlySelectedPrograms: TrainingProgram[] = [];
  leavingPrograms: number[] = [];
  newlySelectedPrograms: TrainingProgram[] = [];
  allEnrollPrograms: EnrollProgram[] = [];
  selectedPaymentMethod: string = 'Cash';
  monthlyPayment: number = 0;
  totalPayment : number =0;
  discountedPayment: number = 0;
  additionalPayment: number = 0;
  isMonthSelectDisabled: boolean = false;
  remainingDays: number = 0;
  isNewMember: boolean = false;
  modalRef?: BsModalRef;
  isLargeScreen: boolean = false;
  searchText: string ="";



  constructor(
    private themeService: ThemeService,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private enrollProgramService: EnrollProgramService,
    private paymentService: PaymentService,
    private modalService: BsModalService,
    private toastr: ToastrService,) {

  }


  ngOnInit(): void {

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });
    this.checkScreenSize();
    this.loadMembers();
    this.loadMonths();
    this.loadProgramTypes();
    this.loadPrograms();
    this.loadProgramEnrolls();
    this.spinner.show();

  }

  loadMembers(pageIndex: number = 0, pageSize: number = 0, branchId: number = this.branchId): void {
    this.adminService.getAllMembers(pageIndex, pageSize, true, branchId).subscribe(response => {
      this.members = response.data;
      this.totalRecords = response.totalRecords;

      this.spinner.hide();

    });
  }

  loadMonths(): void {
    // Example: Load months
    this.months = [
      { id: 1, name: '1 Month' },
      { id: 3, name: '3 Month' },
      { id: 6, name: '6 Month' }
      // Add all months here...
    ];
  }

  loadProgramTypes(): void {
    // Fetch program types from API or service
    this.adminService.getAllProgramTypes().subscribe(types => {
      this.programTypes = types;
    });
  }

  loadProgramEnrolls(): void {
    // Fetch program types from API or service
    this.enrollProgramService.getAllEnrollPrograms().subscribe(enrolls => {
      this.allEnrollPrograms = enrolls;
    });
  }

  loadPrograms(): void {
    // Fetch programs from API or service
    this.adminService.getAllTrainingPrograms().subscribe(programs => {
      this.programs = programs;

      // Group programs by typeId
      this.programsByType = this.programs.reduce((acc, program) => {
        if (!acc[program.typeId]) {
          acc[program.typeId] = []; // Initialize as an empty array if undefined
        }
        acc[program.typeId].push(program);
        return acc;
      }, {} as { [typeId: number]: TrainingProgram[] });
    });
  }

  loadEnrolledProgramsForMember(memberId: number): void {
    this.spinner.show();
    this.enrollProgramService.getTrainingProgramsByMemberId(memberId).subscribe(response => {

      this.currentlySelectedPrograms = response;
      // Store enrolled programs directly as program IDs
      this.enrolledPrograms = response.map(program => program.programId);
      console.log("res", response)
      if (response.length > 0) {

        response.forEach(program => {
          if (!this.enrolledProgramsByType[program.typeId]) {
            this.enrolledProgramsByType[program.typeId] = [];
          }
          this.enrolledProgramsByType[program.typeId].push(program.programId);

        });
      } else {
        this.isNewMember = true;
      }

      this.calculateTotalAndAdditionalPayment();

      // Fetch the last renewal payment for the selected member
      this.paymentService.getLastRenewalPaymentForMember(memberId).subscribe(lastPayment => {
        if (lastPayment) {
          // Set month based on payment type
          this.isMonthSelectDisabled = true;
          switch (lastPayment.paymentType.toLocaleLowerCase()) {
            case 'monthly': this.selectedMonth = 1; break;
            case 'quarterly': this.selectedMonth = 3; break;
            case 'semi-annual': this.selectedMonth = 6; break;
            case 'annual': this.selectedMonth = 12; break;
            default: this.selectedMonth = 1; break;
          }
        } else {
          this.isMonthSelectDisabled = false;
        }
      });
    });
    this.spinner.hide();
  }

  onMonthChange() {
    let total: number = 0;

    // Reset payments
    this.totalPayment = 0;
    this.discountedPayment = 0;

    // Fetch newly selected programs
    this.newlySelectedPrograms = this.getNewlySelectedPrograms();

    // Calculate the total cost of selected programs
    total = this.calculateTotalProgramsCost(this.newlySelectedPrograms);

    console.log("total", total);
    console.log("month", this.selectedMonth);

    this.totalPayment = total;
    if (this.selectedMonth) {
        this.totalPayment = total * this.selectedMonth; // Calculate base payment
        console.log("Base Total Payment (before discount):", this.totalPayment);

        // Apply discount based on the selected month
        this.discountedPayment = this.calculateDiscountedAmount(total, this.selectedMonth.toString());
        console.log("Discounted Total Payment:", this.totalPayment);
    }
}

  onMemberChange(memberId: number | null): void {
    if (memberId !== null) {
      // Reset previously selected programs and total payment
      this.selectedPrograms = [];
      this.selectedMonth = 1;
      this.monthlyPayment = 0;
      this.totalPayment = 0;
      this.additionalPayment = 0;
      this.currentlySelectedPrograms = []; // Clear previously selected programs
      this.enrolledPrograms = [];
      this.newlySelectedPrograms =[];
      this.enrolledProgramsByType = [];
      this.isNewMember = false;

      // Load enrolled programs for the selected member
      this.loadEnrolledProgramsForMember(memberId);
    } else {
      // Clear selected member and reset the program data
      this.selectedMember = 0;
      this.selectedPrograms = [];
      this.selectedMonth = 1;
      this.monthlyPayment = 0;
      this.totalPayment = 0;
      this.additionalPayment = 0;
      this.enrolledPrograms = [];
      this.newlySelectedPrograms =[];
      this.enrolledProgramsByType = [];
      this.currentlySelectedPrograms = []; // Clear previously selected programs
      this.isNewMember = false;
    }
  }


  onProgramSelectionChange(programId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    const program = this.programs.find(p => p.programId === programId);

    if (program) {
      if (isChecked) {
        this.selectedPrograms.push(programId);

        // If this program was previously in leavingPrograms, remove it
        const leavingProgramIndex = this.leavingPrograms.indexOf(programId);
        if (leavingProgramIndex > -1) {
          this.leavingPrograms.splice(leavingProgramIndex, 1);
        }
        if (this.enrolledPrograms.includes(programId)) {
          this.currentlySelectedPrograms.push(program);

        }


      } else {
        // Remove the program from selectedPrograms and currentlySelectedPrograms
        const index = this.selectedPrograms.indexOf(programId);
        if (index > -1) {
          this.selectedPrograms.splice(index, 1);
        }

        if (this.enrolledPrograms.includes(programId)) {
          this.leavingPrograms.push(programId);
          const programIndex = this.currentlySelectedPrograms.findIndex(p => p.programId === programId);
          if (programIndex > -1) {
            this.currentlySelectedPrograms.splice(programIndex, 1);
          }
        }

        const programIndex = this.currentlySelectedPrograms.findIndex(p => p.programId === programId);
        if (programIndex > -1) {
          this.currentlySelectedPrograms.splice(programIndex, 1);
        }
      }

    }
    const newPrograms = this.getNewlySelectedPrograms();

    if (this.isNewMember) {
      this.newlySelectedPrograms = this.getNewlySelectedPrograms();

      const total = this.calculateTotalProgramsCost(this.newlySelectedPrograms);
      this.monthlyPayment = total;
      this.totalPayment = total * this.selectedMonth;

      if(this.selectedMonth ==1){
        this.totalPayment = total;
      }
    
      this.discountedPayment = this.calculateDiscountedAmount(total, this.selectedMonth.toString());

    }
    this.newlySelectedPrograms = this.getNewlySelectedPrograms();
    
    this.calculateTotalAndAdditionalPayment();
  }



  calculateTotalAndAdditionalPayment(): void {
    if (!this.selectedMember) return;

    this.spinner.show();
    // Fetch member's last renewal payment
    this.paymentService.getLastRenewalPaymentForMember(this.selectedMember).subscribe(lastPayment => {
      if (!lastPayment) {
        this.spinner.hide();
        return;
      }

      const newPrograms = this.getNewlySelectedPrograms();
      this.newlySelectedPrograms = newPrograms;

      let month:number = 1;
      switch (lastPayment.paymentType.toLocaleLowerCase()) {
        case 'monthly': month = 1; break;
        case 'quarterly': month = 3; break;
        case 'semi-annual': month = 6; break;
        case 'annual': month = 12; break;
        default: month = 1; break;
      }
    

      this.selectedMonth = month;
      const oldmonthlyPayment = this.calculateTotalProgramsCost(this.currentlySelectedPrograms);
      const newEnrollPayment = this.calculateTotalProgramsCost(this.newlySelectedPrograms);
      console.log("ff0",this.selectedMonth);
      this.monthlyPayment = oldmonthlyPayment + newEnrollPayment;
      this.totalPayment = this.monthlyPayment;

      // Calculate additional payment based on remaining days
      this.remainingDays = this.calculateRemainingDays(lastPayment.dueDate);
      this.additionalPayment = this.calculateAdditionalPayment(this.newlySelectedPrograms, this.remainingDays);

      this.spinner.hide();
    });
  }

  getCurrentlySelectedPrograms(): TrainingProgram[] {
    return this.selectedPrograms
      .map(programId => this.programs.find(program => program.programId === programId))
      .filter(program => program !== undefined) as TrainingProgram[];
  }

  getNewlySelectedPrograms(): TrainingProgram[] {
    return this.selectedPrograms
      .map(programId => this.programs.find(program => program.programId === programId))
      .filter(program => program !== undefined && !this.enrolledPrograms.includes(program.programId)) as TrainingProgram[];
  }


  calculateTotalProgramsCost(programs: TrainingProgram[]): number {
    return programs.reduce((total, program) => total + program.cost, 0);
  }

  calculateRemainingDays(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const remainingTime = due.getTime() - today.getTime();
    return Math.ceil(remainingTime / (1000 * 3600 * 24)); // Convert to days
  }

  calculateAdditionalPayment(programs: TrainingProgram[], remainingDays: number): number {
    const totalCost = this.calculateTotalProgramsCost(programs);

    const today = new Date();
    const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); // Get current day in month

    const additionalPayment = (totalCost / daysInCurrentMonth) * remainingDays;

    return Math.round(additionalPayment * 100) / 100;
  }

  calculateDiscountedAmount(amount: number, months: string): number {
    let finalAmount = amount; // Initialize with default value
    
    // Switch case to apply discounts based on months
    switch (months) {
      case "1":
        finalAmount = amount; // No discount for 1 month
        break;
      case "3":
        finalAmount = (3 * amount) - ((3 * amount) * 0.20); // Apply 10% discount on 3-month total
        break;
      case "6":
        finalAmount = (6 * amount) - ((6 * amount) * 0.3); // Apply 15% discount on 6-month total
        break;
      case "12":
        finalAmount = (12 * amount) - ((12 * amount) * 0.4); // Apply 25% discount on 12-month total
        break;
      default:
        console.log("Invalid months value. Defaulting to the base amount.");
        return Math.round(finalAmount / 100) * 100; // Return base amount rounded
    }
  
    console.log(`Final Amount Before Rounding: ${finalAmount}`); // Log the calculated amount before rounding
  
    // Return the final amount rounded to the nearest 100 if applicable
    return months === "1" ? finalAmount : Math.round(finalAmount / 100) * 100;
  }
  



  decline() {
    this.modalRef?.hide();
  }

  // confirm() {
  //   if (this.newlySelectedPrograms.length >= 1) {
  //     this.newlySelectedPrograms.forEach((program) => {

  //       const enrollment: EnrollProgramReq = {
  //         memberId: this.selectedMember,
  //         programId: program.programId,
  //       };

  //       this.enrollProgramService.enrollProgram(enrollment).subscribe(
  //         (response) => {
  //           console.log("Program Enrolled successfully")
  //           //this.selectedMember = 0;
  //         },
  //         (error) => {
  //           // Handle error in creating the enrollment (optional: error toast)
  //           console.error('Error creating enrollment:', error);
  //           this.toastr.error('There was an error delete the Training Program.', 'Error');
  //         }
  //       );
  //     });
  //     //payment
  //     let paymentType: string = "Monthly";
  //     if (this.selectedMonth === 1) {
  //       paymentType = "Monthly";
  //     } else if (this.selectedMonth === 3) {
  //       paymentType = "Quarterly";
  //     } else if (this.selectedMonth === 6) {
  //       paymentType = "Half-Yearly";
  //     } else if (this.selectedMonth === 12) {
  //       paymentType = "Annually";
  //     }

  //     const newPayment: PaymentReq = {
  //       memberId: this.selectedMember,
  //       paymentType: this.isNewMember? paymentType : 'Program Addon',
  //       amount: this.isNewMember ? this.discountedPayment : this.additionalPayment,
  //       paymentMethod: this.selectedPaymentMethod,
  //       paidDate: new Date().toISOString().split('T')[0]
  //     }
  //     this.paymentService.createPayment(newPayment).subscribe(
  //       (response) => { },
  //       error => {
  //         console.log('Error adding Payment', error);
  //         this.toastr.error('There was an error adding payment for enrollment.', 'Error');
  //       }
  //     );
  //     this.toastr.success(`Program ${this.isNewMember? 'Enrolled' : 'Updated'} successfully`, "Program Enroll", {
  //       timeOut: 3000,
  //       closeButton: true,
  //       easing: 'ease-in',
  //       progressBar: true,
  //       toastClass: 'ngx-toastr'
  //     });
  //     this.modalRef?.hide();
  //   } else {
  //     if (this.leavingPrograms.length >= 1) {
  //       this.leavingPrograms.forEach((programId) => {
  //         // Find the enrollment for the given programId and selectedMember
  //         const enrollment = this.allEnrollPrograms.find(
  //           (enroll) =>
  //             enroll.programId === programId && enroll.memberId === this.selectedMember
  //         );

  //         if (enrollment) {
  //           // If enrollment is found, delete it using the EnrollProgramService
  //           this.enrollProgramService.deleteEnrollProgram(enrollment.enrollId).subscribe(
  //             (response) => {
  //               // If deletion is successful, show a success message
  //               console.log(`Enrollment with Program ID: ${programId} deleted successfully.`);
  //             },
  //             (error) => {
  //               // If there is an error, show an error message
  //               console.error(`Error deleting enrollment for Program ID: ${programId}`, error);
  //               this.toastr.error(
  //                 `There was an error deleting the enrollment for program ${programId}.`,
  //                 'Error Deleting Enrollment'
  //               );
  //             }
  //           );
  //         }
  //       });
  //       this.toastr.success(
  //         `Enrollment for program deleted successfully.`,
  //         'Delete Enrollment',
  //         {
  //           timeOut: 3000,
  //           closeButton: true,
  //           easing: 'ease-in',
  //           progressBar: true,
  //           toastClass: 'ngx-toastr'
  //         }
  //       );
  //     }
  //   }

  //   this.modalRef?.hide();
  // }

  confirm() {
    if (this.selectedMember === null) {
      // Handle the case where `selectedMember` is null
      this.toastr.error('Please select a member.', 'Error');
      return; // Exit the function if no member is selected
    }

    if (this.selectedMonth === null) {
      // Handle the case where `selectedMember` is null
      this.toastr.error('Please select a member.', 'Error');
      return; // Exit the function if no member is selected
    }
  
    if (this.newlySelectedPrograms.length >= 1) {
      this.newlySelectedPrograms.forEach((program) => {
  
        const enrollment: EnrollProgramReq = {
          memberId: this.selectedMember!,  // Now it's safe to pass the value
          programId: program.programId,
        };
  
        this.enrollProgramService.enrollProgram(enrollment).subscribe(
          (response) => {
            console.log("Program Enrolled successfully")
            //this.selectedMember = 0;
          },
          (error) => {
            console.error('Error creating enrollment:', error);
            this.toastr.error('There was an error deleting the Training Program.', 'Error');
          }
        );
      });
  
      // Handle payment logic
      let paymentType: string = "Monthly";
      if (this.selectedMonth === 1) {
        paymentType = "Monthly";
      } else if (this.selectedMonth === 3) {
        paymentType = "Quarterly";
      } else if (this.selectedMonth === 6) {
        paymentType = "Semi-Annual";
      } else if (this.selectedMonth === 12) {
        paymentType = "Annually";
      }
  
      const newPayment: PaymentReq = {
        memberId: this.selectedMember,
        paymentType: this.isNewMember ? paymentType : 'Program Addon',
        amount: this.isNewMember ? this.discountedPayment : this.additionalPayment,
        paymentMethod: this.selectedPaymentMethod,
        paidDate: new Date().toISOString().split('T')[0]
      };
  
      this.paymentService.createPayment(newPayment).subscribe(
        (response) => { },
        error => {
          console.log('Error adding Payment', error);
          this.toastr.error('There was an error adding payment for enrollment.', 'Error');
        }
      );
  
      this.toastr.success(`Program ${this.isNewMember ? 'Enrolled' : 'Updated'} successfully`, "Program Enroll", {
        timeOut: 3000,
        closeButton: true,
        easing: 'ease-in',
        progressBar: true,
        toastClass: 'ngx-toastr'
      });
      this.modalRef?.hide();
    } 
      if (this.leavingPrograms.length >= 1) {
        this.leavingPrograms.forEach((programId) => {
          const enrollment = this.allEnrollPrograms.find(
            (enroll) => enroll.programId === programId && enroll.memberId === this.selectedMember
          );
  
          if (enrollment) {
            this.enrollProgramService.deleteEnrollProgram(enrollment.enrollId).subscribe(
              (response) => {
                console.log(`Enrollment with Program ID: ${programId} deleted successfully.`);
              },
              (error) => {
                console.error(`Error deleting enrollment for Program ID: ${programId}`, error);
                this.toastr.error(`There was an error deleting the enrollment for program ${programId}.`, 'Error Deleting Enrollment');
              }
            );
          }
        });
        this.toastr.success(`Enrollment for program deleted successfully.`, 'Delete Enrollment', {
          timeOut: 3000,
          closeButton: true,
          easing: 'ease-in',
          progressBar: true,
          toastClass: 'ngx-toastr'
        });
      }
    
  
    this.modalRef?.hide();
  }
  


  openModal(template: TemplateRef<void>) {

    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992; // Bootstrap lg breakpoint
  }




}
