import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialDetailComponent } from './credential-detail.component';

describe('CredentialDetailComponent', () => {
  let component: CredentialDetailComponent;
  let fixture: ComponentFixture<CredentialDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CredentialDetailComponent]
    });
    fixture = TestBed.createComponent(CredentialDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
