import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CityModule } from '../city.module';

import { CityReadComponent } from './city-read.component';

describe('CityReadComponent', () => {
  let component: CityReadComponent;
  let fixture: ComponentFixture<CityReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CityReadComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, CityModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
