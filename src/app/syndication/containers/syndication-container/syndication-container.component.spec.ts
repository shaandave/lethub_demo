import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicationContainerComponent } from './syndication-container.component';

describe('SyndicationContainerComponent', () => {
  let component: SyndicationContainerComponent;
  let fixture: ComponentFixture<SyndicationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicationContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
