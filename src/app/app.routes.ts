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
import { LandingLayoutComponent } from './Layouts/landing-layout/landing-layout.component';
import { RegisterComponent } from './Views/Landing/register/register.component';
import { LoginComponent } from './Views/Landing/login/login.component';
import { AboutUsComponent } from './Views/Landing/about-us/about-us.component';
import { BMIComponent } from './Views/Landing/bmi/bmi.component';
import { ContactUsComponent } from './Views/Landing/contact-us/contact-us.component';
import { HomeComponent } from './Views/Landing/home/home.component';
import { ProgrammesComponent } from './Views/Landing/programmes/programmes.component';
import { PackagesComponent } from './Views/Landing/packages/packages.component';
import { MemberLayoutComponent } from './Layouts/member-layout/member-layout.component';
import { ChangeInfoComponent } from './Views/Member/change-info/change-info.component';
import { ChangeProgramComponent } from './Views/Member/change-program/change-program.component';
import { PaymentHistoryComponent } from './Views/Member/payment-history/payment-history.component';
import { ProfileComponent } from './Views/Member/profile/profile.component';
import { TrainingPackageComponent } from './Views/Member/training-package/training-package.component';
import { UpdateSkillsComponent } from './Views/Member/update-skills/update-skills.component';
import { MemberBmiComponent } from './Views/Member/member-bmi/member-bmi.component';
import { authGuard } from './Guard/auth.guard';
import { MemberPaymentComponent } from './Views/Member/member-payment/member-payment.component';
import { StaffManagementComponent } from './Views/Admin/staff-management/staff-management.component';
import { MemberDashboardComponent } from './Views/Member/member-dashboard/member-dashboard.component';

export const routes: Routes = [

    {
        path: '',
        component: LandingLayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'registration', component: RegisterComponent},
            { path: 'login', component: LoginComponent },
            { path: 'about', component: AboutUsComponent },
            { path: 'bmi', component: BMIComponent },
            { path: 'contact', component: ContactUsComponent },
            { path: 'home', component: HomeComponent },
            { path: 'programs', component: ProgrammesComponent },
            { path: 'package', component: PackagesComponent },
        ]
    },

    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate:[authGuard],
        children: [
            { path: 'audit-report', component: AuditReportComponent },
            { path: 'branch', component: BranchComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'members', component: MemberManagementComponent },
            { path: 'staffs', component: StaffManagementComponent },
            { path: 'member-report', component: MemberReportComponent },
            { path: 'payment', component: PaymentComponent },
            { path: 'payment-report', component: PaymentReportComponent },
            { path: 'enroll', component: ProgramEnrollComponent },
            { path: 'programs', component: ProgramManagementComponent },
            { path: 'program-report', component: ProgramReportComponent },
            { path: 'approval-request',component:ApprovalRequestComponent}
        ]
    },

    {
        path: 'member',
        component: MemberLayoutComponent,
        canActivate:[authGuard],
        children: [
            { path: 'bmi', component: MemberBmiComponent },
            { path: 'change-info', component: ChangeInfoComponent },
            { path: 'change-program', component: ChangeProgramComponent },
            { path: 'member-payment', component: MemberPaymentComponent },
            { path: 'payment-history', component: PaymentHistoryComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'dashboard', component: MemberDashboardComponent },
            { path: 'training-package', component: TrainingPackageComponent },
            { path: 'skills', component: UpdateSkillsComponent }
        ]
    }
];
