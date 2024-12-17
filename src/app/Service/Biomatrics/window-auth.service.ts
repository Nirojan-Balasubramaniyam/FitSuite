import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { LoginRegisterService } from '../LoginRegister/login-register.service';

@Injectable({
  providedIn: 'root'
})
export class WindowAuthService {

  constructor(private authService:LoginRegisterService, 
    private rout: Router , 
    private tostr:ToastrService,
    private cookieService: CookieService,
    private registerService: LoginRegisterService,
  ) { }

  private generateRandomBuffer(length: number): Uint8Array {
    const randomBuffer = new Uint8Array(length);
    window.crypto.getRandomValues(randomBuffer);
    return randomBuffer;
  }

  async register(email: string, password: string) {

    const challenge = this.generateRandomBuffer(32);

    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: challenge, 
      rp: {
        name: "OurAwesomeApp" 
      },
      user: { 
        id: this.generateRandomBuffer(16), 
        name: email,
        displayName: "Way Makers "
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 }
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "direct"
    };

    try {
      let auth = {
        email: email,
        password: password
      }

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;

      this.authService.UserLogin(auth).subscribe({
        next: (res: string) => {
          this.storeCredential(credential, challenge, password, email);
          console.log("Registration successful!", credential);
          this.tostr.success("Registration successful!")
          this.rout.navigate(['/login'])
          return credential;
        }, error: () => {
          this.tostr.error("Registration Failed! Check your Email & Password Try again.")
        }
      })

    } catch (err) {
      this.tostr.error("Registration Failed! Try again.")
      console.error("Registration failed:", err);
      throw err;
    }
  }

  async authenticate() {
    const storedCredential = this.getStoredCredential();

    console.log(storedCredential)
    if (!storedCredential) {
      throw new Error("No stored credential found. Please register first.");
    }

    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: new Uint8Array(storedCredential.challenge),
      allowCredentials: [{
        id: new Uint8Array(storedCredential.rawId),
        type: "public-key"
      }],
      userVerification: "required",
      timeout: 60000
    };

    try {

      const credential = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;
      console.log("Authentication successful!", credential);
      let auth = {
        email: storedCredential.email,
        password: storedCredential.password
      }
      console.log(auth)
      this.authService.UserLogin(auth).subscribe({
        next: (response: string) => {
          localStorage.setItem('Token', response);
        const decoded: any = jwtDecode(response);
        localStorage.setItem('Name', decoded.FullName);
        localStorage.setItem('Role', decoded.UserRole);
        localStorage.setItem('UserId', decoded.UserId);
        localStorage.setItem('BranchId', decoded.BranchId);

        // Display success message
        this.tostr.success('User Login Successfully..', '', {
          positionClass: 'toast-top-right',
          progressBar: true,
          timeOut: 4000,
        });

        // Navigate based on user role
        this.registerService.isLoggedIn(); // Ensure that user info is updated
        const role = localStorage.getItem('Role');

        if (
          role?.toLowerCase() === '0' ||
          role?.toLowerCase() === '1'
        ) {
          this.rout.navigate(['/admin/dashboard']);
        } else if (role?.toLowerCase() === 'member') {
          this.rout.navigate(['/member/dashboard']);
        }

        }, error: () => {
          this.rout.navigate(['/login'])
          this.tostr.error("Biomatrics failed. Please Register again.");
        }, complete: () => {
        }
      })
      return credential;
    } catch (err) {
      console.error("Authentication failed:", err);
      throw err;
    }
  }

  private storeCredential(
    credential: PublicKeyCredential,
    challenge: Uint8Array,
    password: string,
    email: string
  ) {
    const credentialData = {
      rawId: Array.from(new Uint8Array(credential.rawId)),
      challenge: Array.from(challenge),
      email: email,
      password,
    };
  
    const credentialString = JSON.stringify(credentialData);
  
    document.cookie = `webauthn_credential=${encodeURIComponent(
      credentialString
    )}; path=/; max-age=86400; secure; samesite=strict`;
  }
  

  private getStoredCredential(): any {
    const cookieName = 'webauthn_credential=';
    const cookies = document.cookie.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(cookieName)) {
        const credentialString = cookie.substring(cookieName.length);
        return JSON.parse(decodeURIComponent(credentialString));
      }
    }
    return null; 
  }
}
