import { Component, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ReportService } from '../../../Service/Admin/Report/report.service';
import { AdminService } from '../../../Service/Staff/admin.service';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {Chart, CategoryScale, PieController, DoughnutController, ArcElement, BarElement, BarController, LinearScale, Title,  Tooltip, Legend, TooltipItem, ChartConfiguration,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PaymentReport } from '../../../Models/paymentReport';
import { PaymentSummary } from '../../../Models/paymentSummary';
import { DashboardService } from '../../../Service/Admin/Dashboard/dashboard.service';
import { AlertService } from '../../../Service/Admin/Alert/alert.service';
import { Alert } from '../../../Models/overdueAlert';
import { Member } from '../../../Models/member';
import { ProgramReport } from '../../../Models/programReport';
import { ProgramReportDetail } from '../../../Models/programReportDetail';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule,
    NgSelectModule,
    NgxSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  isLightTheme: boolean = true;
  selectedDateRange: Date[] | undefined = undefined;
  startDate!: Date;
  endDate!: Date;
  branchId: number = 1;
  totalMonthlyPayment: number = 0;
  paidAmount: number = 0;
  amountTopay: number = 0;
  overduePay: number = 0;
  oveduePercentage: number = 0;
  paymentsReport: PaymentReport[] = [];
  paymentSummary!: PaymentSummary;
  activeMemberCount: number =0;
  nonActiveMemberCount: number =0;
  overdueAlers: Alert[]=[];
  allMembers: Member[] = [];
  programReport: ProgramReport[] = [];
  programDetailReport: ProgramReportDetail[] = [];



  @ViewChild('paymentChart') paymentChart: any;
  chart: any;

  @ViewChild('overDueChart') overDueChart: any;
  overDueChartInstance: any;

  @ViewChild('paymentTypeChart') paymentTypeChart: any;
  paymentTypeChartInstance: any;


  constructor(
    private themeService: ThemeService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private reportService: ReportService,
    private adminService: AdminService,
    private dashboardService: DashboardService,
    
  ) { }

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });
    this.spinner.show();
    this.loadPaymentSummary();
    this.loadMembershipRenewalPayments();
    this.membersCount();
    this.loadMembers();
    this.loadOverdueAlerts();
    this.loadMemberReports();
    //this.generateMembershipRenewalChart();
  }

  loadPaymentSummary(): void {
    this.dashboardService.getPaymentSummary(this.branchId).subscribe((data) => {
      this.paymentSummary = data;
      this.totalMonthlyPayment = data.totalMonthlyPayment;
      this.paidAmount = data.totalPaid;
      this.amountTopay = data.remainAmountToPay;
      this.oveduePercentage = data.overduePercentage;
      this.overduePay = data.overduePayment;

      console.log(this.paymentSummary)
      this.initializePaymentChart();
      this.initializeOverdueChart();

      this.spinner.hide();
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

  loadMembers(): void {
    this.adminService.getAllMembers(0,0, true, this.branchId).subscribe(response => {
      this.allMembers = response.data;
      this.spinner.hide();

    });
  }

  loadOverdueAlerts():void{
    this.alertService.getAlertsByType("Overdue",this.branchId)
      .subscribe((data) => {
        this.overdueAlers = data;
      });
  }

  getMemberFirstName(memberId: number): string {
    const member = this.allMembers.find((m) => m.memberId === memberId);
    let name: string = member?.firstName +" " + member?.lastName;
    return name
  }



  loadMembershipRenewalPayments(): void {
    let paymentType: string = 'Allincome';
    this.reportService
      .getPaymentReport(
        paymentType,
        this.branchId,
        this.startDate,
        this.endDate
      )
      .subscribe((data) => {
        this.paymentsReport = data;
        console.log(this.paymentsReport)
       this.generateMembershipRenewalChart(data);
        this.spinner.hide();

        
      });
  }

  onRangeChange(newRange: (Date | undefined)[] | undefined) {
    if (newRange && newRange.length === 2) {
      this.paymentsReport = [];
      // Check if both dates are defined
      const [startDate, endDate] = newRange;
      if (startDate && endDate) {
        this.selectedDateRange = [startDate, endDate];
        this.startDate = startDate;
        this.endDate = endDate;

        this.loadPaymentSummary();
        this.loadMembershipRenewalPayments();
       // this.generateMembershipRenewalChart();
        
      
      } else {
        console.log('Invalid date range: start or end date is undefined');
        this.selectedDateRange = undefined;
      }
    } else {
      // Reset the date range if invalid or undefined
      console.log('No date range selected');
      this.selectedDateRange = undefined;
    }
  }

  initializePaymentChart(): void {
    const summary = this.paymentSummary;
  
    if (!summary || typeof summary.totalPaid === 'undefined' || typeof summary.overduePayment === 'undefined') {
      console.error('Invalid payment summary data:', summary);
      return;
    }
  
    const data = {
      labels: ['Paid', 'Remaining', 'Overdue'],
      datasets: [{
        data: [summary.totalPaid, summary.remainAmountToPay, summary.overduePayment],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(255, 0, 0)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4,
        hoverBackgroundColor: ['#81c784', '#e57373'],
        borderWidth: 1, // No border
        weight: 1
      }]
    };
  
    if (this.paymentChart && this.paymentChart.nativeElement) {
      this.chart = new Chart(this.paymentChart.nativeElement, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom', // Set legend position to bottom
              labels: {
                padding: 20, // Adjust padding between legend items
                font: {
                  size: 14, // Optional: Set font size for legend
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context: TooltipItem<'doughnut'>) => { // Explicitly type 'context'
                  const value = context.raw as number;
                  return `${context.label}: Rs ${value}`;
                },
              },
            },
            datalabels: {
              color: '#ffffff', 
              font: {
                size: 14, 
                weight: 'bold',
              },
              anchor: 'center', 
              align: 'center', 
            },
          },
        },
      });
    }
  }
  


  initializeOverdueChart(): void {
    // Ensure paymentSummary is loaded
    if (!this.paymentSummary || typeof this.paymentSummary.overduePayment === 'undefined') {
      console.error('Payment summary data is not available or overduePercentage is undefined');
      return;
    }
  
    const summary = this.paymentSummary;
    console.log('Overdue Percentage:', summary);
  
    // If overduePercentage is undefined or 0, handle appropriately
    if (!summary) {
      console.warn('Overdue percentage is 0, chart will still render but data is empty.');
    }
  
    const data = {
      labels: ['Overdue'],
      datasets: [{
        data: [summary.overduePayment, summary.overduePercentage],
        backgroundColor: ['rgb(255, 99, 132)'],
        hoverBackgroundColor: ['#e57373'],
        borderWidth: 1,
      }]
    };
  
    if (this.overDueChart && this.overDueChart.nativeElement) {
      this.overDueChartInstance = new Chart(this.overDueChart.nativeElement, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw as number;
                  return `${context.label}: ${value}% Overdue`;
                },
              },
            },
          },
        },
      });
    }
  }


  generateMembershipRenewalChart(paymentsReport:PaymentReport[]) {
    // Register the necessary components
    Chart.register(
      CategoryScale,
      DoughnutController,
      ArcElement,
      PieController,
      Title,
      Tooltip,
      Legend,
      ChartDataLabels // Register the datalabels plugin
    );

    if (paymentsReport && paymentsReport.length > 0) {
      const paymentTypeData = this.paymentsReport.reduce(
        (acc: { [key: string]: number }, payment) => {
          if (!acc[payment.paymentType]) {
            acc[payment.paymentType] = 0;
          }
          acc[payment.paymentType] += payment.amount;
          return acc;
        },
        {}
      );

      const labels = Object.keys(paymentTypeData);
      const data = Object.values(paymentTypeData);

      const total = data.reduce((sum, value) => sum + value, 0); // Calculate total amount for percentage calculation

      const ctx = <HTMLCanvasElement>(
        document.getElementById('paymentTypeChart')
      );
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Total Amount by Payment Type',
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
                borderWidth: 1
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom', // Customize legend position
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number;
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${context.label}: Rs ${value} (${percentage}%)`;
                  },
                },
              },
              datalabels: {
               // Set label color
                anchor: 'center', // Position the label in the center of the segment
                align: 'center', // Align text to the center
                formatter: (value, context) => {
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `Rs ${value} (${percentage}%)`; // Display both amount and percentage
                },
                font: {
                  size: 14, // Adjust font size for better visibility
                  weight: 'bold', // Make the text bold
                },
              },
            },
          },
        });
      }
    }
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

      
      this.generateProgramDetailChart(); // Generate chart for program details

      this.spinner.hide();
    });
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
