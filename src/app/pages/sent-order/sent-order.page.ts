import { Component, OnInit } from '@angular/core';
import { AlertController, IonModal, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sent-order',
  templateUrl: './sent-order.page.html',
  styleUrls: ['./sent-order.page.scss'],
})
export class SentOrderPage implements OnInit {

  formUser : FormGroup;
  isSubmitted = false;

  period_display: string;

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private dataCtrl: DataServiceService,
    private formBuilder: FormBuilder
  ) {  }

  ngOnInit() {

    if (!this.provjera()) {
      this.formUser = this.formBuilder.group({
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        address: ['', [Validators.required]],
        message: ['', [Validators.required]],
        date: ['']
      });
    }
    else {
      this.formUser = this.formBuilder.group({
        first_name: [this.dataCtrl.user.first_name, Validators.compose([Validators.required])],
        last_name: [this.dataCtrl.user.last_name, Validators.compose([Validators.required])],
        address: [this.dataCtrl.user.address, Validators.compose([Validators.required])],
        message: ['', [Validators.required]],
        date: ['']
      });
      
    }

    const extrasDate = this.router.getCurrentNavigation().extras.state;
    this.formUser.get('date').setValue(extrasDate);
    
  }

  provjera() {
    var prijavljen;

    if (!this.dataCtrl.user) {
      prijavljen = false;
    }
    else {
      prijavljen = true;
    }

    return prijavljen;
  }

  isReadonly() {

    if (this.provjera()) {
      return this.isReadonly;
    }

  }

  async addImage() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'Dodaj sliku!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  sendUpit() {
    this.isSubmitted = true;
    if (!this.formUser.valid) {
      console.log('Unesi sve podatke');
    }
    else {
      this.unesi();
    }
  }

  unesi() {
    let first_name = this.formUser.value.first_name;
    let last_name = this.formUser.value.last_name;
    let address = this.formUser.value.address;
    let date = this.formUser.value.date;
    let message = this.formUser.value.message;
    
    var arrayDate = date.split(".");
    var resultDate = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];

    let data= {
      function: 'sendOrder',
      date: resultDate,
      time_start: null,
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

  get errorControl() {
    return this.formUser.controls;
  }

}
