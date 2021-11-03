import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsVacantComponent } from './units-vacant.component';

describe('UnitsVacantComponent', () => {
  let component: UnitsVacantComponent;
  let fixture: ComponentFixture<UnitsVacantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsVacantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsVacantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
