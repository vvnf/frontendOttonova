import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeComponent } from './globe.component';
import { HeaderComponent } from './../header/header.component';
import { ModalComponent } from './../_modal/modal.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('GlobeComponent', () => {
  let component: GlobeComponent;
  let fixture: ComponentFixture<GlobeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobeComponent,HeaderComponent,ModalComponent ],
      imports:[HttpClientTestingModule,RouterTestingModule.withRoutes([])],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
