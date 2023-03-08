import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertType, ApiResult, DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  pageType: string = 'login';

  showLogin: boolean = true;
  showRegister: boolean = false;
  wrongPassword: boolean = false;
  showBack: boolean = false;

  formLogin : FormGroup;
  formRegister : FormGroup;

  back_string: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private dataCtrl: DataServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.formRegister = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      address: ['', Validators.compose([Validators.required])]
    });

    this.dataCtrl.getStorage('back_string').then(back_string => {
      if(back_string == null){
        this.back_string = '/tabs';
        this.showBack = true;
      }
      else{
        this.back_string = back_string;
        this.showBack = true;
      }
    });
  }

  get username(){
    return this.formLogin.get('username');
  }

  get password(){
    return this.formLogin.get('password');
  }

  get username_reg(){
    return this.formRegister.get('username');
  }

  get first_name_reg(){
    return this.formRegister.get('first_name');
  }

  get last_name_reg(){
    return this.formRegister.get('last_name');
  }

  get password_reg(){
    return this.formRegister.get('password');
  }

  get address_reg(){
    return this.formRegister.get('address');
  }

  cancel(){
    this.dataCtrl.removeStorage('back_string');
    this.router.navigateByUrl(this.back_string, { replaceUrl: true});
  }

  login(){
    let email = this.formLogin.value.username;
    let password = this.formLogin.value.password;

    this.dataCtrl.showLoader().then(() => {
      this.dataCtrl.oauthAuthorize(email, password).then( data => {

        this.dataCtrl.translateWord("MESSAGES.SUCCESS_LOGIN").then(translate_word => {
          this.dataCtrl.showToast(translate_word, AlertType.Success);
        }); 

        this.cancel();
        this.dataCtrl.hideLoader();

      }).catch(err => {
        this.dataCtrl.hideLoader();
        if(err.status == 401 && err.error.error == 'invalid_grant'){
          this.dataCtrl.translateWord('FORMS_ERROR.WRONG_PASSWORD').then(data => {
            this.dataCtrl.showToast(data, AlertType.Warning);
          });
          this.wrongPassword = true;
        }
        else{
          console.log(err);
        }
      });

    });
  }

  clearError(){
    this.wrongPassword = false;
  }

  register(){
    let email = this.formRegister.value.username;
    let first_name = this.formRegister.value.first_name;
    let last_name = this.formRegister.value.last_name;
    let password = this.formRegister.value.password;
    let address = this.formRegister.value.address;

    this.dataCtrl.showLoader().then(() => {
      let data = {
        function: 'registerUser',
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password,
        address: address
      };
      this.dataCtrl.postServer('', data).then((data: ApiResult) => {
        if(data.valid == true){
          this.dataCtrl.oauthAuthorize(email, password).then( (login_data: ApiResult) => {
              this.dataCtrl.translateWord("MESSAGES.SUCCESS_LOGIN").then(translate_word => {
                this.dataCtrl.showToast(translate_word, AlertType.Success);
              });

              this.cancel();
              this.dataCtrl.hideLoader();
          });
        }
        else{
          if(data.message == 'user exist'){
            this.dataCtrl.hideLoader();
            this.dataCtrl.translateWord("MESSAGES.USER_EXIST").then(translate_word => {
              this.dataCtrl.showToast(translate_word, AlertType.Warning);
            });
          }else{
            this.dataCtrl.hideLoader();
            this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
              this.dataCtrl.showToast(data, AlertType.Warning);
            });
          }
        }
      }).catch(err => {
        this.dataCtrl.hideLoader();
        this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
        console.log(err);
      });

    
    });
  }

  changeType(){
    if(this.pageType == 'login'){
      this.showLogin = true;
      this.showRegister = false;
    }
    else{
      this.showLogin = false;
      this.showRegister = true;
    }
  }

}
