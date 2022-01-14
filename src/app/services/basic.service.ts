import { Injectable, Type } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BasicService {
  readonly rooturl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  userAuthen(){
    //currently Hardcoded
    const user = { 
      username: 'vivian',
      role: 'basic'
    }
    let data = `userName=${user.username}&role=${user.role}`;
    let reqHeader=new HttpHeaders({'Content-Type':'application/x-www-urlencoded'});
    return this.http.post('/getToken',data,{headers: reqHeader});
  }

  getCityList(){
    return this.http.get('/cityList');
  } 

  fetchCountryJson(){
    return this.http.get('/countryFlag');
    
  }

   callRefreshToken(tokenPayload){
    return this.http.post('/refresh',tokenPayload);
   }
}
