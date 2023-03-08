import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  login: boolean = false;

  cars: Array<any> = [];

  user_name: string = '';
  user_surname: string = '';
  user_phone: string = '';
  user_address: string = '';
  user_email: string = '';
  no_cars_in_db: string = '';

  constructor(
    public dataCtrl: DataServiceService,
    public router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
      //load only first time
      this.dataCtrl.authenticationState.subscribe(data => {
        if(data === true){
          this.login = true;
          this.getData();
        }
        else{
          this.login = false;
        }
      });

      this.dataCtrl.deleteCarIndicator.subscribe(data => {
        this.refreshCarsList();
      });

      this.dataCtrl.translateWord("PROFILE.NO_CARS").then(data => {
        this.no_cars_in_db = data;
      })
  }

  editCar(item){
    this.router.navigateByUrl('/add-car/' + item.id);
  }

  getData(){
    if(this.dataCtrl.isLogin() == true){
      this.user_name= this.dataCtrl.user.first_name;
      this.user_surname= this.dataCtrl.user.last_name;
      this.user_phone= this.dataCtrl.user.phone;
      this.user_address = this.dataCtrl.user.address;
      this.user_email= this.dataCtrl.user.username;
    }

    this.dataCtrl.getAllCarFromStorage().then(data => {
      this.cars = data;
    });
  }

  refreshCarsList(){
    this.dataCtrl.getAllCarFromStorage().then(data => {
      this.cars = data;
    });
  }



 async deleteAccount(){
    let header= await this.dataCtrl.translateWord("PROFILE.DELETE_ACCOUNT");
    let text= await this.dataCtrl.translateWord("PROFILE.DELETE_ACCOUNT_TEXT");
    let cancel= await this.dataCtrl.translateWord("BUTTON.CANCEL");
    let ok= await this.dataCtrl.translateWord("BUTTON.OK");

    const alert = await this.alertController.create({
      header: header,
      message: text,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: () => {
            // do nothing
          },
        },
        {
          text: ok,
          role: 'confirm',
          handler: () => {
            this.deleteUserServer();
          },
        },
      ],
    });

    await alert.present();
  }

  changeData(){
    this.router.navigateByUrl('/tabs/profile/update-profile');
  }

  deleteUserServer(){
    this.dataCtrl.showLoader().then(() => {
      let data = {
        function: 'deleteAcc'
      };

      this.dataCtrl.postServer('', data).then((data: ApiResult) => {
        this.dataCtrl.hideLoader();
        this.logout();
      }).catch(err =>{
        console.log(err);
        this.dataCtrl.hideLoader();
        this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
      });
    });
  }

  addCar(){
    this.router.navigateByUrl('/add-car');
  }

  logout(){
    if(this.dataCtrl.authenticationState.value == true){
      this.dataCtrl.showLoader().then(() => {
        this.dataCtrl.oauthLogout().then(() =>{
          this.dataCtrl.hideLoader();
          this.dataCtrl.translateWord("MESSAGES.SUCCESS_LOGOUT").then(data => {
            this.dataCtrl.showToast(data, AlertType.Success);
          })
        })
      });
    }
    else{
      this.dataCtrl.translateWord("MESSAGES.NOT_LOGIN").then(data => {
        this.dataCtrl.showToast(data, AlertType.Warning);
      })
    }
  }

  async goToLogin(){
    await this.dataCtrl.setStorage('back_string', '/tabs/profile');
    this.router.navigateByUrl('/tabs/profile/login');
  }

}
