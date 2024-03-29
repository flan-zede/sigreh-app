import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutModule } from '../layout.module';

import { LayoutHeaderComponent } from './layout-header.component';

describe('LayoutHeaderComponent', () => {
  let component: LayoutHeaderComponent;
  let fixture: ComponentFixture<LayoutHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutHeaderComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, LayoutModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
