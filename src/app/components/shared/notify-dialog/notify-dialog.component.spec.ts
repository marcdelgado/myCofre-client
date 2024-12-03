import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyDialogComponent } from './notify-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: NotifyDialogComponent;
  let fixture: ComponentFixture<NotifyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
