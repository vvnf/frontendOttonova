import { Component, OnInit,HostListener ,ElementRef , ViewChild} from '@angular/core';
import { BasicService } from '../../services/basic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Subscription } from 'rxjs';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import 'slick-carousel';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public authTokenSubscriber: Subscription;
  authTokenGenErr : boolean = false;
  jwtHelper = new JwtHelperService();
  public innerWidth: any;
  constructor(
    private bService: BasicService,
    private router: Router,
    ) { }

  ngOnInit() {
    if(localStorage.getItem('userToken') == null){
      console.log('userToken' , localStorage.getItem('userToken'));
      this.genAuthToken();
    }
    
    //on init authentication of user
    $(function (){
      $('.mainBanner__slider').slick({
       infinite:true,
       slidesToShow:1,
       dots:false,
       autoplay:true,
       prevArrow: false,
       nextArrow: false
      });
   })
  }


  gotoGlobe(){
    this.router.navigateByUrl('/globe');
  }


  genAuthToken(){
    //console.log(this.bService);
    this.authTokenSubscriber = this.bService.userAuthen().subscribe((data : any)=>{
      const decryptUserData = this.jwtHelper.decodeToken(data.token);
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userTokenExp', decryptUserData.exp);
      console.log('Succes Auth Token',data);
    },
    (err: HttpErrorResponse)=>{
      this.authTokenGenErr = true;
      console.log(`Auth Token Generation failed ${err}`)
    });
  }

  ngDestroy() {
    this.authTokenSubscriber.unsubscribe();
  }  

}
