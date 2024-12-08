import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramEnrollComponent } from './program-enroll.component';

describe('ProgramEnrollComponent', () => {
  let component: ProgramEnrollComponent;
  let fixture: ComponentFixture<ProgramEnrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramEnrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
