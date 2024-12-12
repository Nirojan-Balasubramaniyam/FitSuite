import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { TrainingProgram } from '../../../Models/trainingProgram';
import { ProgramReport } from '../../../Models/programReport';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ReportService } from '../../../Service/Admin/Report/report.service';
import { AdminService } from '../../../Service/Staff/admin.service';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProgramTypeFilterPipe } from '../../../Pipes/Report/Program-Report/program-type-filter.pipe';
import { ProgramType } from '../../../Models/programType';
import { ProgramReportDetail } from '../../../Models/programReportDetail';
import { ProgramFilterPipe } from '../../../Pipes/Report/Program-Report/program-filter.pipe';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-program-report',
  standalone: true,
  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgbPaginationModule,
    ProgramFilterPipe,
    ProgramTypeFilterPipe,
  ],
  templateUrl: './program-report.component.html',
  styleUrl: './program-report.component.css',
})
export class ProgramReportComponent {
  isLightTheme: boolean = true;
  selectedProgram: number | null = null;
  selectedProgramType: number | null = null;
  programReport: ProgramReport[] = [];
  programDetailReport: ProgramReportDetail[] = [];
  allPrograms: { programId: number; programName: string }[] = [];
  allprogramTypes: ProgramType[] = [];
  programCount: number = 0;
  branchId: number = 1;
  p: number = 1;
  isViewChart: boolean = false;

  constructor(
    private themeService: ThemeService,
    private spinner: NgxSpinnerService,
    private adminService: AdminService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });
    this.spinner.show();
    this.loadAllMembers();
    this.loadMemberReports();
  }

  loadAllMembers(): void {
    this.adminService.getAllProgramTypes().subscribe((data) => {
      this.allprogramTypes = data;
      this.spinner.hide();
    });
  }

  loadMemberReports(): void {
    this.reportService.getProgramReport(this.branchId).subscribe((data) => {
      this.programReport = data;

      console.log(data);

      this.programDetailReport = this.programReport.reduce(
        (acc: ProgramReportDetail[], programType) => {
          return acc.concat(programType.programs);
        },
        []
      );

      let allTrainingPrograms = this.programDetailReport.map((program) => ({
        programId: program.programId,
        programName: program.programName,
      }));

      this.allPrograms = allTrainingPrograms;
      this.programCount = allTrainingPrograms.length;

      this.generateProgramTypeChart(); // Generate chart for program types
      this.generateProgramDetailChart(); // Generate chart for program details

      this.spinner.hide();
    });
  }

  viewChart() {
    this.isViewChart = !this.isViewChart;
    this.loadMemberReports();
    this.generateProgramTypeChart();
    this.generateProgramDetailChart();
  }

  generateProgramTypeChart() {
    const programTypeLabels = this.programReport.map((type) => type.typeName);
    const programTypeData = this.programReport.map((type) => type.totalEnrollingMembers);
  
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: programTypeLabels,
        datasets: [
          {
            label: 'Total Enrolling Members',
            data: programTypeData,
            borderColor: '#4CAF50',
            backgroundColor: '#4CAF50',
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Program Type Summary',
          },
          tooltip: {
            enabled: true, // Show tooltips on hover
            callbacks: {
              label: function (tooltipItem) {
                return `Enrolling Members: ${tooltipItem.raw}`;
              },
            },
          },
          legend: {
            display: true,
            position: 'top', // Display legend at the top
          },
          datalabels: {
            display: true, // Show data labels
            color: 'black',
            formatter: function (value) {
              return value; // Display the value as is
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Program Types',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Enrolling Members',
            },
            beginAtZero: true,
          },
        },
      },
    };
  
    const ctx = document.getElementById('programTypeChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, config);
    }
  }
  
  generateProgramDetailChart() {
    const programLabels = this.programDetailReport.map((program) => program.programName);
    const programData = this.programDetailReport.map((program) => program.totalEnrollingMembers);
  
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: programLabels,
        datasets: [
          {
            label: 'Total Enrolling Members',
            data: programData,
            borderColor: '#2196F3',
            backgroundColor: '#2196F3',
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Program Details',
          },
          tooltip: {
            enabled: true, // Show tooltips on hover
            callbacks: {
              label: function (tooltipItem) {
                return `Enrolling Members: ${tooltipItem.raw}`;
              },
            },
          },
          legend: {
            display: true,
            position: 'top', // Display legend at the top
          },
          datalabels: {
            display: true, // Show data labels
            color: 'black',
            formatter: function (value) {
              return value; // Display the value as is
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Programs',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Enrolling Members',
            },
            beginAtZero: true,
          },
        },
      },
    };
  
    const ctx = document.getElementById('programDetailChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, config);
    }
  }
  }
