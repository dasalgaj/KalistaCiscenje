import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DataServiceService } from './services/data-service.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public platform: Platform,
    public dataCtrl: DataServiceService,
    public translateConfigService: TranslateConfigService
  ) {
    this.initApp();
  }

  initNotifications(){
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
        this.addNotificationsListener();
      } else {
        // Show some error
      }
    });
  }

  addNotificationsListener(){
    PushNotifications.addListener('registration', (token: Token) => {
      // Push Notifications registered successfully.
      // Send token details to API to keep in DB.
      this.dataCtrl.setNotificationToken(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      // Handle push notification registration error here.
      console.log('Notification registrationError');

    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        // Show the notification payload if the app is open on the device.
      }
    );

    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          // Implement the needed action to take when user tap on a notification.
        }
    );
  }

  initApp(){
    this.platform.ready().then(() => {
        // provjera login
        // kreiranje ionic storage
        this.dataCtrl.initFunc().then(() => {

          this.translateConfigService.getDefaultLanguage();

                  // pokreni inicijalizaciju notifikacija
                  if(this.platform.is('cordova') || this.platform.is('capacitor')){
                    this.initNotifications();
                  }

                  // izvrisit sve provjere i funkcije prije ove funkcije
                  // jer tek kad se pokrene ova funkcija dozvoljava se 
                  // pokretanje prve stranice
                  this.dataCtrl.setReadyPage();

                  // check login
                  // ako je login onda postavi varijablu koja ce dopustiti
                  // ulazak na stranicu
                  // nakon postavljanja te varijable ugasi splash
                  if(this.platform.is('cordova') || this.platform.is('capacitor')){
                    SplashScreen.hide();
                    StatusBar.show();
                  }

        });
    });

  }
}
