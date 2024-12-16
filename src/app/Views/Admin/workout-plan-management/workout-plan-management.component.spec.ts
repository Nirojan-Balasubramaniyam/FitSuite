import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPlanManagementComponent } from './workout-plan-management.component';

describe('WorkoutPlanManagementComponent', () => {
  let component: WorkoutPlanManagementComponent;
  let fixture: ComponentFixture<WorkoutPlanManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutPlanManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutPlanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
