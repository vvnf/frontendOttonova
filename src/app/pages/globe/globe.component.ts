import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import { Subscription } from 'rxjs';
import { BasicService } from '../../services/basic.service';
import { ModalService } from '../_modal/modal.service';
import * as $ from 'jquery';
import 'slick-carousel';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})
export class GlobeComponent implements OnInit {
  public cityListSubscriber: Subscription;
  public cityListData: any;
  public modalData: any;
  public countryShortForm: any;
  constructor(
    private bService: BasicService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.bService.fetchCountryJson().subscribe((res : any)=>{
      this.countryShortForm = res.data;

        this.cityListSubscriber = this.bService.getCityList().subscribe((res : any)=>{
          this.cityListData = res.data.cities.map(city =>{
            return {
              continent:city.continent,
              country:city.country,
              landmarks:city.landmarks,
              latitude:parseFloat(city.latitude),
              longitude:parseFloat(city.longitude),
              name:city.name,
              name_native:city.name_native,
              population:city.population,
              countryShortHand: Object.keys(this.countryShortForm).find(key => this.countryShortForm[key] === city.country),
            }
          });
          //console.log('cityList', this.cityListData);
          this.initiateMap(this.cityListData);
        });

      });
  }

   

  initiateMap(cityArr){
        /* Chart code */
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        let chart = am4core.create("chartdiv", am4maps.MapChart);
        // Set map definition
        chart.geodata = am4geodata_worldLow;
        // Set projection
        chart.projection = new am4maps.projections.Orthographic();
        chart.panBehavior = "rotateLongLat";
        chart.deltaLatitude = -20;
        chart.padding(20,20,20,20);

        // limits vertical rotation
        chart.adapter.add("deltaLatitude", function(delatLatitude){
            return am4core.math.fitToRange(delatLatitude, -90, 90);
        })

        // Create map polygon series
        let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        // Configure series
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.fill = am4core.color("#47c78a");
        polygonTemplate.stroke = am4core.color("#454a58");
        polygonTemplate.strokeWidth = 0.5;

        // Create image series
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());
        // Create a circle image in image series template so it gets replicated to all new images
        var imageSeriesTemplate = imageSeries.mapImages.template;
        var circle = imageSeriesTemplate.createChild(am4core.Circle);
        circle.radius = 8;
        circle.fill = am4core.color("#FF0000");
        circle.stroke = am4core.color("#FFFFFF");
        circle.strokeWidth = 2;
        circle.nonScaling = true;
        circle.tooltipText = "{name}";
        // Set property fields
        imageSeriesTemplate.propertyFields.latitude = "latitude";
        imageSeriesTemplate.propertyFields.longitude = "longitude";
        imageSeries.data = cityArr;
        //hard coded data in globe map
        // imageSeries.data = [{
        //   "latitude": 48.856614,
        //   "longitude": 2.352222,
        //   "name": "Paris"
        // }, {
        //   "latitude": 40.712775,
        //   "longitude": -74.005973,
        //   "name": "New York"
        // }, {
        //   "latitude": 49.282729,
        //   "longitude": -123.120738,
        //   "name": "Vancouver"
        // }];

        let thisEl = this;
        imageSeriesTemplate.events.on("hit", function(ev) {
          console.log("clicked on:", ev.target.dataItem.dataContext);
          thisEl.openLandmarkDetails(ev.target.dataItem.dataContext);
        });

        let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
        graticuleSeries.mapLines.template.line.stroke = am4core.color("#ffffff");
        graticuleSeries.mapLines.template.line.strokeOpacity = 0.08;
        graticuleSeries.fitExtent = false;


        chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1;
        chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");

        // Create hover state and set alternative fill color
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = chart.colors.getIndex(0).brighten(-0.5);

        let animation;
        setTimeout(function(){
          animation = chart.animate({property:"deltaLongitude", to:100000}, 20000000);
        }, 3000)

        chart.seriesContainer.events.on("down", function(){
        if(animation){
          animation.stop();
        }
        });
  }

  openLandmarkDetails(data){
    this.modalData = data;
    this.modalService.open('landMarkDetails');
    
    $(function() { 
      let sliderHTML='';
      for(let i=0;i<data.landmarks.length;i++){
        sliderHTML += `<div>
                        <p class="landmarkDetailsModal__title">${data.landmarks[i].name}</p>
                        <img class= "landmarkDetailsModal__slideImg" src="assets/images/${data.landmarks[i].img}"/>
                      </div>`;
      }
      
      console.log('data', sliderHTML);
      $('.landmarkDetailsModal__slider').append(sliderHTML);
      $('.landmarkDetailsModal__slider').slick({
        infinite:true,
        slidesToShow:1,
        dots:true,
        autoplay:true,
        prevArrow: false,
        nextArrow: false
       });

    });
  }

  closeLandmarkDetails(){
    this.modalService.close('landMarkDetails');
    if ($('.landmarkDetailsModal__slider').hasClass('slick-initialized')) {
      $('.landmarkDetailsModal__slider').slick('unslick');
      $('.landmarkDetailsModal__slider').html('');
    }  
  }

  ngDestroy() {
    this.cityListSubscriber.unsubscribe();
  } 

}
