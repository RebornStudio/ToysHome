import { PhonePage } from './../pages/phone/phone';
import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, AlertController, Events, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';

import firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import { CreateaccountPage } from '../pages/createaccount/createaccount';
import { LoginPage } from '../pages/login/login';
import { CategoryPage } from '../pages/category/category';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { My_accountPage } from '../pages/my_account/my_account';
import { Myorder_1Page } from '../pages/myorder_1/myorder_1';
import { Myorder_2Page } from '../pages/myorder_2/myorder_2';
import { AddressSelectPage } from '../pages/addressselect/addressselect';
import { HelpPage } from '../pages/help/help';
import { CartPage } from '../pages/cart/cart';
import { ReviewPage } from '../pages/review/review';

import { WordpressClient } from '../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { AuthResponse } from "../models/auth-response.models";
import { AuthCredential } from "../models/auth-credential.models";
import { Constants } from "../models/constants.models";
import { Category } from "../models/category.models";
import { PaymentGateway } from "../models/payment-gateway.models";
import { ShippingLine } from "../models/shipping-line.models";
import { UserResponse } from "../models/user-response.models";
import { Currency } from "../models/currency.models";
import { RegisterRequest } from "../models/register-request.models";
import { APP_CONFIG, AppConfig } from "./app.config";
import { MySplashPage } from '../pages/mysplash/mysplash';
import { Globalization } from '@ionic-native/globalization';
import { TranslateService } from '../../node_modules/@ngx-translate/core';
import { Device } from '@ionic-native/device';

@Component({
  templateUrl: 'app.html',
  providers: [WordpressClient]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private subscriptions: Array<Subscription> = [];

  rootPage: any = MySplashPage;
  pages: Array<{ title: string, component: any }>;
  pageCategory: number = 1;
  categoriesAll = new Array<Category>();
  user: UserResponse;
  rtlSide: string = "left"
  constructor(@Inject(APP_CONFIG) private config: AppConfig,
    private globalization: Globalization, private device: Device,
    public translate: TranslateService, private modalCtrl: ModalController,
    private events: Events, private alertCtrl: AlertController,
    private service: WordpressClient, public platform: Platform,
    public statusBar: StatusBar, public splashScreen: SplashScreen,
    private oneSignal: OneSignal) {
    let superAuth = "";
    // window.localStorage.clear();
    // window.localStorage.removeItem(Constants.USER_KEY);
    if (config.apiBase && config.apiBase.startsWith('https') && config.consumerKey && config.consumerKey.length && config.consumerSecret && config.consumerSecret.length) {
      superAuth = ("Basic " + btoa(config.consumerKey + ":" + config.consumerSecret));
      window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
      this.onSuperAuthSetup(superAuth);
    } else if (config.apiBase && config.apiBase.startsWith('http:') && config.adminUsername && config.adminUsername.length && config.adminPassword && config.adminPassword.length) {
      let subscription: Subscription = service.getAuthToken(new AuthCredential(config.adminUsername, config.adminPassword)).subscribe(data => {
        let authResponse: AuthResponse = data;
        superAuth = ("Bearer " + authResponse.token);
        window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
        this.onSuperAuthSetup(superAuth);
      }, err => {
        console.log('auth setup error');
      });
      this.subscriptions.push(subscription);
    } else {
      console.log('auth setup error');
    }

    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));

    this.initializeApp();
    this.listenToLoginEvents();
  }

  onSuperAuthSetup(superAuth) {
    console.log('auth setup success: ' + superAuth);
    this.loadCurrency();
    this.loadParentCategories();
    this.loadPaymentGateways();
    //this.loadShippingLines();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    });
  }

  loadCurrency() {
    let savedCurrency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (!savedCurrency) {
      let subscription: Subscription = this.service.currencies(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
        let currency: Currency = data;
        window.localStorage.setItem(Constants.CURRENCY, JSON.stringify(currency));
        console.log('currency setup success');
      }, err => {
        console.log('currency setup error');
      });
      this.subscriptions.push(subscription);
    }
  }

  loadShippingLines() {
    let subscription: Subscription = this.service.shippingLines(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      let shippingLines: Array<ShippingLine> = data;
      window.localStorage.setItem(Constants.SHIPPING_LINES, JSON.stringify(shippingLines));
      console.log('shippingLines setup success');
    }, err => {
      console.log('categories setup error');
    });
    this.subscriptions.push(subscription);
  }

  loadPaymentGateways() {
    let subscription: Subscription = this.service.paymentGateways(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      let paymentGateway: Array<PaymentGateway> = data;
      window.localStorage.setItem(Constants.PAYMENT_GATEWAYS, JSON.stringify(paymentGateway));
      console.log('payment-gateway setup success');
    }, err => {
      console.log('categories setup error');
    });
    this.subscriptions.push(subscription);
  }

  loadParentCategories() {
    let subscription: Subscription = this.service.categoriesParent(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      let categories: Array<Category> = data;
      window.localStorage.setItem(Constants.PRODUCT_CATEGORIES_PARENT, JSON.stringify(categories));
      console.log('categories setup success');
      this.events.publish('category:setup');
    }, err => {
      console.log('categories setup error');
    });
    this.subscriptions.push(subscription);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      firebase.initializeApp({
        apiKey: this.config.firebaseConfig.apiKey,
        authDomain: this.config.firebaseConfig.authDomain,
        databaseURL: this.config.firebaseConfig.databaseURL,
        projectId: this.config.firebaseConfig.projectId,
        storageBucket: this.config.firebaseConfig.storageBucket,
        messagingSenderId: this.config.firebaseConfig.messagingSenderId
      });
      if (this.platform.is('cordova')) {
        this.initOneSignal();
      }
      this.globalize();
    });
  }

  globalize() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
    console.log("globalaizing...");
    if (this.platform.is('cordova')) {
      this.initOneSignal();
      console.log("cordova detected");
      this.globalization.getPreferredLanguage().then(result => {
        console.log("language detected:----" + JSON.stringify(result));
        let suitableLang = this.getSuitableLanguage(result.value);
        console.log(suitableLang);
        this.translate.use(suitableLang);
        this.setDirectionAccordingly(suitableLang);
      }).catch(e => {
        console.log(e);
        this.translate.use('en');
        this.setDirectionAccordingly('en');
      });
    } else {
      console.log("cordova not detected");
      this.translate.use('en');
      this.setDirectionAccordingly('en');
    }
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'ar': {
        this.platform.setDir('ltr', false);
        this.platform.setDir('rtl', true);
        this.rtlSide = "right";
        break;
      }
      default: {
        this.platform.setDir('rtl', false);
        this.platform.setDir('ltr', true);
        this.rtlSide = "left";
        break;
      }
    }
  }

  getSideOfCurLang() {
    this.rtlSide = this.platform.dir() === 'rtl' ? "right" : "left";
    return this.rtlSide;
  }

  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    console.log('check for: ' + language);
    return this.config.availableLanguages.some(x => x.code == language) ? language : 'en';
  }

  initOneSignal() {
    if (this.config.oneSignalAppId && this.config.oneSignalAppId.length && this.config.oneSignalGPSenderId && this.config.oneSignalGPSenderId.length) {
      this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationReceived().subscribe((data) => {
        // do something when notification is received
        console.log(data);
      });
      this.oneSignal.handleNotificationOpened().subscribe((data) => {
        if (data.notification.payload
          && data.notification.payload.additionalData) {
          this.myorder_1Page();
        }
      });
      this.oneSignal.endInit();

      this.oneSignal.getIds().then((id) => {
        if (id.userId) {
          window.localStorage.setItem(Constants.ONESIGNAL_PLAYER_ID, id.userId.toString());
        }
      });
    }
  }

  addressPage() {
    this.nav.setRoot(AddressSelectPage);
  }

  myorder_1Page() {
    this.nav.setRoot(Myorder_2Page);
  }

  myorder_2Page() {
    this.nav.setRoot(Myorder_2Page);
  }

  my_accountPage() {
    this.nav.setRoot(My_accountPage);
  }

  categoryPage() {
    this.nav.setRoot(CategoryPage);
  }

  homePage() {
    this.nav.setRoot(HomePage);
  }

  reviewPage() {
    this.nav.setRoot(ReviewPage);
  }

  wishlistPage() {
    this.nav.setRoot(WishlistPage);
  }

  cartPage() {
    this.nav.setRoot(CartPage);
  }

  helpPage() {
    this.nav.setRoot(HelpPage);
  }

  categoriesPage() {
    this.nav.setRoot(CategoryPage);
  }

  actionNavHeader() {
    if (this.user) {
      this.nav.setRoot(My_accountPage);
    } else {
      this.nav.push(LoginPage);
    }
  }

  phonenumberPage() {
    this.translate.get(['logout', 'logout_message','no','yes']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['logout'],
        message: text['logout_message'],
        buttons: [{
          text: text['no'],
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: text['yes'],
          handler: () => {
            this.user = null;
            window.localStorage.setItem(Constants.USER_KEY, null);
            this.homePage();
          }
        }]
      });
      alert.present();
    })
  }
}
