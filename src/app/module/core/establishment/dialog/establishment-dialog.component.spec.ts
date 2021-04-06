import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EstablishmentModule } from '../establishment.module';

import { EstablishmentDialogComponent } from './establishment-dialog.component';

describe('EstablishmentDialogComponent', () => {
  let component: EstablishmentDialogComponent;
  let fixture: ComponentFixture<EstablishmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentDialogComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, EstablishmentModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
