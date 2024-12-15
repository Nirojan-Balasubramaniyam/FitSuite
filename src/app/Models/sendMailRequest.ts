export interface SendMailRequest {
    name: string;
    otp: string;
    email: string;
    emailType: number; // Adjust this to the correct type if necessary
  }
  