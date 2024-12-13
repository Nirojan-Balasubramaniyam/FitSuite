export class Login{
    email:string;
    password:string;
  
    constructor(obj:any){
        this.email = obj.email!= null ? obj.email : null;
        this.password = obj.password != null ? obj.password : null;
    }
}