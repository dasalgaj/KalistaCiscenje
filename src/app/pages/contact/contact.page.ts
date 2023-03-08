import { Component, OnInit } from '@angular/core';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  company = environment.company;

  dataLoad: boolean = false;

  company_address = "";
  company_email = "";
  company_phone = "";
  company_phone_format = "";

  constructor(
    public dataCtrl: DataServiceService,
    private socialSharing: SocialSharing,
  ) { }

  ngOnInit() {
    //this.getContact();
  }

  sendEmail() {
    window.open(`mailto:kalistaciscenje@gmail.com`);
}

  callNumber(){
    window.open('tel:+385 91 228 2828');
  }

  /*getContact(){
    this.dataCtrl.showLoader().then(() => {
      let data ={
        function: 'getContact', 
        company: this.company
      };

      this.dataCtrl.postServer('', data).then((data : ApiResult) => {
        this.dataCtrl.hideLoader();
        if(data.valid == true){
          this.company_address = data.data['address'];
          this.company_email = data.data['email'];
          this.company_phone = data.data['phone'];
          this.company_phone_format = data.data['phone_format'];
  
          this.dataLoad = true;
        }
        else{
          this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
            this.dataCtrl.showToast(data, AlertType.Warning);
          });
        }
      }).catch((err) => {
        console.log(err);
        this.dataCtrl.hideLoader();
        this.dataCtrl.translateWord('MESSAGES.CATCH_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
      });
    });

  }*/

  async openInstagram(link){
    await Browser.open({ url: link });
  }

  openWhatsApp(){

    this.socialSharing.shareViaWhatsAppToPhone(
      '+912282828',
      '',
      null,
      null
    ).then(response => {
      console.log(response);
    }).catch(e => {
      console.log(e);
    });
    
  }

}
