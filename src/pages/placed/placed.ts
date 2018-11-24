import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { HomePage } from '../home/home';
import { Myorder_2Page } from '../myorder_2/myorder_2';

@Component({
	selector: 'page-placed ',
	templateUrl: 'placed.html'
})
export class PlacedPage {

	constructor(public navCtrl: NavController, platform: Platform) {
		platform.registerBackButtonAction(function (event) {
			event.preventDefault();
		}, 100);
	}

	ordersPage() {
		this.homePage();
		this.navCtrl.push(Myorder_2Page);
	}

	homePage() {
		this.navCtrl.setRoot(HomePage);
	}

}
