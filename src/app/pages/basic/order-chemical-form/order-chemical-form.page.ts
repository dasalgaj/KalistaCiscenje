import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-order-chemical-form',
  templateUrl: './order-chemical-form.page.html',
  styleUrls: ['./order-chemical-form.page.scss'],
})
export class OrderChemicalFormPage implements OnInit {

  formOrder : FormGroup;

  myVehicles: Array<any> = [];
  noCars: boolean = true;
  selectCar: any;
  
  no_cars_str: string;
  datePickerMin: string;
  searchISODateStr: string;
  searchTimeStr: any;

  constructor(
    public dataCtrl: DataServiceService,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public router: Router
  ) { 

  }



  ngOnInit() {

    moment.locale('hr');
    this.datePickerMin = moment().format('YYYY-MM-DD');

    this.dataCtrl.translateWord("ORDER_FORM.NO_CARS2").then(data => {
      this.no_cars_str = data;
    });

    this.formOrder = this.formBuilder.group({
      select_car: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      car_model: ['', Validators.compose([Validators.required])],
      car_label: ['', Validators.compose([Validators.required])],
      // date_pick: ['', []],
      // time_pick: ['', []],
      description: ['', Validators.compose([Validators.required])]


    });

    this.dataCtrl.deleteCarIndicator.subscribe(data => {
      this.getMyVehicle();
    });

    this.first_name.setValue(this.dataCtrl.user.first_name);
    this.last_name.setValue(this.dataCtrl.user.last_name);
    this.searchISODateStr = this.datePickerMin;
    let today = new Date();
    this.searchTimeStr = moment().toISOString();

  }

  sendOrder(){
    let car_model = this.formOrder.value.car_model;
    let car_label = this.formOrder.value.car_label;
    let name = this.formOrder.value.first_name;
    let lastname = this.formOrder.value.last_name;
    let date = this.searchISODateStr;
    let time = this.searchTimeStr;
    let description = this.formOrder.value.description;

    time = moment(time).utc().format('HH:mm');

    let data ={
      function: 'sendChemicalOrder',
      car_model: car_model,
      car_label: car_label,
      name: name,
      lastname: lastname,
      date: date,
      time: time,
      description: description,
      company: environment.company
    };

    this.dataCtrl.showLoader().then(() => {
      this.dataCtrl.postServer('', data).then((data: ApiResult) => {
          if(data.data == 'success'){
            this.dataCtrl.translateWord('ORDER_FORM.SUCCESS').then(data => {
              this.dataCtrl.showToast(data, AlertType.Success);
            });
          }

          if(data.data == 'period is used'){
            this.dataCtrl.translateWord('ORDER_FORM.UNSUCCESS').then(data => {
              this.dataCtrl.showToast(data, AlertType.Warning);
            });
          }

          this.dataCtrl.hideLoader();
          this.router.navigateByUrl('/tabs/order');

      }).catch(err => {
        this.dataCtrl.hideLoader();
        this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
        console.log(err);
      });
    });


  }

  back(){
    this.navCtrl.back();
  }

  async getMyVehicle(){
    await this.dataCtrl.getAllCarFromStorage().then(data => {
      if(data.length > 0){
        this.myVehicles = data;
        this.selectCar = this.myVehicles[0];
        this.noCars = false;
      }
      else{
        this.noCars = true;
      }
    });
  }

  addVehicle(){
    this.router.navigateByUrl('/add-car/');
  }

  onItemSelection(){
    if(this.formOrder.value.select_car != ''){
      let select_id = this.formOrder.value.select_car;

      let car = this.myVehicles.find(item =>  item.id == select_id);
  
      this.car_model.setValue(car['car_model']);
      this.car_label.setValue(car['car_label']);
    }
  }

  get first_name(){
    return this.formOrder.get('first_name');
  }

  get last_name(){
    return this.formOrder.get('last_name');
  }

  get select_car(){
    return this.formOrder.get('select_car');
  }

  get car_model(){
    return this.formOrder.get('car_model');
  }

  get car_label(){
    return this.formOrder.get('car_label');
  }

  get description(){
    return this.formOrder.get('description');
  }



}
