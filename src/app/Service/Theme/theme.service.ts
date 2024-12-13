import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }
  
  private lightTheme = new BehaviorSubject<boolean>(true); 
  lightTheme$ = this.lightTheme.asObservable();

  private isNavbarVisibleSubject = new BehaviorSubject<boolean>(true);
  isNavbarVisible$ = this.isNavbarVisibleSubject.asObservable();

  setLightTheme(isLight: boolean): void {
    this.lightTheme.next(isLight);
  }

 
  setNavbarVisibility(isVisible: boolean): void {
    this.isNavbarVisibleSubject.next(isVisible);
  }

  getNavbarVisibility(): boolean {
    return this.isNavbarVisibleSubject.getValue();
  }
}
