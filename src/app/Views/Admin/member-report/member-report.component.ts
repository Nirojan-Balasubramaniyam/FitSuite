import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../Service/Admin/Report/report.service';
import { AdminService } from '../../../Service/Staff/admin.service';
import { MemberReport } from '../../../Models/memberReport';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Member } from '../../../Models/member';
import { MemberReportFilterPipe } from '../../../Pipes/Report/Member-Report/member-report-filter.pipe';

@Component({
  selector: 'app-member-report',
  standalone: true,
  imports: [CommonModule,
    BsDatepickerModule,
    FormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgbPaginationModule,
    MemberReportFilterPipe
  ],
  templateUrl: './member-report.component.html',
  styleUrl: './member-report.component.css'
})
export class MemberReportComponent {
  isLightTheme: boolean = true;
  selectedMember: number | null = null;
  members: MemberReport[] = [];
  allMembers: Member[] = [];
  isActive: boolean = true;
  activeMemberCount: number =0;
  nonActiveMemberCount: number =0;
  groupedProgramsByMember: { [memberId: number]: { [key: string]: any[] } } = {}; 
  branchId: number = 1;
  p: number = 1;

  groupedPrograms: { [key: string]: any[] } = {};


  constructor(
    private themeService: ThemeService,
    private spinner: NgxSpinnerService,
    private adminService: AdminService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });

    this.spinner.show();
    this.loadAllMembers();
    this.loadMemberReports();
    this.membersCount();
    
  }

  loadAllMembers(): void {
    this.adminService.getAllMembers(0, 0, true, 1).subscribe((data) => {
      this.allMembers = data.data;
      this.spinner.hide();

      console.log(this.allMembers);
    });
  }

  membersCount():void{
    this.reportService.getMemberReport(true,this.branchId)
      .subscribe((data) => {
        this.activeMemberCount = data.length;
      });

      this.reportService.getMemberReport(false,this.branchId)
      .subscribe((data) => {
        this.nonActiveMemberCount = data.length;
      });

  }

  loadMemberReports(): void {

    this.reportService.getMemberReport(this.isActive,this.branchId)
      .subscribe((data) => {
        this.members = data;
        this.spinner.hide();
      
        this.members.forEach(member => {
          this.groupedProgramsByMember[member.memberId] = this.groupTrainingProgramsByType(member);
        });

        this.members.forEach(member => {
          this.groupedPrograms = this.groupTrainingProgramsByType(member);
        })
      });
  }

  memberStatusChange(){
    this.isActive = !this.isActive;
    this.spinner.show();
    this.loadMemberReports();

  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isProgramsEmpty(programs: { [key: string]: any[] }): boolean {
    // Check if the object is undefined or has no keys
    if (!programs || Object.keys(programs).length === 0) {
        return true; // No programs at all
    }

    // Check if all arrays are empty
    return Object.values(programs).every(arr => arr.length === 0);
}

  groupTrainingProgramsByType(member: MemberReport): { [key: string]: any[] } {
    if (!member.trainingProgramsList || !Array.isArray(member.trainingProgramsList)) {
      return {NewMember: ['No Programs Enrolled'],}; // Return empty object if the list is undefined or not an array
    }

    return member.trainingProgramsList.reduce((acc: { [key: string]: any[] }, program) => {
      const typeName = program.typeName || 'Unknown';
      if (!acc[typeName]) {
        acc[typeName] = [];
      }
      acc[typeName].push(program);
      return acc;
    }, {});
  } 

}
