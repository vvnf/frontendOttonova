import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BasicService } from '../services/basic.service';
import { switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthTokenInterceptors implements HttpInterceptor{
    jwtHelper = new JwtHelperService();
    constructor(private bService: BasicService){}
  intercept(req: HttpRequest<any>, next: HttpHandler)
  :Observable<HttpEvent<any>> {
    if (req.url.indexOf('/refresh') > -1) {
        return next.handle(req);
      }

   const userToken = localStorage.getItem("userToken");
   const tokenExp = localStorage.getItem("userTokenExp");
   if(userToken){

    if(Date.now() < Number(tokenExp)* 1000){// token still alive
        const transformedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${userToken}`)
           });
        return next.handle(transformedReq);
    }
    const payload = {
        userToken: localStorage.getItem("userToken"),
        refreshToken: localStorage.getItem('refreshToken'),
      };
    return this.bService.callRefreshToken(payload).pipe(
        switchMap((newTokens: any) => {
           
          localStorage.setItem('userToken', newTokens.token);
          localStorage.setItem('refreshToken', newTokens.refreshToken);
          const decodedUser = this.jwtHelper.decodeToken(
            newTokens.token
          );
          console.log('newTokens', decodedUser); 
          localStorage.setItem('userTokenExp', decodedUser.exp);

          const transformedReq = req.clone({
            headers: req.headers.set(
              'Authorization',
              `bearer ${newTokens.userToken}`
            ),
          });
          return next.handle(transformedReq);
        })
      );
    } else {
      return next.handle(req);
    }
   }
}