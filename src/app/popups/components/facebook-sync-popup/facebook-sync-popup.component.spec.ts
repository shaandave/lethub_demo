import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookSyncPopupComponent } from './facebook-sync-popup.component';

describe('FacebookSyncPopupComponent', () => {
  let component: FacebookSyncPopupComponent;
  let fixture: ComponentFixture<FacebookSyncPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookSyncPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookSyncPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
