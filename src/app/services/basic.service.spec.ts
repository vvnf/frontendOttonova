import { TestBed } from '@angular/core/testing';

import { BasicService } from './basic.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('BasicService', () => {
  let basicService: BasicService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {TestBed.configureTestingModule({
    imports:[HttpClientTestingModule],
    providers:[
      BasicService
    ]
  })
  basicService = TestBed.get(BasicService);
  httpTestingController = TestBed.get(BasicService);
});


  it('should be created', () => {
    expect(httpTestingController).toBeTruthy();
  });

  it('should have fetchCountryJson function', () => {
    const service: BasicService = TestBed.get(BasicService);
    expect(service.fetchCountryJson).toBeTruthy();
   });

   it('should have userAuthen function', () => {
    const service: BasicService = TestBed.get(BasicService);
    expect(service.userAuthen).toBeTruthy();
   });
   
   it('should have getCityList function', () => {
    const service: BasicService = TestBed.get(BasicService);
    expect(service.getCityList).toBeTruthy();
   });

   it('should have callRefreshToken function', () => {
    const service: BasicService = TestBed.get(BasicService);
    expect(service.callRefreshToken).toBeTruthy();
   });

});
