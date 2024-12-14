import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../Service/Staff/admin.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  isLightTheme: boolean = true;
  isNavbarVisible: boolean = true;
  constructor(    private themeService: ThemeService,
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private modalService: BsModalService,
        private toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.themeService.lightTheme$.subscribe((data) => {
      this.isLightTheme = data;
      console.log(this.isLightTheme);
    });

    this.themeService.isNavbarVisible$.subscribe((isVisible) => {
      this.isNavbarVisible = isVisible;
    });
    this.spinner.show();
  }

}
