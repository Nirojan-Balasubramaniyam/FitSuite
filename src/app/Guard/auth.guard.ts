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
  

  // canActivate(): boolean { 
  //   const role = localStorage.getItem("Role");
  // if (this.registerService.isLoggedIn()) { 
  //   console.log(role)
  //   if (role?.toLowerCase() === "admin" || role?.toLowerCase() === "superadmin") {
  //     this.router.navigate(['/admin/dashboard']); 
  //   } else if (role?.toLowerCase() === "member") {
  //     this.router.navigate(['/member/profile']); 
  //   }
  // return true; 
  // } else { 
  // this.router.navigate(['/home']); 
  // return false; 
  // } 
  // }

  canActivate(): boolean {
    console.log("AuthGuard is being triggered");
    const role = localStorage.getItem("Role");
    if (this.registerService.isLoggedIn()) {
      console.log("Role inside guard:", role);  // Debugging the role value
      if (role?.toLowerCase() === "admin" || role?.toLowerCase() === "superadmin") {
        // If the role is admin or superadmin, allow access to admin dashboard
        return true;
      } else if (role?.toLowerCase() === "member") {
        // If the role is member, allow access to member profile
        return true;
      }
    }
    // If not logged in or role is not matching, redirect to home
    this.router.navigate(['/home']);
    return false;
  }
  
  

}

