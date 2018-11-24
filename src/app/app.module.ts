import { PhonePage } from './../pages/phone/phone';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { APP_CONFIG, BaseAppConfig } from "./app.config";
import { OtpPage } from '../pages/otp/otp';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PasswordPage } from '../pages/password/password';
import { VerificationPage } from '../pages/verification/verification';
import { CreateaccountPage } from '../pages/createaccount/createaccount';
import { CategoryPage } from '../pages/category/category';
import { ShirtsPage } from '../pages/shirts/shirts';
import { ItemdetailPage } from '../pages/itemdetail/itemdetail';
import { ShippiningPage } from '../pages/shippining/shippining';
import { PaymentPage } from '../pages/payment/payment';
import { PlacedPage } from '../pages/placed/placed';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { My_accountPage } from '../pages/my_account/my_account';
import { Myorder_1Page } from '../pages/myorder_1/myorder_1';
import { Myorder_2Page } from '../pages/myorder_2/myorder_2';
import { HelpPage } from '../pages/help/help';
import { CartPage } from '../pages/cart/cart';
import { CodePage } from '../pages/code/code';
import { ReviewPage } from '../pages/review/review';
import { ShortPage } from '../pages/short/short';
import { AddressSelectPage } from '../pages/addressselect/addressselect';
import { SearchPage } from '../pages/search/search';
import { PhonenumberPage } from '../pages/phonenumber/phonenumber';
import { FilterPage } from '../pages/filter/filter';
import { LoginPage } from '../pages/login/login';
import { AddressPage } from '../pages/address/address';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MySplashPage } from '../pages/mysplash/mysplash';
import { Facebook } from '@ionic-native/facebook'
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { OneSignal } from '@ionic-native/onesignal';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Globalization } from '@ionic-native/globalization';
import { Device } from '@ionic-native/device';
import { PayPal } from '@ionic-native/paypal';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    PhonenumberPage,
    MyApp,
    HomePage,
    PasswordPage,
    VerificationPage,
    CreateaccountPage,
    CategoryPage,
    ShirtsPage,
    ItemdetailPage,
    ShippiningPage,
    PaymentPage,
    PlacedPage,
    WishlistPage,
    My_accountPage,
    CodePage,
    Myorder_1Page,
    Myorder_2Page,
    HelpPage,
    CartPage,
    ReviewPage,
    ShortPage,
    SearchPage,
    FilterPage,
    LoginPage,
    AddressPage,
    AddressSelectPage,
    MySplashPage, PhonePage, OtpPage
  ],
  imports: [
    IonicImageViewerModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PhonenumberPage,
    PhonePage, OtpPage,
    MyApp,
    HomePage,
    PasswordPage,
    VerificationPage,
    CreateaccountPage,
    CategoryPage,
    ShirtsPage,
    ItemdetailPage,
    ShippiningPage,
    PaymentPage,
    PlacedPage,
    WishlistPage,
    My_accountPage,
    CodePage,
    Myorder_1Page,
    Myorder_2Page,
    HelpPage,
    CartPage,
    ReviewPage,
    ShortPage,
    SearchPage,
    FilterPage,
    LoginPage,
    AddressPage,
    AddressSelectPage,
    MySplashPage
  ],
  providers: [
    Device,
    OneSignal,
    StatusBar,
    SplashScreen,
    PayPal,
    SocialSharing,
    InAppBrowser, Globalization,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Facebook, GooglePlus
  ]
})
export class AppModule { }
