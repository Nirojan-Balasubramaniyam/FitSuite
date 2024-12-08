import { Component } from '@angular/core';
import { ThemeService } from '../../../Service/Theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approval-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approval-request.component.html',
  styleUrl: './approval-request.component.css'
})
export class ApprovalRequestComponent {
  isLightTheme: boolean = true;

  constructor(private themeService: ThemeService) {
  }

  ngOnInit(): void {

    this.themeService.lightTheme$.subscribe(data => {
      this.isLightTheme = data;
      console.log(this.isLightTheme)
    });
  }

}
