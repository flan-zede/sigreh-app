import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientModule } from '../client.module';
import { ClientReadComponent } from './client-read.component';

describe('ClientReadComponent', () => {
  let component: ClientReadComponent;
  let fixture: ComponentFixture<ClientReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientReadComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, ClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
