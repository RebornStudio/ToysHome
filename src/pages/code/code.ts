import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { Constants } from '../../models/constants.models';
import { Coupon } from '../../models/coupon.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
	selector: 'page-code ',
	templateUrl: 'code.html',
	providers: [WordpressClient]
})
export class CodePage {
	private cCode = "";
	private loading: Loading;
	private loadingShown: Boolean = false;
	private subscriptions: Array<Subscription> = [];

	constructor(public translate: TranslateService,private service: WordpressClient, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private navParams: NavParams, public viewCtrl: ViewController) {
	}

	checkCode() {
		if (!this.cCode.length) {
      this.translate.get('field_error_couponcode').subscribe(value => {
        this.showToast(value);
      });
			// this.showToast('Enter valid coupon code.');
		} else {
      this.translate.get('Just a moment').subscribe(value => {
        this.presentLoading(value);
      });
			// this.presentLoading('Just a moment');
			let subscription: Subscription = this.service.getCouponByCode(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.cCode).subscribe(data => {
				this.dismissLoading();
				let coupons: Array<Coupon> = data;
				if (!coupons.length) {
					this.translate.get('field_error_invalid_couponcode').subscribe(value => {
            this.showToast(value);
          });
          // this.showToast('Invalid coupon code');
				} else {
					let coupon = coupons[0];
					if (new Date(coupon.date_expires) > new Date()) {
						window.localStorage.setItem(Constants.SELECTED_COUPON, JSON.stringify(coupons[0]));
					} else {
						window.localStorage.removeItem(Constants.SELECTED_COUPON);
						this.translate.get('cpn_expire').subscribe(value => {
              this.showToast(value);
            });
            // this.showToast('Coupon expired');
					}
					this.dismiss();
				}
			}, err => {
				this.dismissLoading();
				this.translate.get('field_error_invalid_couponcode').subscribe(value => {
          this.showToast(value);
        });
			});
			this.subscriptions.push(subscription);
		}
	}

	dismiss() {
		this.viewCtrl.dismiss();
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
