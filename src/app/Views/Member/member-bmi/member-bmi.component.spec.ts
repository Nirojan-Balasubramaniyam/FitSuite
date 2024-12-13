import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberBmiComponent } from './member-bmi.component';

describe('MemberBmiComponent', () => {
  let component: MemberBmiComponent;
  let fixture: ComponentFixture<MemberBmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberBmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberBmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
