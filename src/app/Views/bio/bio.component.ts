import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WindowDataService } from '../../Service/Biomatrics/window-data.service';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './bio.component.html',
  styleUrl: './bio.component.css'
})
export class BioComponent {
  constructor(private windowDataService: WindowDataService, private router: Router) {

  }


  register() {
    const emailInput = document.getElementById('email') as HTMLInputElement
    const passwordInput = document.getElementById('password') as HTMLInputElement

    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();
    if (!email || !password) {
      alert('Please provide both email and password.');
      return;
    }
    this.windowDataService.register(email,password);

  }
}
