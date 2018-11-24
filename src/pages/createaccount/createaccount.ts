import { Component, Inject } from '@angular/core';
import { NavController, ModalController, AlertController, Loading, LoadingController, ToastController, Events } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { AuthResponse } from "../../models/auth-response.models";
import { RegisterRequest } from "../../models/register-request.models";
import { RegisterResponse } from "../../models/register-response.models";
import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";
import { AuthCredential } from "../../models/auth-credential.models";
import { OtpPage } from "../../pages/otp/otp";
import { AppConfig, APP_CONFIG } from '../../app/app.config';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
	selector: 'page-createaccount',
	templateUrl: 'createaccount.html',
	providers: [WordpressClient]
})

export class CreateaccountPage {
	private loading: Loading;
	private loadingShown: Boolean = false;
	private authError = "";
	private subscriptions: Array<Subscription> = [];
	// private registerRequest: RegisterRequest = new RegisterRequest('prince@gmail.com', '8285724681', '123456');
	private registerRequest: RegisterRequest = new RegisterRequest('', '', '', '', '');
	private registerRequestPasswordConfirm: string = '';
	private registerResponse: RegisterResponse;
	buttonDisabled: Boolean = true;
	countries: any;
	countryCode: string = '';

	constructor(@Inject(APP_CONFIG) public config: AppConfig, private events: Events, private toastCtrl: ToastController,
		public navCtrl: NavController, private service: WordpressClient,
		private loadingCtrl: LoadingController, private alertCtrl: AlertController,
		public modalCtrl: ModalController,public translate:TranslateService ) {

	}

	ionViewDidLoad() {
		this.getCountries();
	}

	checkNumber() {
		if (!this.countryCode || this.countryCode == '') {
			this.buttonDisabled = true;
			this.translate.get('field_error_country').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast("Please select your country first");
			this.registerRequest.username = '';
			return
		}
		let phone = JSON.parse(JSON.stringify(this.registerRequest.username));
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
		} else if (phone.length == 10 && phone != '' && !isNaN(phone)) {
			this.buttonDisabled = false;
		} else {
			this.buttonDisabled = true;
		}
		this.registerRequest.username = phone;
	}

	getCountries() {
		this.service.getCountries().subscribe(data => {
			console.log("Countries fetched");
			this.countries = data;
			// console.log(data);
		}, err => {
			console.log(err);
		})
	}

	register() {
		this.authError = "";
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (this.registerRequest.first_name == "" || !this.registerRequest.first_name.length) {
			this.translate.get('field_error_name_first').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Please enter your first name');
		} else if (this.registerRequest.last_name == "" || !this.registerRequest.last_name.length) {
			this.translate.get('field_error_name_last').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Please enter your last name');
		} else if (this.registerRequest.username.length < 10) {
			this.translate.get('field_error_phone_valid').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter valid phone');
		} else if (this.registerRequest.email.length <= 5 || !reg.test(this.registerRequest.email)) {
			this.translate.get('field_error_email').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter valid email address');
		} else if (this.registerRequest.password.length == 0 || !(this.registerRequest.password === this.registerRequestPasswordConfirm)) {
			this.translate.get('field_error_password').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter valid passwords, twice.');
		} else {
			this.translate.get('loading_sign_up').subscribe(value => {
        this.presentLoading(value);
      });
      // this.presentLoading('Registering user');
			let subscription: Subscription = this.service.createUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.registerRequest)
				.subscribe(data => {
					this.dismissLoading();
					this.registerResponse = data;
          this.translate.get('signup_success').subscribe(value => {
            this.showToast(value);
          });
					// this.showToast('Registration success.');
					this.verifyPhone();
					// Now we are veryfying the mobile no. first.
					// let registerResponse: RegisterResponse = data;
					// this.signIn(String(registerResponse.id), this.registerRequest.username, this.registerRequest.password);
				}, err => {
					this.authError = err.error.message;
					let pos = this.authError.indexOf('<a');
					if (pos != -1) {
						this.authError = this.authError.substr(0, pos) + '<a target="_blank" ' + this.authError.substr(pos + 2, this.authError.length - 1);
					}
					this.dismissLoading();
					//this.presentErrorAlert("Unable to register with provided credentials");
				});
			this.subscriptions.push(subscription);
		}
	}

	verifyPhone() {
		let obj = JSON.parse(JSON.stringify(this.registerRequest));
		window.localStorage.setItem('userCreateData', JSON.stringify(obj));
		this.navCtrl.setRoot(OtpPage, { userId: this.registerResponse.id, dialCode: this.countryCode });
	}

	private signIn(userId: string, username: string, password: string) {
		let credentials: AuthCredential = new AuthCredential(username, password);
		let subscription: Subscription = this.service.getAuthToken(credentials)
			.subscribe(data => {
				let authResponse: AuthResponse = data;
				window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
				this.getUser(userId);
			}, err => {
				this.dismissLoading();
        this.translate.get('login_error').subscribe(value => {
          this.presentErrorAlert(value);
        });
				// this.presentErrorAlert("Unable to login with provided credentials");
			});
		this.subscriptions.push(subscription);
	}

	private getUser(userId: string) {
		let subscription: Subscription = this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId).subscribe(data => {
			this.dismissLoading();
			let userResponse: UserResponse = data;
			window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
			this.navCtrl.setRoot(HomePage);
			this.events.publish('user:login');
		}, err => {
			this.dismissLoading();
			this.translate.get('login_error').subscribe(value => {
        this.presentErrorAlert(value);
      });
		});
		this.subscriptions.push(subscription);
	}

	signinPage() {
		this.navCtrl.pop();
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
    this.translate.get(['error', 'dismiss']).subscribe(text => {
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
}
