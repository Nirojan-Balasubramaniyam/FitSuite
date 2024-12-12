import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../../Service/Admin/Payment/payment.service';
import { AdminService } from '../../../Service/Staff/admin.service';
import { Member } from '../../../Models/member';
import { ReportService } from '../../../Service/Admin/Report/report.service';
import { PaymentReport } from '../../../Models/paymentReport';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Chart,
  CategoryScale,
  PieController,
  DoughnutController,
  ArcElement,
  BarElement,
  BarController,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MemberFilterPipe } from '../../../Pipes/Report/Payment/member-filter.pipe';
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-payment-report',
  standalone: true,
  imports: [
    CommonModule,
    BsDatepickerModule,
    FormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgbPaginationModule,
    MemberFilterPipe
  ],
  templateUrl: './payment-report.component.html',
  styleUrl: './payment-report.component.css',
})
export class PaymentReportComponent {
  isLightTheme: boolean = true;
  selectedDateRange: Date[] | undefined = undefined;
  startDate!: Date;
  endDate!: Date;
  selectedReport: number = 1;
  selectedMember: number | null = null;
  allMembers: Member[] = [];
  payments: PaymentReport[] = [];
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
    this.loadMembershipRenewalPayments();

    // if (this.selectedReport === 1) {
    //   this.generateChart();
    // }
  }

  reports: any[] = [
    { id: 1, name: 'Membership Renewal Payment' }, // 0% discount should not display
    { id: 2, name: 'Initial Payment' },
    { id: 3, name: 'Overdue Payment' },
  ];

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
        this.payments = data;
       this.generateChart();
       this.generatePaymentMethodChart();
        this.spinner.hide();

        console.log(this.payments);
      });
  }

  loadInitialPayments(): void {
    let paymentType: string = 'Initial';

    this.reportService
      .getPaymentReport(
        paymentType,
        this.branchId,
        this.startDate,
        this.endDate
      )
      .subscribe((data) => {
        this.payments = data;
        this.spinner.hide();

        console.log(this.payments);
      });
  }

  loadOverduePayments(): void {
    this.reportService.getOverdueReport(this.branchId).subscribe((data) => {
      this.payments = data;

      this.spinner.hide();
    });
  }

  loadAllMembers(): void {
    this.adminService.getAllMembers(0, 0, true, 1).subscribe((data) => {
      this.allMembers = data.data;
      this.spinner.hide();

      console.log(this.allMembers);
    });
  }

  onMemberChange(memberId: number | null): void {
    if (memberId !== null) {
      this.selectedMember = memberId;

      // this.loadMemberPayment();
      // this.loadTrainingProgramsForMember(memberId);
    } else {
      this.selectedMember = null;
    }
  }

  onReportChange(reportId: number | null): void {
    if (reportId !== null) {
      this.selectedReport = reportId;
      this.payments = [];
      if (reportId == 1) {
        this.loadMembershipRenewalPayments();
        this.generateChart();
      } else if (reportId == 2) {
        this.loadInitialPayments();
      } else if (reportId == 3) {
        this.loadOverduePayments();
      }

      // this.loadMemberPayment();
      // this.loadTrainingProgramsForMember(memberId);
    } else {
      this.selectedMember = null;
    }
  }

  onRangeChange(newRange: (Date | undefined)[] | undefined) {
    if (newRange && newRange.length === 2) {
      this.payments = [];
      // Check if both dates are defined
      const [startDate, endDate] = newRange;
      if (startDate && endDate) {
        this.selectedDateRange = [startDate, endDate];
        this.startDate = startDate;
        this.endDate = endDate;

        if (this.selectedReport == 1) {
          this.loadMembershipRenewalPayments();
          this.generateChart();
          this.generatePaymentMethodChart();
        } else if (this.selectedReport == 2) {
          this.loadInitialPayments();
        } else if (this.selectedReport == 3) {
          this.loadOverduePayments();
        }
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

  viewChart() {
    this.isViewChart = !this.isViewChart;
    this.loadMembershipRenewalPayments();
    this.generateChart();
    this.generatePaymentMethodChart();
  }

  // Method to generate the chart for payment types
  generateChart() {
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

    if (this.payments && this.payments.length > 0) {
      const paymentTypeData = this.payments.reduce(
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
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Total Amount by Payment Type',
                data: data,
                backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'], // Customize the colors
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'top', // Customize legend position
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number;
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${context.label}: $${value} (${percentage}%)`;
                  },
                },
              },
              datalabels: {
                color: '#fff', // Set label color
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

  generatePaymentMethodChart() {
    // Register the necessary components
    Chart.register(
      LinearScale,
      CategoryScale,
      BarController,
      BarElement,
      Title,
      Tooltip,
      Legend
    );

    if (this.payments && this.payments.length > 0) {
      const paymentMethodData = this.payments.reduce(
        (acc: { [key: string]: number }, payment) => {
          if (!acc[payment.paymentMethod]) {
            acc[payment.paymentMethod] = 0;
          }
          acc[payment.paymentMethod] += payment.amount;
          return acc;
        },
        {}
      );

      const labels = Object.keys(paymentMethodData);
      const data = Object.values(paymentMethodData);

      const ctx = <HTMLCanvasElement>(
        document.getElementById('paymentMethodChart')
      );
      if (ctx) {
        new Chart(ctx, {
          type: 'bar', // Use the bar chart type
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Total Amount by Payment Method',
                data: data,
                backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'], // Customize the colors
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                type: 'linear', // Register the linear scale
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }
}
