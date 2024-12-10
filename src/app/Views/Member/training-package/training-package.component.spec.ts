import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPackageComponent } from './training-package.component';

describe('TrainingPackageComponent', () => {
  let component: TrainingPackageComponent;
  let fixture: ComponentFixture<TrainingPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
