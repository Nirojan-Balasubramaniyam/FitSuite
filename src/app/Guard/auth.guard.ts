import { CanActivateFn } from '@angular/router';
import { CanActivate,Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginRegisterService } from '../Service/LoginRegister/login-register.service';


@Injectable({
  providedIn:'root'
})

export class authGuard implements CanActivate { 
  constructor(private registerService: LoginRegisterService, private router: Router) {
  } 
  

  canActivate(): boolean { 
    const role = localStorage.getItem("Role");
  if (this.registerService.isLoggedIn()) { 
    if (role?.toLocaleLowerCase() === "admin") {
      this.router.navigate(['/admin/dashboard']); 
    } else if (role?.toLowerCase() === "member") {
      this.router.navigate(['/member/profile']); 
    }
  return true; 
  } else { 
  this.router.navigate(['/login']); 
  return false; 
  } 
  }

}

