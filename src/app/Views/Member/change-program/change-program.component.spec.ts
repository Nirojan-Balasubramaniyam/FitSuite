import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProgramComponent } from './change-program.component';

describe('ChangeProgramComponent', () => {
  let component: ChangeProgramComponent;
  let fixture: ComponentFixture<ChangeProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeProgramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
