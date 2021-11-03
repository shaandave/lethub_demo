import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncingProgressBarComponent } from './syncing-progress-bar.component';

describe('SyncingProgressBarComponent', () => {
  let component: SyncingProgressBarComponent;
  let fixture: ComponentFixture<SyncingProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncingProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncingProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
