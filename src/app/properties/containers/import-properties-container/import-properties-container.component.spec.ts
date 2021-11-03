import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPropertiesContainerComponent } from './import-properties-container.component';

describe('ImportPropertiesContainerComponent', () => {
  let component: ImportPropertiesContainerComponent;
  let fixture: ComponentFixture<ImportPropertiesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportPropertiesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPropertiesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
