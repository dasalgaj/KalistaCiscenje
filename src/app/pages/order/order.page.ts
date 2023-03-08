import { Component, EnvironmentInjector, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';
import { environment } from 'src/environments/environment';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { ObservableService } from 'src/app/services/observable.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage {

  @ViewChild(IonModal) modal: IonModal;

  isModalOpen: boolean = false;

  dataLoad: boolean = false;
  date: string = '';

  company = environment.company;

  modal_text: string = '';
  show_cancel_order: boolean = false;
  periodToRemove: any;

  items = [];
  resultDateArray = [];

  formatDate: any;
  searchDate: any;
  searchDateStr: string;
  searchISODateStr: string;
  datePickerMin: string;

  lastSearchDate: string;
  freeDay = false;
  outOfRange = false;
  data;

  free_day_str: string = '';
  out_of_range_str: string = '';


  constructor(
    public dataCtrl: DataServiceService,
    public router: Router,
    private observable: ObservableService
  ) {  }

  ionViewWillEnter(){
    
    moment.locale('hr');
    this.datePickerMin = moment().format('YYYY-MM-DD');
    this.getSearchDate();

    this.dataCtrl.translateWord('ORDER.FREE_DAY').then(data => {
      this.free_day_str = data;
    });

    this.dataCtrl.translateWord('ORDER.OUT_OF_RANGE').then(data => {
      this.out_of_range_str = data;
    });

  }

  getColor(status, user, number_of_orders, periodDate){
    if(number_of_orders != 0 && periodDate == this.data[0].date){
      return "used";
    }
    else{
      /*if(this.dataCtrl.authenticationState.value === true){
          if(this.dataCtrl.user.id == parseInt(user,10)){
            return "tertiary";
          }
          else if(status == "freeDay"){
            return "background";
          }
          else {
            return "used";
          }
      }
      else if(status == "freeDay"){
          return "primary";
      }
      else {
        return "free";
      }*/
      return 'free';
    }
  }

  getSearchDate(date = ''){

    if(date == ''){
      this.searchDate = moment();
    }
    else{
      this.searchDate = moment(date);
    }
    this.searchDateStr = this.searchDate.format('DD.MM.YYYY.');
    this.searchISODateStr = this.searchDate.format('YYYY-MM-DD');

    this.getPeriods();

  }

  changeDate(){
    if(this.lastSearchDate != this.searchISODateStr){
      this.getSearchDate(this.searchISODateStr);
    }
  }

  async openReservedForm(period){
    if(this.dataCtrl.isLogin() == true){
      await this.dataCtrl.setStorage('period', JSON.stringify(period));
      this.router.navigateByUrl('/tabs/order/order-form');
    }
    else{
      await this.dataCtrl.setStorage('back_string', '/tabs/order');
      this.router.navigateByUrl('/tabs/order/login');
    }
  }

  async openReservedInfo(type, period){


    if(type == 'break'){
      this.modal_text = await this.dataCtrl.translateWord("ORDER.NOT_AVAILABLE1");
      this.show_cancel_order = false;
    }
    else if(type == 'home_user_reserv'){
      this.modal_text = await this.dataCtrl.translateWord("ORDER.NOT_AVAILABLE1");
      this.show_cancel_order = true;
      this.periodToRemove = period;
    }
    else if(type == 'reserv'){
      this.modal_text = await this.dataCtrl.translateWord("ORDER.NOT_AVAILABLE3");
      this.show_cancel_order = false;
    }

    this.openModal();
  }

  modalCancel(){
   
    this.closeModal();
  }

  openOrder(period){
    if(period.number_of_orders != period.number_of_slots){
      this.openReservedForm(period);
    }
    else if(period.status == "break"){
      this.openReservedInfo('break', period);
    }
    else
    {
      let home_user = false;
      if(this.dataCtrl.isLogin() === true){
        if(this.dataCtrl.user != undefined){
          if(this.dataCtrl.user.id == parseInt(period.user,10)){
            home_user = true;
          }
        }
      }

      if(home_user == true){
        this.openReservedInfo('home_user_reserv', period);
      }
      else{
        this.openReservedInfo('reserv', period);
      }
    }
  }

  counter(i: number) {
    
    return new Array(i);
  }

  getPeriods(){

    var datum: any;

    datum = new Date(this.searchISODateStr);
    datum.setDate(datum.getDate());
    var dateOneWeek = datum.toLocaleDateString('de-DE');

    var arrayDate = dateOneWeek.split(".");
    var resultDate = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];

    console.log(resultDate);

    this.dataCtrl.showLoader().then(() => {
      let data = {
        function: 'getPeriods',
        company: this.company, 
        date: resultDate
      };

      //this.lastSearchDate = this.searchISODateStr;
      this.dataCtrl.postServer('',data).then((data: ApiResult) => {
        if(data.valid == true){

          this.data = data.data['list'];

          console.log(this.data);

    
          this.dataLoad = true;
          this.dataCtrl.hideLoader();
        }
        else{
          this.dataCtrl.hideLoader();
          this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
            this.dataCtrl.showToast(data, AlertType.Warning);
          });
        }
      }).catch(err => {
        console.log(err);
        this.dataCtrl.hideLoader();
        this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
      });

    });
      

  }; 

  openModal(){
    this.isModalOpen = true;
  }

  closeModal(){
    this.isModalOpen = false;
  }

  onWillDismiss(event: Event) {
    this.closeModal();
  }



}
