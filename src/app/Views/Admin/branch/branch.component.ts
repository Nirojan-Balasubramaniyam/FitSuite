import { Component, OnInit, TemplateRef } from '@angular/core';
import { Branch } from '../../../Models/branch';
import { AdminService } from '../../../Service/Staff/admin.service';
import { PaginationResponse } from '../../../Models/pagination';
import { CommonModule } from '@angular/common';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { ThemeService } from '../../../Service/Theme/theme.service';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule, MatButtonModule, MatIconModule,MatDividerModule],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css'
})
export class BranchComponent implements OnInit {
  branches: Branch[] = [];
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  isLightTheme: boolean = true;
  branchId = 0;
  adminName:string="";
  modalRef?: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService, private toastr: ToastrService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.loadBranches();

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });
  }

  loadBranches(): void {
    this.adminService.getAllBranches().subscribe((response: PaginationResponse<Branch>) => {
       // Filter branches to only include active ones (isActive = true)
       this.branches = response.data.filter(branch => branch.isActive);
      this.totalRecords = response.totalRecords;
    });
  }

  onEdit(branchID: number) {
    //this.router.navigate(['/edit-task', taskId]);
  }

  openModal(template: TemplateRef<void>, branchID: number) {
    this.branchId = branchID;
    this.modalRef = this.modalService.show(template);
  }

  confirm() {
    this.modalRef?.hide();
    this.adminService.deleteBranch(this.branchId).subscribe(data => {
      this.toastr.success("Branch is deleted successfully", "Deleted", {
        timeOut: 10000,
        closeButton: true,
      });
      this.loadBranches();
    })
  }

  decline() {
    this.modalRef?.hide();
  }

}
