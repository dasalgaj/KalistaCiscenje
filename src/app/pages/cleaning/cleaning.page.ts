import { Component, OnInit } from '@angular/core';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.page.html',
  styleUrls: ['./cleaning.page.scss'],
})
export class CleaningPage{

  ordersNajavljeno: Array<any>;
  ordersArhivirano: Array<any>;
  ordersArray: Array<any>;

  constructor(
    public dataCtrl: DataServiceService,
  ) {  }

  ionViewWillEnter() {
    if (this.dataCtrl.isLogin()) {

      this.getMyOrders();

    }
    else {

    }
  }

  getMyOrders() {

      this.dataCtrl.showLoader().then(() => {
        let data = {
          function: 'getMyOrders'
        };
        this.dataCtrl.postServer('', data).then((data : ApiResult) => {
          this.dataCtrl.hideLoader();
          if(data.valid){

            this.ordersNajavljeno = data.data['najavljeno']; 
            this.ordersArhivirano = data.data['arhivirano'];
  
          }
          else{
            this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
              this.dataCtrl.showToast(data, AlertType.Warning);
            });
          }
  
        }).catch(err =>{
          this.dataCtrl.hideLoader();
          this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
            this.dataCtrl.showToast(data, AlertType.Warning);
          });
        });
  
      });

  }

  cancelMyOrders(datum) {

      let data = {
        function: 'cancelMyOrders',
        date: datum
      };
      this.dataCtrl.postServer('', data).then((data : ApiResult) => {
        if(data.valid){

          this.ordersNajavljeno = data.data;

        }
        else{

          this.ionViewWillEnter();
          
        }

      }).catch(err =>{
        this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
      });


  }

  confirmMyOrders(datum) {

      let data = {
        function: 'confirmMyOrders',
        date: datum
      };
      this.dataCtrl.postServer('', data).then((data : ApiResult) => {
        if(data.valid){

          this.ordersNajavljeno = data.data;

          console.log(this.ordersNajavljeno);

        }
        else{

          this.ionViewWillEnter();
          
        }

      }).catch(err =>{
        this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
      });

  }

}