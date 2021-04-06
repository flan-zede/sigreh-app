import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { UserModule } from '../user.module';

import { UserReadComponent } from './user-read.component';

describe('UserReadComponent', () => {
  let component: UserReadComponent;
  let fixture: ComponentFixture<UserReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReadComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, UserModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
