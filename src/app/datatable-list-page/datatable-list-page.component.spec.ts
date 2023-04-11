import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableListPageComponent } from './datatable-list-page.component';

describe('DatatableListPageComponent', () => {
  let component: DatatableListPageComponent;
  let fixture: ComponentFixture<DatatableListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatableListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
