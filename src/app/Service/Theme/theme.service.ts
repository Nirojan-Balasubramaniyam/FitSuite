import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }
  
  private lightTheme = new BehaviorSubject<boolean>(true); // Default is dark theme
  lightTheme$ = this.lightTheme.asObservable();

  setLightTheme(isLight: boolean): void {
    this.lightTheme.next(isLight); // Update the value
  }
}
