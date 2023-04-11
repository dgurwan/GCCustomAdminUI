import { ComponentFixture, TestBed } from '@angular/core/testing';

import { triggerDetailsComponent } from './trigger-details.component';

describe('TriggerDetailsComponent', () => {
  let component: TriggerDetailsComponent;
  let fixture: ComponentFixture<triggerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ triggerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(triggerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
