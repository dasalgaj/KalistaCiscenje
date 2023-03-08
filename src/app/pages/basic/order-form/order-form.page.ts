import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ObservableService } from 'src/app/services/observable.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.page.html',
  styleUrls: ['./order-form.page.scss'],
})
export class OrderFormPage implements OnInit {

  formOrder : FormGroup;

  isSubmitted = false;

  period: any;
  user: any;

  dataLoad: boolean = false;

  period_time: string;
  period_date: string;


  constructor(
    public dataCtrl: DataServiceService,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public router: Router,
    private observable: ObservableService
  ) { }

  ngOnInit() {
    this.init();

    this.formOrder = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      date: [''],
      message: ['', Validators.compose([Validators.required])]
    });

    this.first_name.setValue(this.dataCtrl.user.first_name);
    this.last_name.setValue(this.dataCtrl.user.last_name);

  }

  sendUpit() {
    this.isSubmitted = true;
    if (!this.formOrder.valid) {
      console.log('Unesi sve podatke');
    }
    else {
      this.sendOrder();
    }
  }

  sendOrder(){   

    let first_name = this.formOrder.value.first_name;
    let last_name = this.formOrder.value.last_name;
    let address = this.dataCtrl.user.address;
    let date = this.period_date;
    let message = this.formOrder.value.message;
    
    var arrayDate = date.split(".");
    var resultDate = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];

    let data= {
      function: 'sendOrder',
      date: resultDate,
      company: 1,
      orderLocation: address,
      description: message,
      first_name: first_name,
      last_name: last_name
    };

    this.dataCtrl.showLoader().then(() => {
      this.dataCtrl.postServer('', data).then((data: ApiResult) => {
        this.dataCtrl.getUserData().then(() => {
          this.dataCtrl.hideLoader();       
          this.dataCtrl.showToast('Uspješno ste poslali upit', AlertType.Success);
          this.navCtrl.back();
          
        }).catch(err => {
          this.dataCtrl.hideLoader();
          this.dataCtrl.showToast('Došlo je do pogreške', AlertType.Warning);

          console.log(err);
        });
      })

    });

    
    
  }

  async init(){
    let period_str = await this.dataCtrl.getStorage('period');
    this.period = JSON.parse(period_str);

    //this.period_display = date_display + ', u ' + this.period.date_periods_start;
    //this.period_time = this.period.date_periods_start;
    this.period_date = this.period.date;

    await this.dataCtrl.showLoader();
    this.user = this.dataCtrl.user;
    this.dataLoad = true;
    this.dataCtrl.hideLoader();

  }

  back(){
    //this.observable.publishSomeData('reloadPage');
    this.navCtrl.back();
  }

  get first_name(){
    return this.formOrder.get('first_name');
  }

  get last_name(){
    return this.formOrder.get('last_name');
  }

  get date(){
    return this.formOrder.get('date');
  }

  get message(){
    return this.formOrder.get('message');
  }

}
