import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EstablishmentModule } from '../establishment.module';
import { EstablishmentReadComponent } from './establishment-read.component';

describe('EstablishmentReadComponent', () => {
  let component: EstablishmentReadComponent;
  let fixture: ComponentFixture<EstablishmentReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentReadComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, EstablishmentModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
