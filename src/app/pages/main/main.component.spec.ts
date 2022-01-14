import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { BasicService } from '../../services/basic.service';
import {HttpClientModule} from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderComponent } from './../header/header.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let httpTestingController: HttpTestingController;
  let basicService: BasicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent,HeaderComponent ],
      imports:[HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers:[
        BasicService
      ],
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
