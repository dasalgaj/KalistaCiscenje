import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
  formUser : FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dataCtrl: DataServiceService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    
    this.formUser = this.formBuilder.group({
      first_name: [this.dataCtrl.user.first_name, Validators.compose([Validators.required])],
      last_name: [this.dataCtrl.user.last_name, Validators.compose([Validators.required])],
      phone: [this.dataCtrl.user.phone, Validators.compose([Validators.required])],
      address: [this.dataCtrl.user.address, Validators.compose([Validators.required])]
    });
  }

  update(){
    let first_name = this.formUser.value.first_name;
    let last_name = this.formUser.value.last_name;
    let phone = this.formUser.value.phone;
    let address = this.formUser.value.address;

    let data= {
      function: 'updateProfile',
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      address: address
    };

    this.dataCtrl.showLoader().then(() => {
      this.dataCtrl.postServer('', data).then((data: ApiResult) => {
        this.dataCtrl.getUserData().then(() => {
          this.dataCtrl.hideLoader();
          this.dataCtrl.translateWord('UPDATE-PROFILE.UPDATE').then(data => {
            this.dataCtrl.showToast(data, AlertType.Success);
            this.navCtrl.back();
          });
        }).catch(err => {
          this.dataCtrl.hideLoader();
          this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
            this.dataCtrl.showToast(data, AlertType.Warning);
          });
          console.log(err);
        });
      })

    });

  }


  get first_name(){
    return this.formUser.get('first_name');
  }

  get last_name(){
    return this.formUser.get('last_name');
  }

  get phone(){
    return this.formUser.get('phone');
  }

  get address(){
    return this.formUser.get('address');
  }

}
