import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    BsModalService,
    provideAnimations(), // required animations providers
    provideToastr(),
    provideZxvbnServiceForPSM(),
    DatePipe,
    FormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    
  ]
};
