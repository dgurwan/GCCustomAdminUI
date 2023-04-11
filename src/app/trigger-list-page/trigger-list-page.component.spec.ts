import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerListPageComponent } from './trigger-list-page.component';

describe('TriggerListPageComponent', () => {
  let component: TriggerListPageComponent;
  let fixture: ComponentFixture<TriggerListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriggerListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
