import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsTableComponent } from './units-table.component';

describe('UnitsTableComponent', () => {
  let component: UnitsTableComponent;
  let fixture: ComponentFixture<UnitsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
