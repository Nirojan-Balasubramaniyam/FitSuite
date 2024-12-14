
import { Component } from '@angular/core';
import { LoginRegisterService } from '../../../Service/LoginRegister/login-register.service';
import { CommonModule } from '@angular/common';
import { Login } from '../../../Models/Login';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  signinForm:FormGroup;
 
  loginData!:Login;
  

  constructor(private fb:FormBuilder, private registerService:LoginRegisterService, private router:Router,private toastr: ToastrService){
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      
     
    })
  }

  // ngLogin(){
  //   this.loginData = this.signinForm.value;
  //   console.log(this.loginData = this.signinForm.value);
    
  //   this.registerService.UserLogin(this.loginData).subscribe({
  //     next:(response:any) => {

  //       localStorage.setItem("token" , response)
  //       this.toastr.success("User Login Successfully.." , "" , {
  //         positionClass:"toast-top-right",
  //         progressBar:true,
  //         timeOut:4000
  //       })
        
  //     },complete:()=>{
  //       this.registerService.isLoggedIn();
  //       //this.router.navigate(['/home'])
  //     },error:(error:any)=>{
  //       this.toastr.warning( error.error, "" , {
  //         positionClass:"toast-top-right",
  //         progressBar:true,
  //         timeOut:4000
  //       })
  //     }
  //   })
  // } 

  ngLogin() {
    this.loginData = this.signinForm.value;
    console.log(this.loginData);
    
    this.registerService.UserLogin(this.loginData).subscribe({
      next: (response: any) => {
        // Save token and user info to localStorage
        localStorage.setItem("Token", response);
        const decoded: any = jwtDecode(response);
        localStorage.setItem("Name", decoded.FullName);
        localStorage.setItem("Role", decoded.UserRole);
        
        // Display success message
        this.toastr.success("User Login Successfully.." , "" , {
          positionClass: "toast-top-right",
          progressBar: true,
          timeOut: 4000
        });
  
        // Navigate based on user role
        this.registerService.isLoggedIn();  // Ensure that user info is updated
        const role = localStorage.getItem("Role");
  
        if (role?.toLowerCase() === "admin" || role?.toLowerCase() === "superadmin") {
          this.router.navigate(['/admin/dashboard']);
        } else if (role?.toLowerCase() === "member") {
          this.router.navigate(['/member/profile']);
        }
      },
      error: (error: any) => {
        this.toastr.warning(error.error, "", {
          positionClass: "toast-top-right",
          progressBar: true,
          timeOut: 4000
        });
      }
    });
  }
  
   decodeJwtToken(token: string): any {
    throw new Error('Function not implemented.');
  }
  }
  
  

