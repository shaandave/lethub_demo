import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesWrapContainerComponent } from './pages-wrap-container.component';

describe('PagesWrapContainerComponent', () => {
  let component: PagesWrapContainerComponent;
  let fixture: ComponentFixture<PagesWrapContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesWrapContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesWrapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
