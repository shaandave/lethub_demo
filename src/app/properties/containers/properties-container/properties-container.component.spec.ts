import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesContainerComponent } from './properties-container.component';

describe('PropertiesContainerComponent', () => {
  let component: PropertiesContainerComponent;
  let fixture: ComponentFixture<PropertiesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
