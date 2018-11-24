import { Component } from '@angular/core';
import { NavController, ViewController, ToastController, App } from 'ionic-angular';
import { Global } from '../../providers/global';
import { CartItem } from "../../models/cart-item.models";
import { ShippiningPage } from '../shippining/shippining';
import { UserResponse } from '../../models/user-response.models';
import { Constants } from '../../models/constants.models';
import { LoginPage } from '../login/login';
import { Currency } from '../../models/currency.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
	selector: 'page-cart ',
	templateUrl: 'cart.html',
	providers: [Global]
})

export class CartPage {
	private cartItems = new Array<CartItem>();
	private total: number = 0;
	private checkoutText = 'Proceed to checkout';
	private currencyIcon: string;
	private currencyText: string;
	private total_html: string;


	constructor(public translate: TranslateService,private global: Global, public navCtrl: NavController, public viewCtrl: ViewController, private toastCtrl: ToastController, public appCtrl: App) {
		let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
		if (currency) {
			this.currencyText = currency.value;
			let iconText = currency.options[currency.value];
			this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
		}
		let cartItems: Array<CartItem> = global.getCartItems();
		if (cartItems != null) {
			this.cartItems = this.cartItems.concat(cartItems);
		}
		this.calculateTotal();
	}

	removeItem(product) {
		this.global.removeCartItem(product);
		this.cartItems = this.global.getCartItems();
		this.calculateTotal();
	}

	decrementItem(product) {
		let decremented: boolean = this.global.decrementCartItem(product);
		if (!decremented) {
			this.cartItems = this.global.getCartItems();
			this.calculateTotal();
		} else {
			this.total = this.total - Number(product.sale_price);
			this.setPriceHtml();
		}
		// this.showToast(decremented ? 'Item updated' : 'Item removed');
    this.translate.get(decremented ? 'Item updated' : 'Item removed').subscribe(value => {
      this.showToast(value);
    });
	}

	incrementItem(product) {
		let incremented: boolean = this.global.incrementCartItem(product);
		if (incremented) {
			this.total = this.total + Number(product.sale_price);
			this.setPriceHtml();
		}
    this.translate.get(incremented ? 'Item updated' : 'Item max limit reached').subscribe(value => {
      this.showToast(value);
    });
		// this.showToast(incremented ? 'Item updated' : 'Item max limit reached');
	}

	calculateTotal() {
		let sum: number = 0;
		for (let item of this.cartItems) {
			sum = sum + Number(item.product.sale_price) * item.quantity;
		}
		this.total = sum;
		if (!this.cartItems || !this.cartItems.length) {
			this.checkoutText = 'Cart is empty';
		}
		this.setPriceHtml();
	}

	setPriceHtml() {
		if (this.currencyIcon) {
			this.total_html = this.currencyIcon + ' ' + this.total;
		} else if (this.currencyText) {
			this.total_html = this.currencyText + ' ' + this.total;
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

	proceedCheckout() {
		if (this.cartItems != null && this.cartItems.length > 0) {
			let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
			if (user != null) {
				this.viewCtrl.dismiss();
				this.appCtrl.getRootNav().push(ShippiningPage);
			} else {
				window.localStorage.setItem(Constants.TEMP_OPEN, Constants.TEMP_OPEN_CART);
				this.translate.get("no_sign_in").subscribe(value => {
          this.showToast(value);
        });
        // this.showToast('Sign in to continue');
				this.viewCtrl.dismiss();
				this.appCtrl.getRootNav().push(LoginPage);
			}
		}
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}
}
