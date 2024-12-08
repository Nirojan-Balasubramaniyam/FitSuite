import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './Layouts/admin-layout/admin-layout.component';
import { BranchComponent } from './Views/Admin/branch/branch.component';
import { DashboardComponent } from './Views/Admin/dashboard/dashboard.component';
import { ApprovalRequestComponent } from './Views/Admin/approval-request/approval-request.component';
import { AuditReportComponent } from './Views/Admin/audit-report/audit-report.component';
import { MemberManagementComponent } from './Views/Admin/member-management/member-management.component';
import { MemberReportComponent } from './Views/Admin/member-report/member-report.component';
import { PaymentReportComponent } from './Views/Admin/payment-report/payment-report.component';
import { PaymentComponent } from './Views/Admin/payment/payment.component';
import { ProgramEnrollComponent } from './Views/Admin/program-enroll/program-enroll.component';
import { ProgramManagementComponent } from './Views/Admin/program-management/program-management.component';
import { ProgramReportComponent } from './Views/Admin/program-report/program-report.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: 'audit-report', component: AuditReportComponent },
            { path: 'branch', component: BranchComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'members', component: MemberManagementComponent },
            { path: 'member-report', component: MemberReportComponent },
            { path: 'payment', component: PaymentComponent },
            { path: 'payment-report', component: PaymentReportComponent },
            { path: 'enroll', component: ProgramEnrollComponent },
            { path: 'programs', component: ProgramManagementComponent },
            { path: 'program-report', component: ProgramReportComponent },
            { path: 'approval-request',component:ApprovalRequestComponent}
        ]
    }
];
