import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';
import { GmapsService } from 'src/app/services/gmaps.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  @ViewChild('map', {static: true}) mapElementRef: ElementRef;

  company = environment.company;

  googleMaps: any;
  map: any;
  mapEl: any;

  constructor(
    private gmaps: GmapsService,
    private dataCtrl: DataServiceService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.dataCtrl.showLoader().then(() => {
      let data = {
        function: 'getLocation', 
        company: this.company
      };

      this.dataCtrl.postServer('', data).then((data : ApiResult) => {
        if(data.valid == true){
          console.log(data);
          let lat = data.data['lat'];
          let lng = data.data['lng'];
          let zoom = data.data['zoom'];

          this.initPage(lat, lng, zoom).then(() => {
            this.dataCtrl.hideLoader();
          });
        }
        else{
          this.dataCtrl.hideLoader();
          this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
            this.dataCtrl.showToast(data, AlertType.Warning);
          });
        }
      }).catch(err => {
        this.dataCtrl.hideLoader();
        this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
      });
    });
  }

  async initPage(lat, lng, zoom){
    if(this.mapEl == undefined){
      await this.loadMap(lat, lng, zoom);
    }
    this.renderer.addClass(this.mapEl, 'visible');
  }

  async loadMap(lat, lng, zoom){
    let latitude = parseFloat(lat);
    let longitude = parseFloat(lng);
    let zoom_float = parseFloat(zoom);

    try{
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      this.mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(latitude, longitude);
      this.map = new googleMaps.Map(this.mapEl, {
        center: location,
        zoom: zoom_float,
        disableDefaultUI: true
      });

      const marker = new googleMaps.Marker({
        position: location,
        map: this.map
      });
    } catch(e){
      console.log(e);
    }
  }

}
