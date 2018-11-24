import { PhonePage } from './../phone/phone';
import { Component, Inject } from '@angular/core';
import { Platform, NavController, AlertController, Loading, LoadingController, ToastController, Events, ModalController } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { HomePage } from '../home/home';
import { PasswordPage } from '../password/password';
import { CreateaccountPage } from '../createaccount/createaccount';
import { AuthCredential } from "../../models/auth-credential.models";
import { AuthResponse } from "../../models/auth-response.models";
import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";
import { Address } from '../../models/address.models';
import { RegisterRequest } from "../../models/register-request.models";
import { RegisterResponse } from "../../models/register-response.models";
import { APP_CONFIG, AppConfig } from "../../app/app.config";
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook'
import { GooglePlus } from '@ionic-native/google-plus';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [WordpressClient]
})

export class LoginPage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private authError = "";
  private registerRequest: RegisterRequest = new RegisterRequest('', '', '', '', '');

  private subscriptions: Array<Subscription> = [];
  private credentials: AuthCredential = new AuthCredential('', '');
  private registerRequestPasswordConfirm: string = '';
  private registerResponse: RegisterResponse;
  buttonDisabled: Boolean = true;
  token: any = window.localStorage.getItem(Constants.ADMIN_API_KEY);

  constructor(@Inject(APP_CONFIG) public config: AppConfig,public translate:TranslateService, public facebook: Facebook,
    private events: Events, private modalCtrl: ModalController, private toastCtrl: ToastController,
    public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, public google: GooglePlus, public platform: Platform) {
    if (this.userLoggedIn()) {
      navCtrl.setRoot(HomePage);
    }
  }

  private userLoggedIn(): boolean {
    let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    return user != null;
  }

  checkNumber() {
    let phone = JSON.parse(JSON.stringify(this.credentials.username));
    if (isNaN(phone)) {
      this.buttonDisabled = true;
      this.translate.get('field_error_phone_valid').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast("Phone number is not valid");
    } else if (phone.length > 10) {
      this.buttonDisabled = true;
      setTimeout(() => {
        phone = phone.slice(0, 10);
      }, 100);
    } else if (phone.length == 10 && phone != '' && !isNaN(phone) && this.credentials.password != '') {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
    this.credentials.username = phone;
  }

  signIn() {
    this.authError = "";
    let phone = JSON.parse(JSON.stringify(this.registerRequest.username));
    if (isNaN(phone)) {
      this.translate.get('field_error_phone_valid').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast("Phone no. is not valid");
    }
    if (this.credentials.username.length == 0 || this.credentials.password.length == 0) {
      this.translate.get('login_box_empty').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Username or Password cannot be empty!');
    } else {
      this.translate.get('loging').subscribe(value => {
        this.showToast(value);
      });
      // this.presentLoading('Logging in');
      let subscription: Subscription = this.service.getAuthToken(this.credentials).subscribe(data => {
        let authResponse: AuthResponse = data;
        window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
        this.getUser(this.getUserIdFromToken(authResponse.token));
      }, err => {
        this.removeTempCart();
        this.authError = err.error.message.replace('username', 'mobile no.');
        let pos = this.authError.indexOf('<a');
        if (pos != -1) {
          this.authError = this.authError.substr(0, pos) + '<a target="_blank" ' + this.authError.substr(pos + 2, this.authError.length - 1);
        }
        this.dismissLoading();
        //this.presentErrorAlert("Unable to login with provided credentials");
      });
      this.subscriptions.push(subscription);
    }
  }

  loginFB(): void {
    this.translate.get('loging_fb').subscribe(value => {
      this.presentLoading(value);
    });
    // this.presentLoading('Logging in Facebook');
    if (this.platform.is('cordova')) {
      this.fbOnPhone();
    } else {
      this.fbOnBrowser();
    }
  }

  loginGoogle(): void {
    this.translate.get('loging_google').subscribe(value => {
      this.presentLoading(value);
    });
    // this.presentLoading('Logging in Google+');
    if (this.platform.is('cordova')) {
      this.googleOnPhone();
    } else {
      this.googleOnBrowser();
    }
  }

  googleOnPhone() {
    const provider = {
      'webClientId': this.config.firebaseConfig.webApplicationId,
      'offline': false,
      'scopes': 'profile email'
    };
    console.log("In cordova");
    console.log("Calling google in cordova");
    this.google.login(provider).then((res) => {
      this.dismissLoading();
      this.translate.get('google_success_auth1').subscribe(value => {
        this.presentLoading(value);
      });
      // this.presentLoading('Google signup success, authenticating with firebase');
      console.log('Google signup success, authenticating with firebase');
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
      
      firebase.auth().signInAndRetrieveDataWithCredential(googleCredential)
      .then((response) => {
        this.registerRequest.email = response.user.email;
        this.registerRequest.first_name = this.getNames(response.user.displayName).first_name;
        this.registerRequest.last_name = this.getNames(response.user.displayName).last_name;
        this.dismissLoading();
        this.translate.get('google_success_auth2').subscribe(value => {
          this.presentLoading(value);
        });
        // this.presentLoading('Firebase authenticated google signup, creating user..');
        console.log('Firebase authenticated google signup, creating user..');
        this.checkUser();
      },(err) => {
        console.log("Error in firebase auth after google login:-- ", JSON.stringify(err));
        this.dismissLoading();
        this.presentErrorAlert('google login err: ' + err);
      })
    }, (err) => {
      console.log("Error: in google access:-- ", JSON.stringify(err));
      this.dismissLoading();
      this.presentErrorAlert('google login err: ' + err);
    })
  }

  getNames(displayName) {
    let obj = { first_name: '', last_name: '' };
    if (!displayName.length || displayName == "") {
      return obj;
    }
    var names = displayName.split(" ");
    obj.first_name = names[0];
    for (let i = 0; i < names.length; i++) {
      if (names[i] != obj.first_name && names[i] != "" && names[i].length > 0) {
        obj.last_name = names[i];
        break;
      }
    }
    return obj;
  }

  googleOnBrowser() {
    try {
      console.log("In not cordova");
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        this.registerRequest.email = result.user.email;
        this.registerRequest.first_name = this.getNames(result.user.displayName).first_name;
        this.registerRequest.last_name = this.getNames(result.user.displayName).last_name;
        console.log(this.registerRequest);
        this.dismissLoading();
        this.translate.get('google_success_auth2').subscribe(value => {
          this.presentLoading(value);
        });
        // this.presentLoading('Firebase authenticated google signup, creating user..');
        this.checkUser();
        console.log(result);
      }).catch((error) => {
        console.log(error);
        this.dismissLoading();
      });
    } catch (err) {
      this.dismissLoading();
      console.log(err);
    }
  }

  fbOnPhone() {
    console.log("In cordova");
    this.facebook.login(["public_profile", 'email']).then(response => {
      this.dismissLoading();
      this.translate.get('fb_success_auth1').subscribe(value => {
        this.presentLoading(value);
      });
      // this.presentLoading('Facebook signup success, authenticating with firebase');
      console.log('Facebook signup success, authenticating with firebase');
      console.log("fb response are:--"+JSON.stringify(response));
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      console.log("fb response are:--"+JSON.stringify(facebookCredential));
      window.localStorage.setItem(Constants.USER_API_KEY, response.authResponse.accessToken);
      firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
      .then((success)=>{
        console.log("after firebase auth fb response are:--"+JSON.stringify(response));
        this.registerRequest.email = success.user.email;
        this.registerRequest.first_name = this.getNames(success.user.displayName).first_name;
        this.registerRequest.last_name = this.getNames(success.user.displayName).last_name;
        this.dismissLoading();
        this.translate.get('fb_success_auth2').subscribe(value => {
          this.presentLoading(value);
        });
        // this.presentLoading('Firebase authenticated Facebook login, creating user..');
        console.log('Firebase authenticated Facebook login, creating user..');
        this.checkUser();
      }).catch((error) => {
        console.log("Error in firebase auth after fb login"+JSON.stringify(error));
        this.showToast("Error in Facebook login");
        this.dismissLoading();
      });
    }).catch((error) => {
      console.log("Error in fb login"+JSON.stringify(error));
      this.showToast("Error in Facebook login");
      this.dismissLoading();
    });
  }

  fbOnBrowser() {
    console.log("In not cordova");
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    provider.addScope('user_friends');
    provider.addScope('email');
    provider.addScope('public_profile');
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        this.registerRequest.email = result.user.email;
        this.registerRequest.first_name = this.getNames(result.user.displayName).first_name;
        this.registerRequest.last_name = this.getNames(result.user.displayName).last_name;
        this.dismissLoading();
        this.presentLoading('Firebase authenticated Facebook login, creating user..');
        this.checkUser();
      }).catch((error) => {
        console.log(error);
        this.dismissLoading();
        this.showToast("Facebook login unsuccessfull");
      });
  }

  checkUser() {
    this.dismissLoading();
    const component = this;
    component.translate.get('check_token').subscribe(value => {
      component.presentLoading(value);
    });
    //component.presentLoading("Getting the user token");
    console.log("Getting the user token");
    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
      component.dismissLoading();
      component.translate.get('check_user').subscribe(value => {
        component.presentLoading(value);
      });
      // component.presentLoading("Checking the user");
      console.log("Checking the user");
      component.service.checkToken(window.localStorage.getItem(Constants.ADMIN_API_KEY), idToken)
      .subscribe(data => {
        console.log("User exist:---");
        console.log(JSON.stringify(data));
        // user exists
        let authResponse = data;
        window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
        component.dismissLoading();
        component.getUser(component.getUserIdFromToken(authResponse.token));
      }, err => {
        // if error code is 404, user not exists
        console.log("User not exist");
        component.dismissLoading();
        component.verifyPhone();
      });
    }).catch(function (error) {
      component.dismissLoading();
      console.log("error");
    });
  }

  verifyPhone() {
    let obj = JSON.parse(JSON.stringify(this.registerRequest));
    window.localStorage.setItem('userCreateData', JSON.stringify(obj));
    this.navCtrl.setRoot(PhonePage);
  }

  private getUser(userId: string) {
    this.translate.get('fetch_user').subscribe(value => {
      this.presentLoading(value);
    });
    let subscription: Subscription = this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId).subscribe(data => {
      this.dismissLoading();
      let userResponse: UserResponse = data;
      window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
      if (userResponse.billing && userResponse.billing.address_1 && userResponse.billing.address_1.length && userResponse.billing.address_2 && userResponse.billing.address_2.length) {
        userResponse.billing.id = -100;
        let addresses = new Array<Address>();
        addresses.push(userResponse.billing);
        window.localStorage.setItem(Constants.SELECTED_ADDRESS, JSON.stringify(userResponse.billing));
        window.localStorage.setItem(Constants.SELECTED_ADDRESS_LIST, JSON.stringify(addresses));
      }
      this.navCtrl.setRoot(HomePage);
      this.events.publish('user:login');
    }, err => {
      this.removeTempCart();
      this.dismissLoading();
      this.translate.get('login_error').subscribe(value => {
        this.presentLoading(value);
      });
      // this.presentErrorAlert("Unable to login with provided credentials");
    });
    this.subscriptions.push(subscription);
  }

  private getUserIdFromToken(token: string): string {
    let decodedString: string = window.atob(token.split(".")[1]);
    return JSON.parse(decodedString).data.user.id;
  }

  private presentLoading(message: string) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.onDidDismiss(() => { });

    this.loading.present();
    this.loadingShown = true;
  }

  private dismissLoading() {
    if (this.loadingShown) {
      this.loadingShown = false;
      this.loading.dismiss();
    }
  }

  private presentErrorAlert(msg: string) {
    this.translate.get(['error', 'dismiss'])
    .subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['error'],
        subTitle: msg,
        buttons: [text['dismiss']]
      });
      alert.present();
    })
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  signupPage() {
    this.removeTempCart();
    this.navCtrl.push(CreateaccountPage);
  }

  homePage() {
    this.navCtrl.setRoot(HomePage);
  }

  passwordPage() {
    this.navCtrl.push(PasswordPage);
  }

  removeTempCart() {
    window.localStorage.removeItem(Constants.TEMP_OPEN);
    window.localStorage.removeItem(Constants.TEMP_OPEN_CART);
    window.localStorage.removeItem(Constants.TEMP_OPEN_PRODUCT);
  }
}
