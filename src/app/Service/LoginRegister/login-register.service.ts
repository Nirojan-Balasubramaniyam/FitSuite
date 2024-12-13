import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserRegister } from '../../Interfaces/IUserRegister';
import { jwtDecode } from 'jwt-decode';
import { Login } from '../../Models/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {

  constructor(private http:HttpClient) { }

  AddRegisterUser(UserRegister:IUserRegister){
    return this.http.post<any>('https://localhost:7220/api/Authentication/Register', UserRegister)
   
  }
    

  UserLogin(login:Login){
    return this.http.post('https://localhost:7220/api/Authentication/login', login,{
      responseType:'text'
    });
  }

  // isLoggedIn(){
  //   if (localStorage.getItem("token")) {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       const decoded:any = jwtDecode(token);
  //       console.log(decoded);
        
  //       localStorage.setItem("name", decoded.FullName)
  //       localStorage.setItem("Role", decoded.UserRole)
  //     }
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }

  isLoggedIn(): boolean {
    const token = localStorage.getItem("Token");
    if (token) {
      const decoded: any = jwtDecode(token);
      console.log(decoded);
      return true; // User is logged in
    } else {
      return false; // User is not logged in
    }
  }
  

}
function decodeJwtToken(token: string): any {
  throw new Error('Function not implemented.');
}
