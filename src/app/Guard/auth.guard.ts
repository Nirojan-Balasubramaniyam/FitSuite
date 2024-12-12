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
  if (this.registerService.isLoggedIn()) { 
  return true; 
  } else { 
  this.router.navigate(['/admin']); 
  return false; 
  } 
  }

}

