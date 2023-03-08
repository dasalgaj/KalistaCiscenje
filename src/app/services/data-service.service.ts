import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Platform, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';

export interface ApiResult {
  data: any;
  message: string;
  valid: boolean;
}

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  type: string;
  phone: string;
  address: string;
}

export enum AlertType {
  Success = 'success',
  Warning = 'warning',
}

const serverURL = environment.rest_server.protokol + environment.rest_server.host +environment.rest_server.functions.api;

const tokenURL = environment.rest_server.protokol + environment.rest_server.host +environment.rest_server.functions.token;

const TOKEN_KEY = 'access_token';
const TOKEN_KEY_REFRESH = 'refresh_token';
const FCM_TOKEN_KEY = 'fcm_token_key';

const client_id = "testclient";
const client_password = "testpass";


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  authenticationState = new BehaviorSubject(null);
  readyPage = new BehaviorSubject(null);

  deleteCarIndicator = new BehaviorSubject(null);
  orderState = new BehaviorSubject(null);



  getting_new_access_token = false;
  getting_new_access_client_token = false;

  user: UserData;
  loader: any;
  toast: any;

  constructor(
    private http: HttpClient,
    public platform: Platform,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    private translateCtrl: TranslateService
      ) {
    //this.initFunc();
  }

  async initFunc(){
    await this.platform.ready();
    await this.createStorage();
    await this.oauthCheckToken();
  }

  changeOrderState(key){
    this.orderState.next(key);
  }

  translateWord(key){
    let promise = new Promise<string>((resolve, reject) => {
      this.translateCtrl.get(key).toPromise().then( value => {
        resolve(value);
        }
      );
    });
    return promise;
  }

  async setNotificationToken(token = ''){
    if(token != ''){
      await this.setStorage(FCM_TOKEN_KEY, token);
      if(this.isLogin() == true){
        this.sendTokenToServer();
      }
    }
    else{
      this.sendTokenToServer();
    }
  }

  fcmDeleteToken(){
    this.getStorage(FCM_TOKEN_KEY).then(data => {
      if(data != ''){
        let data_send = {
          function: 'notificationTokenDelete',
          token: data
        };
        this.postServer('', data_send).then(() => {

        }).catch(err => {
          console.log(err);
        });
      }
    });
  }

  sendTokenToServer(){
    this.getStorage(FCM_TOKEN_KEY).then(data => {
      if(data != ''){
        let data_send = {
          function: 'notificationTokenAdd',
          token: data
        };
        this.postServer('', data_send).then(() => {

        }).catch(err => {
          console.log(err);
        });
      }
    });
  }

  async showToast(message, color='primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });

    await toast.present();
  }

  async showLoader() {
     this.loader = await this.loadingCtrl.create({
      spinner: 'circles',
    });

    this.loader.present();
  }

  hideLoader(){
    this.loader.dismiss();
    this.loader = null;
  }

  setReadyPage(){
    this.readyPage.next(true);
  }

  isLogin() {
    return this.authenticationState.value;
  }

  private server_erro_logic(url, refresh_token, err, type, data){
    let promise = new Promise((resolve, reject) => {
      if(err.status == 401){
        if(refresh_token != null){
          this.oauthGetFreshToken().then(() =>{
            this.getServer(url).then(data_2 => {
              resolve(data_2);
            }).catch((err_2) => {
              reject(err_2);
            });
          }).catch(err_2 => {
            reject(err_2);
          });
        }
        else{
          // get offline refresh token
          this.oauthClientAuthorize().then(() =>{
            if(type == 'get'){
              this.getServer(url).then(data_2 => {
                resolve(data_2);
              }).catch((err_2) => {
                reject(err_2);
              });
            }
            //post
            else{
              this.postServer(url, data).then(data_2 => {
                resolve(data_2);
              }).catch((err_2) => {
                reject(err_2);
              });
            }

          }).catch(err_2 => {
            reject(err_2);
          });
        }
      }
      else{
        reject(err);
      }
    });
    return promise;
  }

  wait(ms = 5000){
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), ms);
    });
  }




  /// pazi ovo ne radi dobro
  // async getTest(){
  //   let access_token = await this.wait();
  //   console.log(access_token);

  //   this.wait().then(() => {
  //     console.log('ooj22');
  //   });
  // }

  // async getTest(){
  //   let access_token = await this.wait();
  //   console.log(access_token);

  //   let promise = new Promise((resolve, reject) => {
  //     setTimeout(() => resolve(true), 5000);
  //   });
  //   return promise;
  // }

  private checkCache(key, cache_time){
    let promise = new Promise((resolve, reject) => {
        this.getStorage(key).then(data_str => {
          if(data_str != null){
            let data = JSON.parse(data_str);
            let timeNow = Date.now();
            if(data.miliseconds + cache_time >= timeNow){
              resolve(data.res);
            }
            else{
              resolve(false);
            }
          }
          else{
            resolve(false);
          }
        }).catch(() =>{ 
          resolve(false);
        });
    });
    return promise;
  }

  getAllStorageKeys() {
    let list: Array<any> = [];
    var promise = new Promise<Array<any>>((resolve, reject) => {
      this.storage.forEach((value, key, index) => {
        list.push(key);
      }).then((d) => {
        resolve(list);
      });
    });
    return promise;
  }

  async deleteCar(id){
    await this.removeStorage(environment.car_key + id);
    this.deleteCarIndicator.next(id);
    return true;
  }

  async getCarById(id){
    let car_str = await this.getStorage(environment.car_key + id);
    if(car_str != null){
      let car_obj = JSON.parse(car_str);
      return car_obj;
    }
    else{
      return null;
    }

  }

  async getAllCarFromStorage(){
    let storageList =  await this.getAllStorageKeys();
    let carList: Array<any> = [];

    if(storageList.length > 0){
      for (let index = 0; index < storageList.length; index++) {
        if(storageList[index].startsWith(environment.car_key) == true){
          let car_str = await this.getStorage(storageList[index]);
          let car_obj = JSON.parse(car_str);
          carList.push(car_obj);
          
        }
      }
    }

    return carList;
  }

  async editCarInStorage(id,  car_name, car_model, car_label){
    let carData = {
      id: id,
      car_name: car_name,
      car_model: car_model,
      car_label: car_label
    };
    let carData_str = JSON.stringify(carData);

    await this.setStorage(environment.car_key + id, carData_str);
    this.deleteCarIndicator.next(id);

  }

  async addCarInStorage(car_name, car_model, car_label){
    let id: number = 0;
    let storageList =  await this.getAllStorageKeys();
    if(storageList.length > 0){
      for (let index = 0; index < storageList.length; index++) {
        if(storageList[index].startsWith(environment.car_key) == true){
          let car_str = await this.getStorage(storageList[index]);

          let car_obj = JSON.parse(car_str);
          if(car_obj.id > id){
            id = car_obj.id;
          }
        }
      }
    }

    id = id+1;

    let carData = {
      id: id,
      car_name: car_name,
      car_model: car_model,
      car_label: car_label
    };
    let carData_str = JSON.stringify(carData);

    await this.setStorage(environment.car_key + id, carData_str);
    this.deleteCarIndicator.next(id);

  }


  async deleteAllCache(){
    let storageList =  await this.getAllStorageKeys();
    for (let index = 0; index < storageList.length; index++) {
      if(storageList[index].startsWith(environment.cache_key) == true){
        await this.removeStorage(storageList[index]);
      }
    }
  }

  async getServer(url, cache = false, cache_time = 5) {
    cache_time = cache_time * 1000; //convert to miliseconds
    let access_token = await this.getStorage(TOKEN_KEY);
    let refresh_token = await this.getStorage(TOKEN_KEY_REFRESH);
    let cachedData = await this.checkCache(environment.cache_key + url, cache_time);

    if(cache == true){
      if(environment.cache == false){
        cache = false;
      }
    }


    let promise = new Promise((resolve, reject) => {
      let apiURL = serverURL + url;

      let options = {};
      if(access_token != null){
        options = {
          headers: new HttpHeaders().append('Authorization', "Bearer " + access_token)
        }
      }else{
        options = {};
      }

      if(cache == true && cachedData != false){
        resolve(cachedData);
      }
      else{
        this.http.get(apiURL, options)
        .toPromise()
        .then(
            res => { // Success
              if(cache == true){
                let miliseconds = Date.now();

                let cache_data = {
                  key: environment.cache_key + url,
                  miliseconds: miliseconds,
                  res: res
                };
  
                this.setStorage(cache_data.key, JSON.stringify(cache_data)).then(() => {
                  resolve(res);
                });
              }
              else{
                resolve(res);
              }


            },
            err => { // Error
              this.server_erro_logic(url, refresh_token, err, 'get', {}).then(data =>{
                resolve(data);
              }).catch(err => {
                reject(err);
              });
            }
        );
      }

    });
    return promise;
  }

  async postServer(url, data) {
    let access_token = await this.getStorage(TOKEN_KEY);
    let refresh_token = await this.getStorage(TOKEN_KEY_REFRESH);

    let promise = new Promise((resolve, reject) => {
      let apiURL = serverURL + url;

      let options = {};
      if(access_token != null){
        options = {
          headers: new HttpHeaders().append('Authorization', "Bearer " + access_token)
        }
      }else{
        options = {};
      }

      this.http.post(apiURL, data, options)
          .toPromise()
          .then(
              res => { // Success
                // this.results = res.json().results;
                resolve(res);
              },
              err => { // Error
                this.server_erro_logic(url, refresh_token, err, 'post', data).then(data =>{
                  resolve(data);
                }).catch(err => {
                  reject(err);
                });
              }
          );
    });
    return promise;
  }

  private _oauthCheckToken(){
    return new Promise((res,rej)=>{
      this.oauthGetFreshToken().then(succ => {
        this.getUserData().then((user: UserData) => {
          //this.user = user;
          this.authenticationState.next(true);
          res(true);
        }).catch(err => {
          rej(false);
        });
      }).catch(err => {
        rej(false);
      });
    });
  }

  async oauthCheckToken(){
    let token: string = '';
    let token_refresh: string = '';

    token = await this.getStorage(TOKEN_KEY);
    token_refresh = await this.getStorage(TOKEN_KEY_REFRESH);

    if(token != null && token_refresh != null){
      await this._oauthCheckToken();
    }
    else{
      this.authenticationState.next(false);
    }
  }

  async oauthClientAuthorize(){
    await this.platform.ready();
    let serverUrl_token = tokenURL;

    let promise = new Promise((res, rej) => {
      if(!this.getting_new_access_client_token) {
        this.getting_new_access_client_token = true;
  
        // create the data to be posted
        var postObj = {
          grant_type: 'client_credentials',
          client_id: client_id,
          client_secret: client_password
        };
  
        this.http.post(serverUrl_token, postObj).toPromise().then(data => {
          this.setStorage(TOKEN_KEY, data['access_token']).then(() => {
              // send FCM TOKEN
            this.getting_new_access_client_token = false;
  
            res(true);
          });
        },
        err => {
          // nemoguce je dobiti offline token
          // znaci nemoguce je bilo sto dohvatiti
          // sa servera
          rej(false);
          
        });
  
      }else{
        // we are already gettting a new token, lets just wait untill we get the new one and resolve the promise
        let ticker = setInterval(()=>{
          if(!this.getting_new_access_client_token) {
            clearInterval(ticker);
            res(true);
          }else{
            rej(false);
          }
        },10);
      }
    });
    return promise;
  }

  getUserData(){
    return new Promise((res,rej)=>{
      this.postServer('', {function: 'getUserData'}).then((data: ApiResult) => {
        let user_data: UserData = null;
  
        if(data.valid == true){
          user_data = data.data
        }

        this.user = user_data

        this.authenticationState.next(true);

  
        res(user_data);
      }).catch(err => {
        rej(err);
      });
    });
  }

  oauthAuthorize(username: string, password: string){
    return new Promise((res,rej)=>{
      let serverUrl_token = tokenURL;
      username = username.trim();
      password = password.trim();

      this.platform.ready().then(() => {
        // create the data to be posted
        var postObj = {
          grant_type: 'password',
          client_id: client_id,
          client_secret: client_password,
          username: username,
          password: password
        };

        this.http.post(serverUrl_token, postObj).toPromise().then(data => {
          this.setStorage(TOKEN_KEY, data['access_token']).then(() => {
            this.setStorage(TOKEN_KEY_REFRESH, data['refresh_token']).then(() => {
              this.getUserData().then((user: UserData) => {
                //this.user = user;
                this.deleteAllCache().then(() => {
                  this.authenticationState.next(true);
                  res(true);
                });
              }).catch(err => {
                rej(false);
              });
              this.setNotificationToken();
              res(true);
            });
          });
        },
        err => {
          if(err.status == 400){
            if(err.error.error == 'invalid_grant'){
              this.oauthLogout().then(() => {
                rej(false);
              });
            }
          }else{
            rej(err);
          }
        });
      });
    });
  }

  oauthGetFreshToken(){
    return new Promise((res,rej)=>{
      let serverUrl_token = tokenURL;
      if(!this.getting_new_access_token) {
        this.getting_new_access_token = true;

        let refresh_token: string = '';
        this.getStorage(TOKEN_KEY_REFRESH).then(refresh_token => {
          let postObj = {
            grant_type: 'refresh_token',
            client_id: client_id,
            client_secret: client_password,
            refresh_token:  refresh_token
          };

          this.http.post(serverUrl_token, postObj).toPromise().then(data => {
            this.setStorage(TOKEN_KEY, data['access_token']);
            this.setStorage(TOKEN_KEY_REFRESH, data['refresh_token']);
            this.getting_new_access_token = false;
            res(true);
          },
          err => {
            console.log(err);
            if(err.status == 400){
              if(err.error.error == 'invalid_grant' || err.error.error == 'invalid_request'){
                console.log("logout");
                this.oauthLogout().then(() => {
                  rej(false);
                });
              }
            }
          });
        });
      }
      else{
        // we are already gettting a new token, lets just wait untill we get the new one and resolve the promise
        let ticker = setInterval(()=>{
          if(!this.getting_new_access_token) {
            clearInterval(ticker);
            res(true);
          }else{
            return rej(false);
          }
        },10);
      }
    });
  }

  async oauthLogout(){
    await this.fcmDeleteToken();
    await this.removeStorage(TOKEN_KEY);
    await this.removeStorage(TOKEN_KEY_REFRESH);
    await this.deleteAllCache();
    this.user = null;
    // delete FMC token
    this.authenticationState.next(false);
  }

  async setStorage($key: string, $data: string){
    return await this.storage.set($key, $data);
  }

  async getStorage($key: string){
    return await this.storage.get($key);
  }

  async removeStorage($key: string){
    return await this.storage.remove($key);
  }

  async createStorage(){
    return await this.storage.create();
  }


}
