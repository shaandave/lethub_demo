import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesImportComponent } from './properties-import.component';

describe('PropertiesImportComponent', () => {
  let component: PropertiesImportComponent;
  let fixture: ComponentFixture<PropertiesImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
