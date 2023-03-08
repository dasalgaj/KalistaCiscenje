import { Component, OnInit } from '@angular/core';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.page.html',
  styleUrls: ['./price-list.page.scss'],
})
export class PriceListPage implements OnInit {

  company = environment.company;

  dataLoad: boolean = false;

  prices: Array<any>;

  constructor(
    private dataCtrl: DataServiceService
  ) { }

  ngOnInit() {
    this.getPrice();
  }

  priceFormat(price){
    let price_str = new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(price);
    return price_str;
  }

  getPrice(){
    this.dataCtrl.showLoader().then(() => {
      let data = {
        function: 'getPrice', 
        company: this.company
      };
      this.dataCtrl.postServer('', data).then((data : ApiResult) => {
        this.dataCtrl.hideLoader();
        if(data.valid){
          this.dataLoad = true;
          this.prices = data.data;

          let last_category = '';
          data['data'].map(item => {
            if(item.category_title == last_category){
              item['category_title_new'] = '';
            }else{
              item['category_title_new'] = item.category_title;
            }

            last_category = item.category_title;
          });
        }else{
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

}
