webpackJsonp([0],{

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.ADMIN_API_KEY = 'AdminApiKey';
    Constants.USER_API_KEY = 'UserApiKey';
    Constants.USER_KEY = 'UserKey';
    Constants.PRODUCT_CATEGORIES = 'ProductCategories';
    Constants.PRODUCT_CATEGORIES_PARENT = 'ProductCategoriesParent';
    Constants.PAYMENT_GATEWAYS = 'PaymentGateways';
    Constants.SHIPPING_LINES = 'ShippingLines';
    Constants.SELECTED_ADDRESS = 'SelectedAddress';
    Constants.SELECTED_COUPON = 'SelectedCoupon';
    Constants.SELECTED_ADDRESS_LIST = 'AddressList';
    Constants.TEMP_OPEN = 'TempOpen';
    Constants.TEMP_OPEN_CART = 'TempOpenCart';
    Constants.TEMP_OPEN_PRODUCT = 'TempOpenProduct';
    Constants.CURRENCY = 'Currency';
    Constants.ONESIGNAL_PLAYER_ID = 'OneSignalPlayerID';
    Constants.ONESIGNAL_PLAYER_ID_REGISTERED = 'OneSignalPlayerIDRegistered';
    return Constants;
}());

//# sourceMappingURL=constants.models.js.map

/***/ }),

/***/ 142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OtpPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__home_home__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_register_request_models__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_auth_credential_models__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var OtpPage = /** @class */ (function () {
    function OtpPage(params, alertCtrl, loadingCtrl, toastCtrl, navCtrl, firebase, platform, service, events, translate) {
        this.params = params;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.firebase = firebase;
        this.platform = platform;
        this.service = service;
        this.events = events;
        this.translate = translate;
        this.loadingShown = false;
        this.captchanotvarified = true;
        this.buttonDisabled = true;
        this.otp = '';
        this.captchaVerified = false;
        this.minutes = 0;
        this.seconds = 0;
        this.totalSeconds = 0;
        this.intervalCalled = false;
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_7__models_register_request_models__["a" /* RegisterRequest */]('', '', '', '', '');
        this.subscriptions = [];
        this.resendCode = false;
        this.otpNotSent = true;
        console.log('UserId is  ', params.get('userId'));
        console.log('Dial Code code is  ', params.get('dialCode'));
        // this.platform.registerBackButtonAction(() => {
        //   this.makeExitAlert();
        //   //sometimes the best thing you can do is not think, not wonder, not imagine, not obsess. 
        //   //just breathe, and have faith that everything will work out for the best.
        // },1);
    }
    OtpPage.prototype.ionViewDidLoad = function () {
        this.dialCode = this.params.get('dialCode');
        this.registerRequest = JSON.parse(window.localStorage.getItem('userCreateData'));
        console.log("Previous data is:--", JSON.stringify(this.registerRequest));
        if (!(this.platform.is('cordova'))) {
            this.makeCaptcha();
        }
        console.log("Country code is ", this.dialCode);
        console.log("Phone no. is " + this.registerRequest.username);
        this.sendOTP();
    };
    OtpPage.prototype.sendOTP = function () {
        this.resendCode = false;
        this.otpNotSent = true;
        var phoneNumberString = "+" + this.dialCode + this.registerRequest.username;
        console.log("phone no. is " + this.registerRequest.username);
        if (this.platform.is('cordova')) {
            this.sendOtpPhone(phoneNumberString);
        }
        else {
            this.sendOtpBrowser(phoneNumberString);
        }
        if (this.intervalCalled) {
            clearInterval(this.timer);
        }
    };
    OtpPage.prototype.createTimer = function () {
        this.intervalCalled = true;
        this.totalSeconds--;
        if (this.totalSeconds == 0) {
            this.otpNotSent = true;
            this.resendCode = true;
            clearInterval(this.timer);
        }
        else {
            this.seconds = (this.totalSeconds % 60);
            if (this.totalSeconds >= this.seconds) {
                this.minutes = (this.totalSeconds - this.seconds) / 60;
            }
            else {
                this.minutes = 0;
            }
        }
    };
    OtpPage.prototype.createInterval = function () {
        var _this = this;
        this.totalSeconds = 120;
        this.createTimer();
        this.timer = setInterval(function () {
            _this.createTimer();
        }, 1000);
    };
    OtpPage.prototype.sendOtpPhone = function (phone) {
        var _this = this;
        this.translate.get('sending_otp').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading("Sending OTP by SMS");
        console.log("In cordova");
        this.firebase.verifyPhoneNumber(phone, 60)
            .then(function (credential) {
            console.log("credentials:-----");
            console.log(JSON.stringify(credential));
            _this.verfificationId = credential.verificationId;
            _this.translate.get('otp_sent').subscribe(function (value) {
                _this.showToast(value);
            });
            _this.otpNotSent = false;
            _this.dismissLoading();
            _this.createInterval();
        }).catch(function (error) {
            _this.otpNotSent = true;
            _this.resendCode = true;
            _this.dismissLoading();
            if (error.message) {
                _this.showToast(error.message);
            }
            else {
                _this.translate.get('otp_err').subscribe(function (value) {
                    _this.showToast(value);
                });
            }
        });
    };
    OtpPage.prototype.sendOtpBrowser = function (phone) {
        this.dismissLoading();
        var component = this;
        component.translate.get('sending_otp').subscribe(function (value) {
            component.presentLoading(value);
        });
        // component.presentLoading("Sending OTP by SMS");
        console.log("In not cordova");
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth().signInWithPhoneNumber(phone, this.recaptchaVerifier)
            .then(function (confirmationResult) {
            component.otpNotSent = false;
            component.result = confirmationResult;
            component.dismissLoading();
            component.translate.get('otp_sent').subscribe(function (value) {
                component.showToast(value);
            });
            // component.showToast("OTP sent on your mobile");
            if (component.intervalCalled) {
                clearInterval(component.timer);
            }
            component.createInterval();
        })
            .catch(function (error) {
            component.resendCode = true;
            component.dismissLoading();
            if (error.message) {
                component.showToast(error.message);
            }
            else {
                component.translate.get('otp_err').subscribe(function (value) {
                    component.presentLoading(value);
                });
                // component.showToast("SMS not sent");
            }
            console.log("SMS not sent " + JSON.stringify(error));
        });
    };
    OtpPage.prototype.verify = function () {
        this.otpNotSent = true;
        if (this.platform.is('cordova')) {
            this.verifyOtpPhone();
        }
        else {
            this.verifyOtpBrowser();
        }
    };
    OtpPage.prototype.verifyOtpPhone = function () {
        var _this = this;
        console.log("Verifying phone in cordova");
        var credential = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth.PhoneAuthProvider.credential(this.verfificationId, this.otp);
        console.log("Fetched the credential");
        this.translate.get('verifying_otp').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading("Verifying OTP by SMS");
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth().signInAndRetrieveDataWithCredential(credential)
            .then(function (info) {
            console.log(JSON.stringify(info));
            _this.dismissLoading();
            _this.translate.get('otp_success').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast("OTP verified");
            _this.signIn();
        }, function (error) {
            if (error.message) {
                _this.showToast(error.message);
            }
            else {
                _this.translate.get('otp_err').subscribe(function (value) {
                    _this.showToast(value);
                });
                // this.showToast("Wrong OTP");
            }
            _this.dismissLoading();
            console.log(JSON.stringify(error));
        });
    };
    OtpPage.prototype.verifyOtpBrowser = function () {
        var component = this;
        console.log("Confimation result:---" + JSON.stringify(component.result));
        // component.presentLoading("Verifying OTP by SMS");
        component.translate.get('verifying_otp').subscribe(function (value) {
            component.presentLoading(value);
        });
        component.result.confirm(this.otp)
            .then(function (response) {
            component.dismissLoading();
            component.translate.get('otp_success').subscribe(function (value) {
                component.showToast(value);
            });
            // component.showToast("OTP verified");
            component.signIn();
        }).catch(function (error) {
            if (error.message) {
                component.showToast(error.message);
            }
            else {
                component.translate.get('otp_err').subscribe(function (value) {
                    component.showToast(value);
                });
                // component.showToast("Wrong OTP");
            }
            component.dismissLoading();
        });
    };
    OtpPage.prototype.makeCaptcha = function () {
        var component = this;
        this.recaptchaVerifier = new __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth.RecaptchaVerifier('recaptcha-container', {
            // 'size': 'normal',
            'size': 'invisible',
            'callback': function (response) {
                component.captchanotvarified = true;
                console.log("captchanotvarified:--" + component.captchanotvarified);
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        this.recaptchaVerifier.render();
    };
    OtpPage.prototype.signIn = function () {
        var _this = this;
        console.log("User id ", this.params.get("userId"));
        console.log("username is ", this.registerRequest.username);
        console.log("Password is ", this.registerRequest.password);
        this.translate.get('wait').subscribe(function (value) {
            _this.presentLoading(value);
        });
        var credentials = new __WEBPACK_IMPORTED_MODULE_8__models_auth_credential_models__["a" /* AuthCredential */](this.registerRequest.username, this.registerRequest.password);
        var subscription = this.service.getAuthToken(credentials)
            .subscribe(function (data) {
            var authResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
            _this.getUser(_this.params.get("userId"));
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.presentErrorAlert(value);
            });
        });
        this.subscriptions.push(subscription);
    };
    OtpPage.prototype.getUser = function (userId) {
        var _this = this;
        var subscription = this.service.getUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), userId)
            .subscribe(function (data) {
            _this.dismissLoading();
            var userResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(userResponse));
            window.localStorage.removeItem("userCreateData");
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__home_home__["a" /* HomePage */]);
            _this.events.publish('user:login');
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.presentErrorAlert(value);
            });
        });
        this.subscriptions.push(subscription);
    };
    OtpPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    OtpPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    OtpPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    OtpPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    OtpPage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Application exit prevented!');
                    }
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    OtpPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-otp ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\otp\otp.html"*/'<ion-header>\n\n  <ion-navbar>\n\n      <ion-title text-center>{{\'verification\' | translate}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div class="form" padding-left padding-right>\n\n    <div id="recaptcha-container"></div>\n\n    <p text-center>{{\'otp_text\' | translate}} <br/>{{\'sent\' | translate }} +{{dialCode}} {{registerRequest.username}}</p>\n\n    <ion-list>\n\n      <ion-item>\n\n        <ion-label>{{\'otp\' | translate}}</ion-label>\n\n        <ion-input type="text" text-right placeholder="{{\'enter_otp\' | translate}}" [(ngModel)]="otp"></ion-input>\n\n      </ion-item>\n\n    </ion-list>\n\n    <button ion-button full class="bg-thime btn-round btn-text"  (click)="verify()" [disabled]="otpNotSent || otp==\'\'">\n\n      {{\'verify\' | translate}}       \n\n    </button>\n\n    <ion-item no-lines no-margin no-padding>\n\n      <button ion-button (click)="sendOTP()" clear  item-start (click)="sendOTP()" [disabled]="!resendCode"> {{\'resend\' | translate}} </button>\n\n      <ion-note item-end>\n\n        <ng-container *ngIf="minutes==0; else minuteTemplate">\n\n          00\n\n        </ng-container>\n\n        <ng-template #minuteTemplate>\n\n          {{minutes}}\n\n        </ng-template>:\n\n        <ng-container *ngIf="seconds==0; else secondTemplate">\n\n          00\n\n        </ng-container>\n\n        <ng-template #secondTemplate>\n\n          {{seconds}}\n\n        </ng-template> {{\'min_left\' | translate}}</ion-note>\n\n    </ion-item>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\otp\otp.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_0__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["v" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_0__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* Events */], __WEBPACK_IMPORTED_MODULE_9__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], OtpPage);
    return OtpPage;
}());

//# sourceMappingURL=otp.js.map

/***/ }),

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Myorder_2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_order_update_request_models__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__itemdetail_itemdetail__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var Myorder_2Page = /** @class */ (function () {
    function Myorder_2Page(translate, modalCtrl, toastCtrl, navCtrl, service, loadingCtrl, alertCtrl) {
        var _this = this;
        this.translate = translate;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingShown = false;
        this.subscriptions = [];
        this.orders = new Array();
        this.pageNo = 1;
        this.currencyIcon = '';
        this.currencyText = '';
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].USER_KEY));
        this.loadMyOrders();
        this.translate.get('loading_orders').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('loading orders');
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
        }
    }
    Myorder_2Page.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    Myorder_2Page.prototype.loadMyOrders = function () {
        var _this = this;
        var subscription = this.service.myOrders(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var order = data_1[_i];
                for (var _a = 0, _b = order.line_items; _a < _b.length; _a++) {
                    var line = _b[_a];
                    line.price_html = _this.currencyIcon + ' ' + line.price;
                }
            }
            _this.dismissLoading();
            _this.orders = data;
        }, function (err) {
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    Myorder_2Page.prototype.itemdetailPage = function (item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__itemdetail_itemdetail__["a" /* ItemdetailPage */], { pro_id: item.product_id });
    };
    Myorder_2Page.prototype.cancelOrder = function (order) {
        var _this = this;
        this.translate.get('cancelling_orders').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Cancelling order');
        var subscription = this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(order.id), new __WEBPACK_IMPORTED_MODULE_4__models_order_update_request_models__["a" /* OrderUpdateRequest */]('cancelled')).subscribe(function (data) {
            var orderRes = data;
            order.status = 'cancelled';
            /* for(let o of this.orders) {
                console.log(String(o.id) == String(orderRes.id));
                if(o.id == orderRes.id) {
                    o = orderRes;
                    console.log('here');
                    this.orders = this.orders;
                    break;
                }
            } */
            _this.dismissLoading();
            // this.showToast('Order cancelled');
            _this.translate.get('order_cancelled').subscribe(function (value) {
                _this.showToast(value);
            });
        }, function (err) {
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    Myorder_2Page.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.pageNo++;
        var subscription = this.service.myOrders(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(function (data) {
            var orders = data;
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var order = data_2[_i];
                for (var _a = 0, _b = order.line_items; _a < _b.length; _a++) {
                    var line = _b[_a];
                    line.price_html = _this.currencyIcon + ' ' + line.price;
                }
            }
            infiniteScroll.complete();
        }, function (err) {
            infiniteScroll.complete();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    Myorder_2Page.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    Myorder_2Page.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    Myorder_2Page.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    Myorder_2Page.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    Myorder_2Page.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_6__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    Myorder_2Page.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    Myorder_2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-myorder_2 ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\myorder_2\myorder_2.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon class="menu-icon"><img src="assets/imgs/ic_menu.png"></ion-icon>\n\n        </button>\n\n        <ion-title>{{"my_orders" | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <div class="empty_placeholder" *ngIf="!loadingShown && (!orders || !orders.length)">\n\n        <img src="assets/imgs/no_orders.png">\n\n        <p>{{"empty_orders" | translate}}</p>\n\n    </div>\n\n    <ion-list>\n\n        <ion-card *ngFor="let order of orders">\n\n            <ion-card-content>\n\n                <ion-row *ngFor="let item of order.line_items">\n\n                    <ion-col>\n\n                        <h4 (click)="itemdetailPage(item)">{{item.name}}</h4>\n\n                        <div class="card-btn" float-right>\n\n                            <small *ngIf="order.status == \'on-hold\' || order.status == \'pending\'|| order.status == \'processing\'"\n\n                                class="text-sky" (click)="cancelOrder(order)">{{"cancel_order" | translate}}</small>\n\n                            <small class="text-green">{{order.status}}</small>\n\n                        </div>\n\n                        <div class="rate">\n\n                            <p class=text-light>{{"order_on" | translate}} {{order.date_created}}</p>\n\n                            <div style="display: flex;" class="price">\n\n                                <!-- <div class="price text-light mr-5">\n\n                                <img src="assets/imgs/rupee-light.png" class="rupee-icon">{{item.price}}\n\n                            </div> -->\n\n                                <div class="price text-sky" [innerHTML]="item.price_html">\n\n                                    <!-- <img src="assets/imgs/rupee-sky.png" class="rupee-icon">0 -->\n\n                                </div>\n\n                            </div>\n\n                        </div>\n\n                    </ion-col>\n\n                </ion-row>\n\n\n\n            </ion-card-content>\n\n        </ion-card>\n\n    </ion-list>\n\n    <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n        <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n    </ion-infinite-scroll>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\myorder_2\myorder_2.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], Myorder_2Page);
    return Myorder_2Page;
}());

//# sourceMappingURL=myorder_2.js.map

/***/ }),

/***/ 151:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_address_models__ = __webpack_require__(372);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AddressPage = /** @class */ (function () {
    function AddressPage(translate, navCtrl, navParams, modalCtrl, viewCtrl, toastCtrl) {
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.viewCtrl = viewCtrl;
        this.toastCtrl = toastCtrl;
        this.address = new __WEBPACK_IMPORTED_MODULE_3__models_address_models__["a" /* Address */]();
        var address = this.navParams.get('address');
        if (address != null) {
            this.address = address;
        }
        else {
            var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY));
            this.address.id = -1;
            if (user != null) {
                this.address.first_name = user.first_name;
                this.address.last_name = user.last_name;
                this.address.email = user.email;
                this.address.phone = user.username;
            }
        }
        this.addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST));
    }
    AddressPage.prototype.saveAddress = function () {
        var _this = this;
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!this.address.first_name || !this.address.first_name.length) {
            this.translate.get('field_error_name_first').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.last_name || !this.address.last_name.length) {
            this.translate.get('field_error_name_last').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.email || this.address.email.length <= 5 || !reg.test(this.address.email)) {
            this.translate.get('field_error_email').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.phone || !this.address.phone.length) {
            this.translate.get('field_error_phone').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.address_1 || !this.address.address_1.length) {
            this.translate.get('field_error_address_line1').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.address_2 || !this.address.address_2.length) {
            this.translate.get('field_error_address_line2').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.city || !this.address.city.length) {
            this.translate.get('field_error_city').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.state || !this.address.state.length) {
            this.translate.get('field_error_state').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.postcode || !this.address.postcode.length) {
            this.translate.get('field_error_postalcode').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.country || !this.address.country.length) {
            this.translate.get('field_error_country').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else {
            if (this.address.id == -1) {
                if (!this.addresses) {
                    this.addresses = new Array();
                }
                this.address.id = this.addresses.length + 1;
                this.addresses.push(this.address);
            }
            else {
                var index = -1;
                for (var i = 0; i < this.addresses.length; i++) {
                    if (this.address.id == this.addresses[i].id) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    this.addresses[index] = this.address;
                }
            }
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST, JSON.stringify(this.addresses));
            this.navCtrl.pop();
        }
    };
    AddressPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    AddressPage.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    AddressPage.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    AddressPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-address ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\address\address.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon class="menu-icon"><img src="assets/imgs/ic_menu.png"></ion-icon>\n\n        </button>\n\n        <ion-title>{{\'my_address_add_new\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n    <div class="form" padding-left padding-right>\n\n        <ion-list>\n\n            <ion-item>\n\n                <ion-label>{{\'address_first_name\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="" [(ngModel)]="address.first_name"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_last_name\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="" [(ngModel)]="address.last_name"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'email\' | translate}}</ion-label>\n\n                <ion-input type="email" text-right placeholder="" [(ngModel)]="address.email"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'phone\' | translate}}</ion-label>\n\n                <ion-input type="tel" text-right placeholder="" [(ngModel)]="address.phone"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_address_1\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="" [(ngModel)]="address.address_1"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_address_2\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="" [(ngModel)]="address.address_2"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_city\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="" [(ngModel)]="address.city"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_state\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="" [(ngModel)]="address.state"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_country\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="" [(ngModel)]="address.country"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_postal\' | translate}}</ion-label>\n\n                <ion-input type="number" text-right placeholder="" [(ngModel)]="address.postcode"></ion-input>\n\n            </ion-item>\n\n\n\n        </ion-list>\n\n        <div class="btn-fisx-bottom">\n\n            <button ion-button full class="bg-thime btn-round btn-text" (click)="saveAddress()">{{\'Save Address\' | translate}}</button>\n\n        </div>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\address\address.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */]])
    ], AddressPage);
    return AddressPage;
}());

//# sourceMappingURL=address.js.map

/***/ }),

/***/ 152:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PasswordPage = /** @class */ (function () {
    function PasswordPage(translate, toastCtrl, navCtrl, service, loadingCtrl) {
        this.translate = translate;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.loadingShown = false;
        this.subscriptions = [];
    }
    PasswordPage.prototype.resetPassword = function () {
        var _this = this;
        if (this.userLogin && this.userLogin.length) {
            this.translate.get('loading_password_reset').subscribe(function (value) {
                _this.presentLoading(value);
            });
            var subscription = this.service.resetPassword(this.userLogin).subscribe(function (data) {
                _this.dismissLoading();
                _this.navCtrl.pop();
            }, function (err) {
                _this.dismissLoading();
                _this.navCtrl.pop();
            });
            this.subscriptions.push(subscription);
        }
        else {
            this.translate.get('field_error_valid_username').subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    PasswordPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PasswordPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PasswordPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    PasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-password ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\password\password.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{\'forgot_password\' | translate}}\n\n        </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding class="">\n\n    <div class="form" padding-left padding-right>\n\n        <p text-center>{{"reset_password_box1" | translate}}\n\n            <br>{{"reset_password3" | translate}}</p>\n\n        <ion-list>\n\n            <ion-item>\n\n                <ion-input type="text" text-right placeholder="{{\'reset_password_box1\' | translate}}" [(ngModel)]="userLogin"></ion-input>\n\n            </ion-item>\n\n        </ion-list>\n\n        <button ion-button full class="bg-thime btn-round btn-text" (click)="resetPassword()">{{"submit" | translate}}</button>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\password\password.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */]])
    ], PasswordPage);
    return PasswordPage;
}());

//# sourceMappingURL=password.js.map

/***/ }),

/***/ 153:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateaccountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_register_request_models__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_auth_credential_models__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_otp_otp__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_app_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};










var CreateaccountPage = /** @class */ (function () {
    function CreateaccountPage(config, events, toastCtrl, navCtrl, service, loadingCtrl, alertCtrl, modalCtrl, translate) {
        this.config = config;
        this.events = events;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.authError = "";
        this.subscriptions = [];
        // private registerRequest: RegisterRequest = new RegisterRequest('prince@gmail.com', '8285724681', '123456');
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_4__models_register_request_models__["a" /* RegisterRequest */]('', '', '', '', '');
        this.registerRequestPasswordConfirm = '';
        this.buttonDisabled = true;
        this.countryCode = '';
    }
    CreateaccountPage.prototype.ionViewDidLoad = function () {
        this.getCountries();
    };
    CreateaccountPage.prototype.checkNumber = function () {
        var _this = this;
        if (!this.countryCode || this.countryCode == '') {
            this.buttonDisabled = true;
            this.translate.get('field_error_country').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast("Please select your country first");
            this.registerRequest.username = '';
            return;
        }
        var phone = JSON.parse(JSON.stringify(this.registerRequest.username));
        if (isNaN(phone)) {
            this.buttonDisabled = true;
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast("Phone number is not valid");
        }
        else if (phone.length > 10) {
            this.buttonDisabled = true;
            setTimeout(function () {
                phone = phone.slice(0, 10);
            }, 100);
        }
        else if (phone.length == 10 && phone != '' && !isNaN(phone)) {
            this.buttonDisabled = false;
        }
        else {
            this.buttonDisabled = true;
        }
        this.registerRequest.username = phone;
    };
    CreateaccountPage.prototype.getCountries = function () {
        var _this = this;
        this.service.getCountries().subscribe(function (data) {
            console.log("Countries fetched");
            _this.countries = data;
            // console.log(data);
        }, function (err) {
            console.log(err);
        });
    };
    CreateaccountPage.prototype.register = function () {
        var _this = this;
        this.authError = "";
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (this.registerRequest.first_name == "" || !this.registerRequest.first_name.length) {
            this.translate.get('field_error_name_first').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Please enter your first name');
        }
        else if (this.registerRequest.last_name == "" || !this.registerRequest.last_name.length) {
            this.translate.get('field_error_name_last').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Please enter your last name');
        }
        else if (this.registerRequest.username.length < 10) {
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid phone');
        }
        else if (this.registerRequest.email.length <= 5 || !reg.test(this.registerRequest.email)) {
            this.translate.get('field_error_email').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid email address');
        }
        else if (this.registerRequest.password.length == 0 || !(this.registerRequest.password === this.registerRequestPasswordConfirm)) {
            this.translate.get('field_error_password').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid passwords, twice.');
        }
        else {
            this.translate.get('loading_sign_up').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Registering user');
            var subscription = this.service.createUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.registerRequest)
                .subscribe(function (data) {
                _this.dismissLoading();
                _this.registerResponse = data;
                _this.translate.get('signup_success').subscribe(function (value) {
                    _this.showToast(value);
                });
                // this.showToast('Registration success.');
                _this.verifyPhone();
                // Now we are veryfying the mobile no. first.
                // let registerResponse: RegisterResponse = data;
                // this.signIn(String(registerResponse.id), this.registerRequest.username, this.registerRequest.password);
            }, function (err) {
                _this.authError = err.error.message;
                var pos = _this.authError.indexOf('<a');
                if (pos != -1) {
                    _this.authError = _this.authError.substr(0, pos) + '<a target="_blank" ' + _this.authError.substr(pos + 2, _this.authError.length - 1);
                }
                _this.dismissLoading();
                //this.presentErrorAlert("Unable to register with provided credentials");
            });
            this.subscriptions.push(subscription);
        }
    };
    CreateaccountPage.prototype.verifyPhone = function () {
        var obj = JSON.parse(JSON.stringify(this.registerRequest));
        window.localStorage.setItem('userCreateData', JSON.stringify(obj));
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_otp_otp__["a" /* OtpPage */], { userId: this.registerResponse.id, dialCode: this.countryCode });
    };
    CreateaccountPage.prototype.signIn = function (userId, username, password) {
        var _this = this;
        var credentials = new __WEBPACK_IMPORTED_MODULE_6__models_auth_credential_models__["a" /* AuthCredential */](username, password);
        var subscription = this.service.getAuthToken(credentials)
            .subscribe(function (data) {
            var authResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
            _this.getUser(userId);
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.presentErrorAlert(value);
            });
            // this.presentErrorAlert("Unable to login with provided credentials");
        });
        this.subscriptions.push(subscription);
    };
    CreateaccountPage.prototype.getUser = function (userId) {
        var _this = this;
        var subscription = this.service.getUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), userId).subscribe(function (data) {
            _this.dismissLoading();
            var userResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(userResponse));
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
            _this.events.publish('user:login');
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.presentErrorAlert(value);
            });
        });
        this.subscriptions.push(subscription);
    };
    CreateaccountPage.prototype.signinPage = function () {
        this.navCtrl.pop();
    };
    CreateaccountPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    CreateaccountPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    CreateaccountPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    CreateaccountPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CreateaccountPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-createaccount',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\createaccount\createaccount.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{\'create_ac\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n    <div class="form" padding-left padding-right>\n\n        <p text-center padding-bottom margin-bottom>{{\'reg_on\' | translate}} {{config.appName}}</p>\n\n        <ion-list>\n\n            <ion-item>\n\n                <ion-label>{{\'address_first_name\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="{{\'address_first_name\' | translate}}" [(ngModel)]="registerRequest.first_name"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_last_name\' | translate}}</ion-label>\n\n                <ion-input type="text" text-right placeholder="{{\'address_last_name\' | translate}}" [(ngModel)]="registerRequest.last_name"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'address_country\' | translate}}</ion-label>\n\n                <ion-select [(ngModel)]="countryCode" placeholder="{{\'select\' | translate}}" multiple="false">\n\n                    <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries">{{country.name}}</ion-option>\n\n                </ion-select>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'phone\' | translate}}</ion-label>\n\n                <ion-input type="tel" text-right placeholder="{{\'phone\' | translate}}" [(ngModel)]="registerRequest.username" (ngModelChange)="checkNumber($event)"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'email\' | translate}}</ion-label>\n\n                <ion-input type="email" text-right placeholder="{{\'email\' | translate}}" [(ngModel)]="registerRequest.email"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'password\' | translate}}</ion-label>\n\n                <ion-input type="password" text-right placeholder="{{\'c_password\' | translate}}" [(ngModel)]="registerRequest.password"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label>{{\'c2_password\' | translate}}</ion-label>\n\n                <ion-input type="password" text-right placeholder="{{\'c2_password\' | translate}}" [(ngModel)]="registerRequestPasswordConfirm"></ion-input>\n\n            </ion-item>\n\n        </ion-list>\n\n        <p text-center [innerHTML]="authError"></p>\n\n        <button ion-button full class="bg-thime btn-round btn-text" (click)="register()" [disabled]="buttonDisabled">{{\'Continue\' | translate}}</button>\n\n    </div>\n\n    <p text-center (click)="signinPage()" class="btn-fisx-bottom">\n\n        <small>\n\n            {{\'already_a/c\' | translate}}\n\n            <span class="text-sky">\n\n                {{\'login\' | translate}}\n\n            </span>\n\n        </small>\n\n    </p>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\createaccount\createaccount.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_9__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], CreateaccountPage);
    return CreateaccountPage;
}());

//# sourceMappingURL=createaccount.js.map

/***/ }),

/***/ 166:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 166;

/***/ }),

/***/ 167:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhonePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_firebase__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_otp_otp__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_register_request_models__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_app_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};









var PhonePage = /** @class */ (function () {
    function PhonePage(config, navCtrl, alertCtrl, loadingCtrl, toastCtrl, view, firebase, platform, events, service, translate) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.view = view;
        this.firebase = firebase;
        this.platform = platform;
        this.events = events;
        this.service = service;
        this.translate = translate;
        this.loadingShown = false;
        this.captchanotvarified = true;
        this.buttonDisabled = true;
        this.otpNotsent = false;
        this.countryCode = '';
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_5__models_register_request_models__["a" /* RegisterRequest */]('', '', '', '', '');
        this.subscriptions = [];
        // this.platform.registerBackButtonAction(() => {
        //   this.makeExitAlert();
        // },1);
    }
    PhonePage.prototype.ionViewDidLoad = function () {
        console.log("Phone Page");
        this.registerRequest = JSON.parse(window.localStorage.getItem('userCreateData'));
        console.log("Previous data is:--" + JSON.stringify(this.registerRequest));
        this.checkNumber();
        this.getCountries();
    };
    PhonePage.prototype.getCountries = function () {
        var _this = this;
        this.service.getCountries().subscribe(function (data) {
            console.log("Countries fetched");
            _this.countries = data;
            // console.log(data);
        }, function (err) {
            console.log(err);
        });
    };
    PhonePage.prototype.checkNumber = function () {
        var _this = this;
        if (!this.countryCode || this.countryCode == '') {
            this.buttonDisabled = true;
            this.translate.get('field_error_country').subscribe(function (value) {
                _this.showToast(value);
            });
            this.registerRequest.username = '';
            return;
        }
        this.phoneNumber = JSON.parse(JSON.stringify(this.registerRequest.username));
        if (isNaN(this.phoneNumber)) {
            this.buttonDisabled = true;
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        else if (this.phoneNumber.length > 10) {
            this.buttonDisabled = true;
            setTimeout(function () {
                _this.phoneNumber = _this.phoneNumber.slice(0, 10);
            }, 100);
            return;
        }
        else if (this.phoneNumber.length == 10 && this.phoneNumber != '' && !isNaN(this.phoneNumber)) {
            this.buttonDisabled = false;
            return false;
        }
        else {
            this.buttonDisabled = true;
            return false;
        }
    };
    PhonePage.prototype.createUser = function () {
        var _this = this;
        if (!this.phoneNumber || this.phoneNumber == '') {
            this.buttonDisabled = true;
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        this.translate.get('check_phone').subscribe(function (value) {
            _this.presentLoading(value);
        });
        this.registerRequest.password = Math.random().toString(36).slice(-6);
        console.log(JSON.stringify(this.registerRequest));
        var subscription = this.service.createUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.registerRequest).subscribe(function (data) {
            _this.dismissLoading();
            _this.registerResponse = data;
            _this.verifyOtp();
            //user not found now we can send the sms on this number
        }, function (err) {
            _this.translate.get('mobile_exist').subscribe(function (value) {
                _this.showToast(value);
            });
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    PhonePage.prototype.verifyOtp = function () {
        console.log("COuntry code is ", this.countryCode);
        window.localStorage.setItem('userCreateData', JSON.stringify(this.registerRequest));
        // this.navCtrl.setRoot(OtpPage,{})
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_otp_otp__["a" /* OtpPage */], { userId: this.registerResponse.id, dialCode: this.countryCode });
    };
    PhonePage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Application exit prevented!');
                    }
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    PhonePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PhonePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PhonePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    PhonePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-phone',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\phone\phone.html"*/'<ion-header>\n\n  <ion-navbar>\n\n      <ion-title text-center>MOBIMAIL</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div class="form" padding-left padding-right>\n\n    <p text-center>{{\'enter_phone_text\' | translate}} <br/>{{\'enter_phone_text1\' | translate}}</p>\n\n    <ion-list>\n\n      <ion-item>\n\n        <ion-label>{{\'address_country\' | translate}}</ion-label>\n\n        <ion-select [(ngModel)]="countryCode" placeholder="{{\'select\' | translate}}"okText="{{\'okay\' | translate}}" cancelText="{{\'cancel\' | translate}}" multiple="false">\n\n          <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries" >{{country.name}}</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>{{\'phone\' | translate}}</ion-label>\n\n        <ion-input type="text" text-right placeholder="{{\'phone\' | translate}}" [(ngModel)]="registerRequest.username" (ngModelChange)="checkNumber($event)"></ion-input>\n\n      </ion-item>\n\n    </ion-list>\n\n    <button ion-button full class="bg-thime btn-round btn-text" (click)="createUser()" [disabled]="buttonDisabled">\n\n      {{\'Continue\' | translate}}        \n\n    </button>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\phone\phone.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_7__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Events */], __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], PhonePage);
    return PhonePage;
}());

//# sourceMappingURL=phone.js.map

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordpressClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_app_config__ = __webpack_require__(44);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var WordpressClient = /** @class */ (function () {
    function WordpressClient(config, http) {
        this.config = config;
        this.http = http;
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }
    WordpressClient.prototype.convertToParams = function (data) {
        var p = [];
        for (var key in data) {
            p.push(key + '=' + encodeURIComponent(data[key]));
        }
        return p.join('&');
    };
    WordpressClient.prototype.checkToken = function (adminToken, idToken) {
        var data = this.convertToParams({ token: idToken });
        var httpOptions = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({
                'Content-Type': 'application/json',
                // 'Content-Type':  'application/x-www-form-urlencoded',
                'Authorization': adminToken
            })
        };
        var token = this.http.post(this.config.apiBase + 'mobile-ecommerce/v1/jwt/token/firebase', { token: idToken }, httpOptions);
        return token.concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getCountries = function () {
        // return this.http
        // .get<Array<Country>>('https://restcountries.eu/rest/v2/all')
        return this.http
            .get('./assets/json/countries.json')
            .concatMap(function (data) {
            var indiaObj = {};
            for (var index = 0; index < data.length; index++) {
                if (!(data[index].callingCodes.length) || data[index].callingCodes[0] == "") {
                    data.splice(index, 1);
                }
                if (data[index].alpha2Code === "IN") {
                    indiaObj = data[index];
                    data.splice(index, 1);
                }
            }
            data.splice(0, 0, indiaObj);
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getUser = function (adminToken, userId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/customers/' + userId, { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.updateUser = function (adminToken, userId, userUpdateRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .put(this.config.apiBase + 'wc/v2/customers/' + userId, JSON.stringify(userUpdateRequest), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.createUser = function (adminToken, credentials) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.post(this.config.apiBase + 'wp/v2/users', JSON.stringify(credentials), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getAuthToken = function (credentials) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http
            .post(this.config.apiBase + 'mobile-ecommerce/v1/jwt/token', JSON.stringify(credentials), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.resetPassword = function (userName) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http
            .post(this.config.apiBase + 'mobile-ecommerce/v1/password/forgot', JSON.stringify({ user_login: userName }), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.createOrder = function (adminToken, createOrder) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .post(this.config.apiBase + 'wc/v2/orders/', JSON.stringify(createOrder), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.myOrders = function (adminToken, customer_id, pageNo) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/orders/' + '?customer=' + customer_id + '&page=' + pageNo, { headers: myHeaders })
            .concatMap(function (data) {
            for (var i = 0; i < data.length; i++) {
                var order = data[i];
                order.date_created = _this.formatDate(new Date(order.date_created));
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.updateOrder = function (adminToken, orderId, orderUpdateRequest) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .put(this.config.apiBase + 'wc/v2/orders/' + orderId, JSON.stringify(orderUpdateRequest), { headers: myHeaders })
            .concatMap(function (data) {
            var order = data;
            order.date_created = _this.formatDate(new Date(order.date_created));
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.shippingLines = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/shipping_methods/', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getCouponByCode = function (adminToken, cCode) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/coupons?code=' + cCode, { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.applyCouponCode = function (adminToken, orderId, cCode) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'mobile-ecommerce/v1/coupon/order/' + orderId + '/apply-coupon?code=' + cCode, { headers: myHeaders })
            .concatMap(function (data) {
            var order = data;
            order.date_created = _this.formatDate(new Date(order.date_created));
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.categoriesParent = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/categories/?order=desc&orderby=count&parent=0&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.categories = function (adminToken, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/categories/?per_page=20&order=desc&orderby=count&page=' + pageNo + '&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productVariations = function (adminToken, productId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + productId + '/variations/', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsReviews = function (adminToken, productId) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + productId + '/reviews/', { headers: myHeaders })
            .concatMap(function (data) {
            for (var i = 0; i < data.length; i++) {
                var review = data[i];
                review.date_created = _this.formatDate(new Date(review.date_created));
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.banners = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'mobile-ecommerce/v1/banners/list', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsAll = function (adminToken, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + '?per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productById = function (adminToken, proId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + proId, { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsByQuery = function (adminToken, query, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + '?search=' + query + '&per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsByCategory = function (adminToken, catId, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + '?category=' + catId + '&per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.currencies = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/settings/general/woocommerce_currency', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.paymentGateways = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/payment_gateways/', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.registerForPushNotification = function (adminToken, userId, playerId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .post(this.config.apiBase + 'mobile-ecommerce/v1/notification/register/' + userId, JSON.stringify({ 'player_id': playerId }), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.formatDate = function (date) {
        return this.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    };
    WordpressClient = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], WordpressClient);
    return WordpressClient;
}());

//# sourceMappingURL=wordpress-client.service.js.map

/***/ }),

/***/ 210:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 210;

/***/ }),

/***/ 22:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CartPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shippining_shippining__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var CartPage = /** @class */ (function () {
    function CartPage(translate, global, navCtrl, viewCtrl, toastCtrl, appCtrl) {
        this.translate = translate;
        this.global = global;
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.toastCtrl = toastCtrl;
        this.appCtrl = appCtrl;
        this.cartItems = new Array();
        this.total = 0;
        this.checkoutText = 'Proceed to checkout';
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
        }
        var cartItems = global.getCartItems();
        if (cartItems != null) {
            this.cartItems = this.cartItems.concat(cartItems);
        }
        this.calculateTotal();
    }
    CartPage.prototype.removeItem = function (product) {
        this.global.removeCartItem(product);
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    CartPage.prototype.decrementItem = function (product) {
        var _this = this;
        var decremented = this.global.decrementCartItem(product);
        if (!decremented) {
            this.cartItems = this.global.getCartItems();
            this.calculateTotal();
        }
        else {
            this.total = this.total - Number(product.sale_price);
            this.setPriceHtml();
        }
        // this.showToast(decremented ? 'Item updated' : 'Item removed');
        this.translate.get(decremented ? 'Item updated' : 'Item removed').subscribe(function (value) {
            _this.showToast(value);
        });
    };
    CartPage.prototype.incrementItem = function (product) {
        var _this = this;
        var incremented = this.global.incrementCartItem(product);
        if (incremented) {
            this.total = this.total + Number(product.sale_price);
            this.setPriceHtml();
        }
        this.translate.get(incremented ? 'Item updated' : 'Item max limit reached').subscribe(function (value) {
            _this.showToast(value);
        });
        // this.showToast(incremented ? 'Item updated' : 'Item max limit reached');
    };
    CartPage.prototype.calculateTotal = function () {
        var sum = 0;
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var item = _a[_i];
            sum = sum + Number(item.product.sale_price) * item.quantity;
        }
        this.total = sum;
        if (!this.cartItems || !this.cartItems.length) {
            this.checkoutText = 'Cart is empty';
        }
        this.setPriceHtml();
    };
    CartPage.prototype.setPriceHtml = function () {
        if (this.currencyIcon) {
            this.total_html = this.currencyIcon + ' ' + this.total;
        }
        else if (this.currencyText) {
            this.total_html = this.currencyText + ' ' + this.total;
        }
    };
    CartPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CartPage.prototype.proceedCheckout = function () {
        var _this = this;
        if (this.cartItems != null && this.cartItems.length > 0) {
            var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_KEY));
            if (user != null) {
                this.viewCtrl.dismiss();
                this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_3__shippining_shippining__["a" /* ShippiningPage */]);
            }
            else {
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].TEMP_OPEN, __WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].TEMP_OPEN_CART);
                this.translate.get("no_sign_in").subscribe(function (value) {
                    _this.showToast(value);
                });
                // this.showToast('Sign in to continue');
                this.viewCtrl.dismiss();
                this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
            }
        }
    };
    CartPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    CartPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cart ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\cart\cart.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <!--\n\n<button ion-button menuToggle>\n\n      <ion-icon class="menu-icon"><img src="assets/imgs/ic_menu.png"></ion-icon>\n\n    </button>\n\n-->\n\n        <ion-title>{{\'cart_title\' | translate}}\n\n            <span float-right>\n\n                <ion-icon class="icon" (click)="dismiss()">\n\n                    <img src="assets/imgs/ic_cross.png" width="100%;">\n\n                </ion-icon>\n\n            </span>\n\n        </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <div class="your-cart bg-thime">\n\n        <ion-card *ngFor="let item of cartItems">\n\n            <ion-card-content>\n\n                <ion-row>\n\n                    <ion-col col-3>\n\n                        <div *ngIf="item.product.images && item.product.images.length" class="img-box">\n\n                            <img data-src="{{item.product.images[0].src}}">\n\n                        </div>\n\n                        <div *ngIf="!item.product.images || !item.product.images.length" class="img-box">\n\n                            <img src="assets/imgs/suit_PNG8132.png">\n\n                        </div>\n\n                    </ion-col>\n\n                    <ion-col col-9>\n\n                        <h4>{{item.product.name}}\n\n                            <span class="icon text-light">\n\n                                <img src="assets/imgs/delete.png" (click)="removeItem(item.product)">\n\n                            </span>\n\n                        </h4>\n\n                        <div class="rate">\n\n                            <div style="display: flex;" class="price-box">\n\n                                <div class="price text-light" padding-right [innerHTML]="item.product.regular_price_html">\n\n                                    <!-- <img src="assets/imgs/rupee-light.png" class="rupee-icon">{{item.product.regular_price}} -->\n\n                                </div>\n\n                                <div class="price text-sky" [innerHTML]="item.product.sale_price_html">\n\n                                    <!-- <img src="assets/imgs/rupee-sky.png" class="rupee-icon">{{item.product.sale_price}} -->\n\n                                </div>\n\n                            </div>\n\n                            <p text-right>\n\n                                <span class="text-light">\n\n                                    <ion-icon name="ios-add" (click)="incrementItem(item.product)"></ion-icon>\n\n                                    {{item.quantity}}\n\n                                    <ion-icon name="ios-remove" (click)="decrementItem(item.product)"></ion-icon>\n\n                                </span>\n\n                            </p>\n\n                        </div>\n\n                    </ion-col>\n\n                </ion-row>\n\n            </ion-card-content>\n\n        </ion-card>\n\n\n\n\n\n        <ion-row class="checkout">\n\n            <ion-col col-6>\n\n                <h6 class="text-white">\n\n                    {{\'total\' | translate}}\n\n                    <span [innerHTML]="total_html"></span>\n\n                </h6>\n\n            </ion-col>\n\n            <ion-col col-6>\n\n                <button ion-button full class="bg-green btn-round btn-text btn-shadow" (click)="proceedCheckout()">{{checkoutText | translate}}</button>\n\n            </ion-col>\n\n        </ion-row>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\cart\cart.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_2__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */]])
    ], CartPage);
    return CartPage;
}());

//# sourceMappingURL=cart.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CartItem; });
var CartItem = /** @class */ (function () {
    function CartItem() {
    }
    return CartItem;
}());

//# sourceMappingURL=cart-item.models.js.map

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PaymentPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__placed_placed__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_order_request_models__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_order_update_request_models__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_paypal__ = __webpack_require__(268);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_js_sha512__ = __webpack_require__(370);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_js_sha512___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_js_sha512__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_app_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__home_home__ = __webpack_require__(39);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};












var PaymentPage = /** @class */ (function () {
    function PaymentPage(config, iab, payPal, toastCtrl, navCtrl, navParams, service, loadingCtrl, alertCtrl, appCtrl) {
        this.config = config;
        this.iab = iab;
        this.payPal = payPal;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.appCtrl = appCtrl;
        this.loadingShown = false;
        this.placedPagePushed = false;
        this.paymentDone = false;
        this.paymentFailAlerted = false;
        this.subscriptions = [];
        this.paymentGateways = new Array();
        this.totalItems = 0;
        this.total = 0;
        this.couponApplied = false;
        this.cartItems = this.navParams.get('cart');
        this.totalItems = this.navParams.get('totalItems');
        this.total = this.navParams.get('total');
        var paymentGateways = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].PAYMENT_GATEWAYS));
        this.selectedAddress = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS));
        if (paymentGateways != null) {
            for (var _i = 0, paymentGateways_1 = paymentGateways; _i < paymentGateways_1.length; _i++) {
                var pg = paymentGateways_1[_i];
                if (pg.enabled && this.paymentImplemented(pg.id)) {
                    this.paymentGateways.push(pg);
                }
            }
        }
    }
    PaymentPage.prototype.paymentImplemented = function (id) {
        return id === "paypal" || id === "ppec_paypal" || id === "pumcp" || id === "payuindia" || id === "cod";
    };
    PaymentPage.prototype.paymentMethod = function (paymentGateway) {
        this.selectedPaymentGateway = paymentGateway;
    };
    PaymentPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    PaymentPage.prototype.placedPage = function () {
        var _this = this;
        if (this.selectedPaymentGateway == null) {
            this.showToast('Choose payment method.');
        }
        else {
            this.orderRequest = new __WEBPACK_IMPORTED_MODULE_5__models_order_request_models__["a" /* OrderRequest */]();
            this.orderRequest.payment_method = this.selectedPaymentGateway.id;
            this.orderRequest.payment_method_title = this.selectedPaymentGateway.title;
            this.orderRequest.set_paid = false;
            this.orderRequest.billing = this.selectedAddress;
            this.orderRequest.shipping = this.selectedAddress;
            this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].USER_KEY));
            this.orderRequest.customer_id = String(this.user.id);
            this.orderRequest.line_items = this.cartItems;
            for (var _i = 0, _a = this.orderRequest.line_items; _i < _a.length; _i++) {
                var item = _a[_i];
                item.product = null;
            }
            this.presentLoading('Creating order');
            var subscription = this.service.createOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.orderRequest).subscribe(function (data) {
                _this.orderResponse = data;
                var coupon = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_COUPON));
                if (coupon) {
                    var couponSubs = _this.service.applyCouponCode(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(_this.orderResponse.id), coupon.code).subscribe(function (data) {
                        _this.couponApplied = true;
                        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
                        _this.showToast('Coupon applied.');
                        _this.orderPlaced();
                    }, function (err) {
                        _this.showToast('Coupon application failed.');
                        _this.orderPlaced();
                        console.log(err);
                        _this.dismissLoading();
                    });
                    _this.subscriptions.push(couponSubs);
                }
                else {
                    _this.orderPlaced();
                }
            }, function (err) {
                _this.dismissLoading();
                _this.showToast('Unable to place order');
                _this.appCtrl.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_11__home_home__["a" /* HomePage */]);
            });
            this.subscriptions.push(subscription);
        }
    };
    PaymentPage.prototype.orderPlaced = function () {
        this.dismissLoading();
        if (this.selectedPaymentGateway.id === "paypal") {
            this.initPayPal();
        }
        else if (this.selectedPaymentGateway.id === "ppec_paypal") {
            this.initPayPal();
        }
        else if (this.selectedPaymentGateway.id === "pumcp" || this.selectedPaymentGateway.id === "payuindia") {
            this.initPayUMoney();
        }
        else if (this.selectedPaymentGateway.id === "cod") {
            this.clearCart();
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__placed_placed__["a" /* PlacedPage */]);
        }
        else {
            this.showToast('Processed via Cash on delivery');
            this.clearCart();
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__placed_placed__["a" /* PlacedPage */]);
        }
    };
    // Example sandbox response
    //
    // {
    //   "client": {
    //     "environment": "sandbox",
    //     "product_name": "PayPal iOS SDK",
    //     "paypal_sdk_version": "2.16.0",
    //     "platform": "iOS"
    //   },
    //   "response_type": "payment",
    //   "response": {
    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
    //     "state": "approved",
    //     "create_time": "2016-10-03T13:33:33Z",
    //     "intent": "sale"
    //   }
    // }
    PaymentPage.prototype.initPayPal = function () {
        var _this = this;
        this.payPal.init({ PayPalEnvironmentProduction: this.config.paypalProduction, PayPalEnvironmentSandbox: this.config.paypalSandbox }).then(function () {
            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            _this.payPal.prepareToRender(_this.config.paypalProduction ? 'PayPalEnvironmentProduction' : 'PayPalEnvironmentSandbox', new __WEBPACK_IMPORTED_MODULE_7__ionic_native_paypal__["b" /* PayPalConfiguration */]({})).then(function () {
                var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].CURRENCY));
                var payment = new __WEBPACK_IMPORTED_MODULE_7__ionic_native_paypal__["c" /* PayPalPayment */](String(_this.couponApplied ? _this.total : _this.totalItems), currency.value, 'Description', 'sale');
                _this.payPal.renderSinglePaymentUI(payment).then(function () {
                    _this.paymentSuccess();
                    // Successfully paid
                }, function () {
                    _this.paymentFailure();
                    // Error or render dialog closed without being successful
                });
            }, function () {
                // Error in configuration
            });
        }, function () {
            // Error in initialization, maybe PayPal isn't supported or something else
        });
    };
    PaymentPage.prototype.initPayUMoney = function () {
        var _this = this;
        var name = this.user.first_name && this.user.first_name.length ? this.user.first_name : this.user.username;
        var mobile = this.user.username;
        var email = this.user.email;
        var bookingId = String(Math.floor(Math.random() * (99 - 10 + 1) + 10)) + String(this.orderResponse.id);
        var productinfo = this.orderResponse.order_key;
        var salt = this.config.payuSalt;
        var key = this.config.payuKey;
        var amt = this.couponApplied ? this.total : this.totalItems;
        var string = key + '|' + bookingId + '|' + amt + '|' + productinfo + '|' + name + '|' + email + '|||||||||||' + salt;
        var encrypttext = Object(__WEBPACK_IMPORTED_MODULE_9_js_sha512__["sha512"])(string);
        //let url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&salt=" + salt + "&key=" + key;
        var url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&hash=" + encrypttext + "&salt=" + salt + "&key=" + key;
        var options = {
            location: 'yes',
            clearcache: 'yes',
            zoom: 'yes',
            toolbar: 'no',
            closebuttoncaption: 'back'
        };
        var browser = this.iab.create(url, '_blank', options);
        browser.on('loadstop').subscribe(function (event) {
            browser.executeScript({
                file: "payumoney/payumoneyPaymentGateway.js"
            });
            if (event.url == "http://localhost/success.php") {
                _this.paymentSuccess();
                browser.close();
            }
            if (event.url == "http://localhost/failure.php") {
                _this.paymentFailure();
                browser.close();
            }
        });
        browser.on('exit').subscribe(function (event) {
            if (!_this.paymentDone && !_this.paymentFailAlerted) {
                _this.paymentFailure();
            }
        });
        browser.on('loaderror').subscribe(function (event) {
            _this.showToast('Something went wrong');
        });
    };
    PaymentPage.prototype.paymentFailure = function () {
        var _this = this;
        this.paymentFailAlerted = true;
        var subscription = this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.orderResponse.id), new __WEBPACK_IMPORTED_MODULE_6__models_order_update_request_models__["a" /* OrderUpdateRequest */]('cancelled')).subscribe(function (data) {
        }, function (err) {
            console.log(err);
        });
        this.subscriptions.push(subscription);
        var alert = this.alertCtrl.create({
            title: 'Payment failure',
            message: 'Unfortunately payment has failed hence order has been cancelled. Item(s) still exists in your cart, you can retry later.',
            buttons: [{
                    text: 'Okay',
                    role: 'cancel',
                    handler: function () {
                        _this.done();
                        console.log('Okay clicked');
                    }
                }]
        });
        alert.present();
    };
    PaymentPage.prototype.paymentSuccess = function () {
        var _this = this;
        this.paymentDone = true;
        this.clearCart();
        this.presentLoading('Just a moment');
        var subscription = this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.orderResponse.id), { set_paid: true }).subscribe(function (data) {
            _this.done();
        }, function (err) {
            _this.done();
            _this.paymentSuccess();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    PaymentPage.prototype.done = function () {
        if (!this.placedPagePushed) {
            this.placedPagePushed = true;
            this.dismissLoading();
            this.appCtrl.getRootNav().setRoot(this.paymentFailAlerted ? __WEBPACK_IMPORTED_MODULE_11__home_home__["a" /* HomePage */] : __WEBPACK_IMPORTED_MODULE_2__placed_placed__["a" /* PlacedPage */]);
        }
    };
    PaymentPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PaymentPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PaymentPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: msg,
            buttons: ['Dismiss']
        });
        alert.present();
    };
    PaymentPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    PaymentPage.prototype.clearCart = function () {
        var cartItems = new Array();
        window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    };
    PaymentPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-payment ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\payment\payment.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{"Pay now" | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content radio-group class="bg-light">\n\n    <ion-row text-center class="status">\n\n        <ion-col class="complate">\n\n            <ion-icon name="ios-checkmark-circle"></ion-icon>\n\n            <span>{{"login" | translate}}</span>\n\n        </ion-col>\n\n        <ion-col class="processing">\n\n            <ion-icon name="ios-checkmark-circle"></ion-icon>\n\n            <span class="text-black">{{"shipping" | translate}}</span>\n\n        </ion-col>\n\n        <ion-col class="panding">\n\n            <ion-icon name="md-radio-button-off"></ion-icon>\n\n            <span>{{"payment" | translate}}</span>\n\n        </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-card>\n\n        <p class="heading">{{"PAYMENT_METHOD" | translate}}</p>\n\n        <ion-card-content>\n\n            <label ion-item *ngFor="let item of paymentGateways" class="text-black">\n\n                <ion-label>{{item.title}}</ion-label>\n\n                <ion-radio value="{{item.title}}" (click)="paymentMethod(item)"></ion-radio>\n\n            </label>\n\n        </ion-card-content>\n\n        <!--\n\n        <ion-card-content>\n\n            <ion-item>\n\n                <ion-label>Credit/Debit Card</ion-label>\n\n                <ion-radio checked="true" value="card"></ion-radio>\n\n            </ion-item>\n\n            <div class="form">\n\n                <ion-list>\n\n                    <ion-item>\n\n                        <ion-label>Card Type</ion-label>\n\n                        <ion-select [(ngModel)]="notifications" interface="action-sheet">\n\n                            <ion-option selected value="visa">Visa Express</ion-option>\n\n                            <ion-option value="debit">Debit Card</ion-option>\n\n                            <ion-option value="master">Master Card</ion-option>\n\n                            <ion-option value="credit">Credit Card </ion-option>\n\n                        </ion-select>\n\n                    </ion-item>\n\n                    <ion-item>\n\n                        <ion-label>Card Number</ion-label>\n\n                        <ion-input type="text" text-right value="1234-1234-1234-5678"></ion-input>\n\n                    </ion-item>\n\n                    <ion-item>\n\n                        <ion-label>Name on Card</ion-label>\n\n                        <ion-input type="text" text-right value="Jhon Smith"></ion-input>\n\n                    </ion-item>\n\n                    <ion-row>\n\n                        <ion-col col-8 class="">\n\n                            <div class="d-flex mr-5">\n\n                                <ion-item>\n\n                                    <ion-label>Expiry Date</ion-label>\n\n                                    <ion-input type="text" text-right value="11/20"></ion-input>\n\n                                </ion-item>\n\n                                <ion-icon name="md-calendar" class="text-light calendar-icon"></ion-icon>\n\n                            </div>\n\n                        </ion-col>\n\n                        <ion-col col-4>\n\n                            <ion-item>\n\n                                <ion-label>cvv</ion-label>\n\n                                <ion-input type="text" text-right value="244"></ion-input>\n\n                            </ion-item>\n\n                        </ion-col>\n\n                    </ion-row>\n\n\n\n                    <ion-item>\n\n                        <ion-label text-right>Save my card details</ion-label>\n\n                        <ion-toggle color="secondary" checked="true"></ion-toggle>\n\n                    </ion-item>\n\n                </ion-list>\n\n            </div>\n\n        </ion-card-content>\n\n		-->\n\n    </ion-card>\n\n    <div class="spacebar"></div>\n\n    <div class="btn-padding btn-fisx-bottom">\n\n      <button ion-button full class="bg-green btn-round green-shadow btn-text" (click)="placedPage()" style="text-transform: capitalize;">\n\n        {{"Continue" | translate}}\n\n      </button>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\payment\payment.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_10__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__["a" /* InAppBrowser */], __WEBPACK_IMPORTED_MODULE_7__ionic_native_paypal__["a" /* PayPal */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */]])
    ], PaymentPage);
    return PaymentPage;
}());

//# sourceMappingURL=payment.js.map

/***/ }),

/***/ 260:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlacedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__myorder_2_myorder_2__ = __webpack_require__(149);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PlacedPage = /** @class */ (function () {
    function PlacedPage(navCtrl, platform) {
        this.navCtrl = navCtrl;
        platform.registerBackButtonAction(function (event) {
            event.preventDefault();
        }, 100);
    }
    PlacedPage.prototype.ordersPage = function () {
        this.homePage();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__myorder_2_myorder_2__["a" /* Myorder_2Page */]);
    };
    PlacedPage.prototype.homePage = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomePage */]);
    };
    PlacedPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-placed ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\placed\placed.html"*/'<ion-header>\n\n    <ion-navbar>\n\n		<ion-title><p text-center style="width:100%">{{"order_placed" | translate}} !</p></ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <div class="img-box">\n\n        <img src="assets/imgs/order-placed.jpg">\n\n    </div>\n\n    <h3 class="text-sky" text-center>{{"u_order_placed" | translate}} !!</h3>\n\n    <h4 class="" text-center>{{"order_success" | translate}}.<br>{{"p_visit" | translate}} <strong (click)="ordersPage()" class="text-black">{{"my_orders" | translate}}</strong> {{"page2check" | translate}}<br> {{"the_progress" | translate}}</h4>\n\n    <div class="btn-padding btn-fisx-bottom ">\n\n        <button ion-button full class="bg-green btn-round green-shadow btn-text" (click)="homePage()">{{"CONTINUE_SHOPPING" | translate}}</button>\n\n    </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\placed\placed.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* Platform */]])
    ], PlacedPage);
    return PlacedPage;
}());

//# sourceMappingURL=placed.js.map

/***/ }),

/***/ 261:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderUpdateRequest; });
var OrderUpdateRequest = /** @class */ (function () {
    function OrderUpdateRequest(status) {
        this.status = status;
    }
    return OrderUpdateRequest;
}());

//# sourceMappingURL=order-update-request.models.js.map

/***/ }),

/***/ 270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CodePage = /** @class */ (function () {
    function CodePage(translate, service, loadingCtrl, toastCtrl, navParams, viewCtrl) {
        this.translate = translate;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.cCode = "";
        this.loadingShown = false;
        this.subscriptions = [];
    }
    CodePage.prototype.checkCode = function () {
        var _this = this;
        if (!this.cCode.length) {
            this.translate.get('field_error_couponcode').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid coupon code.');
        }
        else {
            this.translate.get('Just a moment').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Just a moment');
            var subscription = this.service.getCouponByCode(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.cCode).subscribe(function (data) {
                _this.dismissLoading();
                var coupons = data;
                if (!coupons.length) {
                    _this.translate.get('field_error_invalid_couponcode').subscribe(function (value) {
                        _this.showToast(value);
                    });
                    // this.showToast('Invalid coupon code');
                }
                else {
                    var coupon = coupons[0];
                    if (new Date(coupon.date_expires) > new Date()) {
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_COUPON, JSON.stringify(coupons[0]));
                    }
                    else {
                        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
                        _this.translate.get('cpn_expire').subscribe(function (value) {
                            _this.showToast(value);
                        });
                        // this.showToast('Coupon expired');
                    }
                    _this.dismiss();
                }
            }, function (err) {
                _this.dismissLoading();
                _this.translate.get('field_error_invalid_couponcode').subscribe(function (value) {
                    _this.showToast(value);
                });
            });
            this.subscriptions.push(subscription);
        }
    };
    CodePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    CodePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    CodePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    CodePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CodePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-code ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\code\code.html"*/'<ion-content class="bg-light">\n\n    <div class="code">\n\n        <h2>{{\'Add Promo code\' | translate}}</h2>\n\n        <ion-input type="text" value="" [(ngModel)]="cCode" placeholder="{{\'enter_promo\' | translate}}"></ion-input>\n\n        <button ion-button full class="bg-thime btn-round btn-text" (click)="checkCode()">{{\'submit\' | translate}}</button>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\code\code.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* ViewController */]])
    ], CodePage);
    return CodePage;
}());

//# sourceMappingURL=code.js.map

/***/ }),

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShortPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ShortPage = /** @class */ (function () {
    function ShortPage(navCtrl, viewCtrl) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
    }
    ShortPage.prototype.sort = function (si) {
        this.dismiss();
    };
    ShortPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ShortPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-short',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\short\short.html"*/'<ion-content (click)="dismiss()">\n\n    <div class="group">\n\n        <ion-list radio-group>\n\n            <ion-list-header class="d-flex" text-uppercase>\n\n                {{"sort" | translate}}\n\n                <ion-icon name="ios-arrow-down"></ion-icon>\n\n            </ion-list-header>\n\n            <!-- <ion-item>\n\n                <ion-label>Popularity</ion-label>\n\n                <ion-radio checked="true" value="popularity"></ion-radio>\n\n            </ion-item> -->\n\n            <ion-item (click)="sort(0)">\n\n                <ion-label>{{"new_first" | translate}}</ion-label>\n\n                <ion-radio checked="true" value="newest"></ion-radio>\n\n            </ion-item>\n\n            <ion-item (click)="sort(1)">\n\n                <ion-label>{{"sort1" | translate}}</ion-label>\n\n                <ion-radio value="price_h_l"></ion-radio>\n\n            </ion-item>\n\n            <ion-item (click)="sort(2)">\n\n                <ion-label>{{"sor2" | translate}}</ion-label>\n\n                <ion-radio value="price_l_h"></ion-radio>\n\n            </ion-item>\n\n        </ion-list>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\short\short.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* ViewController */]])
    ], ShortPage);
    return ShortPage;
}());

//# sourceMappingURL=short.js.map

/***/ }),

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FilterPage = /** @class */ (function () {
    function FilterPage(navCtrl, viewCtrl) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
    }
    FilterPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    FilterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-filter ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\filter\filter.html"*/'<ion-content>\n\n    <div class="group">\n\n        <div class="size-filter">\n\n            <div class="slid-container">\n\n                <span>2XS</span>\n\n                <span>XS</span>\n\n                <span class="active">S</span>\n\n                <span>M</span>\n\n                <span class="active">L</span>\n\n                <span>XL</span>\n\n                <span>XX</span>\n\n                <span>XXX</span>\n\n            </div>\n\n        </div>\n\n        <div class="type-filter">\n\n            <div class="slid-container">\n\n                <span>Brand</span>\n\n                <span class="active">Size</span>\n\n                <span>Color</span>\n\n                <span>Wear</span>\n\n                <span>Outfit</span>\n\n            </div>\n\n        </div>\n\n        <ion-row text-center class="    action">\n\n            <ion-col col-5>\n\n                <p>Reset</p>\n\n            </ion-col>\n\n            <ion-col col-2>\n\n                <p>\n\n                    <ion-icon name="ios-close-outline" (click)="dismiss()"></ion-icon>\n\n                </p>\n\n            </ion-col>\n\n            <ion-col col-5>\n\n                <p class="active">Apply</p>\n\n            </ion-col>\n\n        </ion-row>\n\n    </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\filter\filter.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* ViewController */]])
    ], FilterPage);
    return FilterPage;
}());

//# sourceMappingURL=filter.js.map

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return My_accountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__addressselect_addressselect__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__address_address__ = __webpack_require__(151);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var My_accountPage = /** @class */ (function () {
    function My_accountPage(navCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.account = "profile";
        this.addressChangeText = 'Change';
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_KEY));
    }
    My_accountPage.prototype.ionViewDidEnter = function () {
        this.selectedAddress = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS));
        this.addressChangeText = this.selectedAddress == null ? 'Add' : 'Change';
    };
    My_accountPage.prototype.addressSelect = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__addressselect_addressselect__["a" /* AddressSelectPage */], { action: 'choose' });
    };
    My_accountPage.prototype.addressAdd = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__address_address__["a" /* AddressPage */]);
    };
    My_accountPage.prototype.isReadonly = function () {
        return true;
    };
    My_accountPage.prototype.addressNew = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__address_address__["a" /* AddressPage */]);
    };
    My_accountPage.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    My_accountPage.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    My_accountPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-my_account ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\my_account\my_account.html"*/'<ion-header class="bg-thime">\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon class="menu-icon"><img src="assets/imgs/ic_menu.png"></ion-icon>\n\n        </button>\n\n        <ion-title>{{"My Account" | translate}}\n\n            <!-- <span float-right>\n\n                <ion-icon class="icon" (click)="searchPage()"><img src="assets/imgs/ic_search.png" width="100%;"></ion-icon>\n\n                <ion-icon class="icon" (click)="cartPage()"><img src="assets/imgs/ic_my_cart.png" width="100%;"></ion-icon>\n\n            </span> -->\n\n        </ion-title>\n\n    </ion-navbar>\n\n    <!--\n\n<ion-list padding-left>\n\n    <ion-item padding-left padding-right>\n\n        <h2 class="">{{user.username}}\n\n            <small class=""> Edit profile</small>\n\n        </h2>\n\n        <p class="text-dark">{{user.email}}\n\n        </p>\n\n    </ion-item>\n\n</ion-list>\n\n-->\n\n    <ion-toolbar no-border-top class="tab-bar">\n\n        <ion-segment [(ngModel)]="account">\n\n            <ion-segment-button value="profile">\n\n                {{"profile" | translate}}\n\n            </ion-segment-button>\n\n            <!--\n\n            <ion-segment-button value="card">\n\n                My Cards\n\n            </ion-segment-button>\n\n			-->\n\n            <ion-segment-button value="address">\n\n                {{"my_address" | translate}}\n\n            </ion-segment-button>\n\n        </ion-segment>\n\n    </ion-toolbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div [ngSwitch]="account">\n\n    <div *ngSwitchCase="\'profile\'" class="profile-section">\n\n        <ion-list>\n\n            <ion-item>\n\n                <ion-label floating>{{"address_first_name" | translate}}</ion-label>\n\n                <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="user.first_name"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label floating>{{"address_last_name" | translate}}</ion-label>\n\n                <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="user.last_name"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label floating>{{"phone" | translate}}</ion-label>\n\n                <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="user.username"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n                <ion-label floating>{{"email" | translate}}</ion-label>\n\n                <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="user.email"></ion-input>\n\n            </ion-item>\n\n            <ion-item *ngIf="selectedAddress">\n\n                <ion-label floating>{{"phone" | translate}}</ion-label>\n\n                <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="selectedAddress.phone"></ion-input>\n\n            </ion-item>\n\n        </ion-list>\n\n        <div class="btn-fisx-bottom">\n\n            <button ion-button full class="bg-white btn-round text-sky btn-text">{{"update_info" | translate}}</button>\n\n        </div>\n\n    </div>\n\n\n\n    <div *ngSwitchCase="\'address\'" class="address-section bg-light">\n\n      <ion-card>\n\n        <p class="text-sky d-flex" (click)="addressSelect()" float-right style="margin: 1rem;">\n\n          <span>{{addressChangeText | translate}} &nbsp;&nbsp;\n\n            <ion-icon name="ios-arrow-forward" class="icon"></ion-icon>\n\n          </span>\n\n        </p>\n\n        <ion-card-content *ngIf="!selectedAddress">\n\n          <div class="addres-detail">\n\n            <h3>\n\n              <ion-icon name="ios-pin-outline" class="icon-position"></ion-icon>{{"No address selected" | translate}}\n\n            </h3>\n\n            <p>{{"Add an address to continue." | translate}}</p>\n\n          </div>\n\n        </ion-card-content>\n\n        <ion-card-content *ngIf="selectedAddress">\n\n          <div class="addres-detail">\n\n            <h3>\n\n              <ion-icon name="ios-pin-outline" class="icon-position"></ion-icon>{{selectedAddress.first_name}}\n\n            </h3>\n\n            <p>{{selectedAddress.address_1}}<br> {{selectedAddress.city}}</p>\n\n            <p>{{selectedAddress.phone}}</p>\n\n          </div>\n\n        </ion-card-content>\n\n      </ion-card>\n\n      <ion-card>\n\n        <ion-card-content>\n\n          <div class="new-addres" (click)="addressAdd()">\n\n            <h3>\n\n              <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>\n\n              {{"my_address_add_new" | translate}}\n\n            </h3>\n\n          </div>\n\n        </ion-card-content>\n\n      </ion-card>\n\n      <!--\n\n        <ion-card>\n\n            <div class="form" padding-left padding-right>\n\n                <p padding-bottom margin-bottom>\n\n                    <ion-icon name="ios-add-circle-outline"></ion-icon>ADD NEW CARD <span>Save</span></p>\n\n                <ion-list>\n\n                    <ion-item>\n\n                        <ion-label>Pincode</ion-label>\n\n                        <ion-input type="text" text-right value="110092"></ion-input>\n\n                    </ion-item>\n\n                    <ion-item>\n\n                        <ion-label>Address</ion-label>\n\n                        <ion-input type="text" text-right value="DE234 Mapleridge Drive Plano"></ion-input>\n\n                    </ion-item>\n\n                    <ion-item>\n\n                        <ion-label>Phone Number</ion-label>\n\n                        <ion-input type="text" text-right value="+91 908 765 4321"></ion-input>\n\n                    </ion-item>\n\n                    <div class="date-cvc-row">\n\n                        <div class="city">\n\n                            <ion-item>\n\n                                <ion-label>City</ion-label>\n\n                                <ion-input type="text" text-right value="Delhi"></ion-input>\n\n                            </ion-item>\n\n                        </div>\n\n                        <div class="State">\n\n                            <ion-item>\n\n                                <ion-label>State</ion-label>\n\n                                <ion-input type="text" text-right value="Delhi"></ion-input>\n\n                            </ion-item>\n\n                        </div>\n\n                    </div>\n\n                    <ion-item class="border-none">\n\n                        <ion-label text-right>Make this my default address</ion-label>\n\n                        <ion-toggle checked="true"></ion-toggle>\n\n                    </ion-item>\n\n                </ion-list>\n\n            </div>\n\n        </ion-card>\n\n       -->\n\n    </div>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\my_account\my_account.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */]])
    ], My_accountPage);
    return My_accountPage;
}());

//# sourceMappingURL=my_account.js.map

/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__wishlist_wishlist__ = __webpack_require__(64);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HelpPage = /** @class */ (function () {
    function HelpPage(navCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
    }
    HelpPage.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    HelpPage.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    HelpPage.prototype.wishlistPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__wishlist_wishlist__["a" /* WishlistPage */]);
    };
    HelpPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-help ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\help\help.html"*/'<ion-header class="bg-thime">\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon class="menu-icon"><img src="assets/imgs/ic_menu.png"></ion-icon>\n\n        </button>\n\n        <ion-title>{{\'help_center\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <h6 padding-left padding-right>{{\'faq\' | translate}}</h6>\n\n    <ion-card>\n\n        <ion-card-header>\n\n            {{\'order_track\' | translate}}\n\n            <!-- <ion-icon name="ios-arrow-forward-outline" float-right></ion-icon> -->\n\n        </ion-card-header>\n\n        <ion-card-content class="text-light">\n\n            Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n    <ion-card>\n\n        <ion-card-header>\n\n            {{\'refund\' | translate}}\n\n            <!-- <ion-icon name="ios-arrow-forward-outline" float-right></ion-icon> -->\n\n        </ion-card-header>\n\n        <ion-card-content class="text-light">\n\n            Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n    <ion-card>\n\n        <ion-card-header>\n\n            {{\'help_cancel_title\' | translate}}\n\n            <!-- <ion-icon name="ios-arrow-forward-outline" float-right></ion-icon> -->\n\n        </ion-card-header>\n\n        <ion-card-content class="text-light">\n\n            Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n    <ion-card>\n\n        <ion-card-header>\n\n            {{\'sell_support\' | translate}}\n\n            <!-- <ion-icon name="ios-arrow-forward-outline" float-right></ion-icon> -->\n\n        </ion-card-header>\n\n        <ion-card-content class="text-light">\n\n            Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n    <ion-card>\n\n        <ion-card-header>\n\n            {{\'payments\' | translate}}\n\n            <!-- <ion-icon name="ios-arrow-forward-outline" float-right></ion-icon> -->\n\n        </ion-card-header>\n\n        <ion-card-content class="text-light">\n\n            Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\n        </ion-card-content>\n\n    </ion-card>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\help\help.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */]])
    ], HelpPage);
    return HelpPage;
}());

//# sourceMappingURL=help.js.map

/***/ }),

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReviewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ReviewPage = /** @class */ (function () {
    function ReviewPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ReviewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-review ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\review\review.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n      <ion-icon class="menu-icon"><img src="assets/imgs/ic_menu.png"></ion-icon>\n\n    </button>\n\n        <ion-title>Add Review</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <ion-card>\n\n        <ion-card-header style="padding-bottom: 0;">\n\n            <ion-row>\n\n                <ion-col col-3>\n\n                    <div class="img-box">\n\n                        <img src="assets/imgs/suit_PNG8132.png">\n\n                    </div>\n\n                </ion-col>\n\n                <ion-col col-9>\n\n                    <h4>Unique For Men Black Formal Slim Fit Shirt</h4>\n\n                    <div class="rateing">\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                    </div>\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-card-header>\n\n\n\n        <ion-card-content>\n\n            <div class="form">\n\n                <ion-list>\n\n                    <ion-item class="write-reveiw">\n\n                        <ion-textarea type="text" placeholder="Write your Review"></ion-textarea>\n\n                    </ion-item>\n\n                    <ion-item>\n\n                        <ion-input type="text" placeholder="Heading four your review"></ion-input>\n\n                    </ion-item>\n\n                </ion-list>\n\n            </div>\n\n            <button ion-button full class="bg-green btn-round btn-text">SUBMIT NOW</button>\n\n        </ion-card-content>\n\n    </ion-card>\n\n    <h5>Previous orders</h5>\n\n    <ion-card>\n\n        <ion-card-header>\n\n            <ion-row>\n\n                <ion-col col-3>\n\n                    <div class="img-box">\n\n                        <img src="assets/imgs/bag.jpg">\n\n                    </div>\n\n                </ion-col>\n\n                <ion-col col-9>\n\n                    <h4>Skybags Leo 26 ltrs Red Casual Backpack</h4>\n\n                    <div class="rateing">\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                    </div>\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-card-header>\n\n    </ion-card>\n\n    <ion-card>\n\n        <ion-card-header>\n\n            <ion-row>\n\n                <ion-col col-3>\n\n                    <div class="img-box">\n\n                        <img src="assets/imgs/wach.jpg">\n\n                    </div>\n\n                </ion-col>\n\n                <ion-col col-9>\n\n                    <h4>Skmei Analog-Digital Multicolor Dil Men\'s Watch</h4>\n\n                    <div class="rateing">\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                        <ion-icon name="md-star" class="text-light"></ion-icon>\n\n                    </div>\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-card-header>\n\n    </ion-card>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\review\review.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */]])
    ], ReviewPage);
    return ReviewPage;
}());

//# sourceMappingURL=review.js.map

/***/ }),

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MySplashPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(14);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MySplashPage = /** @class */ (function () {
    function MySplashPage(events, navCtrl) {
        var _this = this;
        this.events = events;
        this.navCtrl = navCtrl;
        var categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES_PARENT));
        if (categories) {
            setTimeout(function () {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomePage */]);
            }, 2000);
        }
        else {
            events.subscribe('category:setup', function () {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomePage */]);
            });
        }
    }
    MySplashPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-mysplash',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\mysplash\mysplash.html"*/'<ion-content>\n\n    <img src="assets/imgs/splash.png">\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\mysplash\mysplash.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */]])
    ], MySplashPage);
    return MySplashPage;
}());

//# sourceMappingURL=mysplash.js.map

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(307);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__itemdetail_itemdetail__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SearchPage = /** @class */ (function () {
    function SearchPage(translate, navParams, viewCtrl, modalCtrl, toastCtrl, navCtrl, service, global, loadingCtrl, alertCtrl) {
        this.translate = translate;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.global = global;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.subscriptions = [];
        this.productsAll = new Array();
        this.productsResponse = new Array();
        this.productsAllPage = 1;
        this.queryHistory = new Array();
        this.loadingShown = false;
        this.queryHistory = global.getSearchHistory();
    }
    SearchPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    SearchPage.prototype.doSearch = function () {
        var _this = this;
        this.loadingShown = true;
        var subscription = this.service.productsByQuery(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.query, String(this.productsAllPage)).subscribe(function (data) {
            _this.loadingShown = false;
            var products = data;
            _this.productsResponse = new Array();
            var proSplit = new Array();
            var productsAll = new Array();
            for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
                var pro = products_1[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                if (proSplit.length == 2) {
                    productsAll.push(proSplit);
                    proSplit = new Array();
                }
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                pro.favorite = _this.global.isFavorite(pro);
                proSplit.push(pro);
                _this.productsResponse.push(pro);
            }
            if (proSplit.length > 0) {
                productsAll.push(proSplit);
            }
            _this.productsAll = productsAll;
        }, function (err) {
            _this.loadingShown = false;
        });
        this.subscriptions.push(subscription);
    };
    SearchPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.productsAllPage++;
        var subscription = this.service.productsByQuery(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.query, String(this.productsAllPage)).subscribe(function (data) {
            var products = data;
            var proSplit = new Array();
            for (var _i = 0, products_2 = products; _i < products_2.length; _i++) {
                var pro = products_2[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                if (proSplit.length == 2) {
                    _this.productsAll.push(proSplit);
                    proSplit = new Array();
                }
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                pro.favorite = _this.global.isFavorite(pro);
                proSplit.push(pro);
                _this.productsResponse.push(pro);
            }
            if (proSplit.length > 0) {
                _this.productsAll.push(proSplit);
            }
            infiniteScroll.complete();
        }, function (err) {
            infiniteScroll.complete();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    SearchPage.prototype.itemdetailPage = function (pro) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__itemdetail_itemdetail__["a" /* ItemdetailPage */], { pro: pro, pros: this.productsResponse });
    };
    SearchPage.prototype.clearHistory = function () {
        this.global.clearSearchHistory();
        this.queryHistory = new Array();
    };
    SearchPage.prototype.search = function (q) {
        var _this = this;
        this.query = q;
        this.productsAllPage = 1;
        this.doSearch();
        this.global.addInSearchHistory(q);
        this.translate.get('searching').subscribe(function (value) {
            _this.showToast(value);
        });
    };
    SearchPage.prototype.getItems = function (searchbar) {
        var q = searchbar.srcElement.value;
        if (!q) {
            return;
        }
        this.search(q);
    };
    SearchPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 1000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SearchPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    SearchPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-search ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\search\search.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{"search" | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content class="bg-light">\n\n    <div class="d-flex searchbar-section">\n\n        <ion-searchbar (ionInput)="getItems($event)" [debounce]="1000" placeholder="{{\'search_box\' | translate}}"></ion-searchbar>\n\n        <!-- <ion-icon name="md-close" class="close-icon text-grey" (click)="dismiss()"></ion-icon> -->\n\n    </div>\n\n\n\n    <div class="recent-search">\n\n        <ion-card *ngIf="queryHistory && queryHistory.length">\n\n            <ion-card-header>\n\n                {{"Recent Search" | translate}}\n\n                <span text-right class="right" (click)="clearHistory()">{{"clear_history" | translate}}</span>\n\n            </ion-card-header>\n\n            <ion-card-content>\n\n                <p *ngFor="let query of queryHistory" (click)="search(query)" class="text-black">\n\n                    <ion-icon name="ios-time-outline"></ion-icon>{{query}}\n\n                </p>\n\n            </ion-card-content>\n\n        </ion-card>\n\n    </div>\n\n\n\n    <div class="trending-search">\n\n        <p *ngIf="query && query.length" class="small">{{"Search results for" | translate}} {{query}}</p>\n\n        <div style="position:relative;">\n\n            <ion-list>\n\n                <div class="empty_placeholder" *ngIf="query && query.length && !loadingShown && (!productsAll || !productsAll.length)">\n\n                    <img src="assets/imgs/no_results.png">\n\n                    <p>{{"no_items" | translate}}</p>\n\n                </div>\n\n                <ion-row *ngFor="let products of productsAll">\n\n                    <ion-col col-6 *ngFor="let pro of products">\n\n                        <ion-card>\n\n                            <ion-card-header>\n\n                                <div *ngIf="pro.images && pro.images.length" class="img-box" (click)="itemdetailPage(pro)">\n\n                                    <img data-src="{{pro.images[0].src}}">\n\n                                </div>\n\n                                <div *ngIf="pro.images == null || pro.images.length == 0" class="img-box" (click)="itemdetailPage(pro)">\n\n                                    <img src="assets/imgs/suit_PNG8132.png">\n\n                                </div>\n\n                                <ion-icon name="md-heart" class="text-light icon"></ion-icon>\n\n                            </ion-card-header>\n\n                            <ion-card-content (click)="itemdetailPage(pro)">\n\n                                <h5 class="text-black">{{pro.name}}</h5>\n\n                                <div class="rateing">\n\n                                    <div class="btn-star">\n\n                                        <span class="text-white bg-green small-text">{{pro.average_rating}}\n\n                                            <ion-icon name="md-star"></ion-icon>\n\n                                        </span>\n\n                                        <span class="text-light bold"> ({{pro.rating_count}})</span>\n\n                                    </div>\n\n                                    <div style="width: 70%;" float-right>\n\n                                        <div *ngIf="pro.type ==\'simple\'" class="price text-sky" [innerHTML]="pro.sale_price_html"\n\n                                            style="float: right;">\n\n                                            <!-- <img src="assets/imgs/rupee-sky.png" class="rupee-icon">{{pro.sale_price}} -->\n\n                                        </div>\n\n                                        <div *ngIf="pro.type ==\'variable\'" class="price text-sky" [innerHTML]="pro.price_html"\n\n                                            style="float: right;">\n\n                                            <!-- <img src="assets/imgs/rupee-sky.png" class="rupee-icon">{{pro.sale_price}} -->\n\n                                        </div>\n\n                                        <div *ngIf="pro.type ==\'simple\' && pro.regular_price!=pro.sale_price" class="price text-light mr-5"\n\n                                            [innerHTML]="pro.regular_price_html" style="float: right;">\n\n                                            <!-- <img src="assets/imgs/rupee-light.png" class="rupee-icon">{{pro.regular_price}} -->\n\n                                        </div>\n\n                                    </div>\n\n                                </div>\n\n                            </ion-card-content>\n\n                        </ion-card>\n\n                    </ion-col>\n\n                </ion-row>\n\n            </ion-list>\n\n            <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n                <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n            </ion-infinite-scroll>\n\n        </div>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\search\search.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], SearchPage);
    return SearchPage;
}());

//# sourceMappingURL=search.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createTranslateLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_phone_phone__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_otp_otp__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_home_home__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_password_password__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_verification_verification__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_createaccount_createaccount__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_category_category__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_shirts_shirts__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_itemdetail_itemdetail__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_shippining_shippining__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_payment_payment__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_placed_placed__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_wishlist_wishlist__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_my_account_my_account__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_myorder_1_myorder_1__ = __webpack_require__(474);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_myorder_2_myorder_2__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_help_help__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_code_code__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_review_review__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_short_short__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_addressselect_addressselect__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_phonenumber_phonenumber__ = __webpack_require__(475);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_filter_filter__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_login_login__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_address_address__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ionic_native_status_bar__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_splash_screen__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ionic_native_social_sharing__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ionic_native_in_app_browser__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_mysplash_mysplash__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ionic_native_facebook__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ionic_native_google_plus__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40_ionic_img_viewer__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ionic_native_onesignal__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__ngx_translate_core__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ngx_translate_http_loader__ = __webpack_require__(476);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ionic_native_globalization__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ionic_native_device__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__ionic_native_paypal__ = __webpack_require__(268);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















































function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_43__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/i18n/', '.json');
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_29__pages_phonenumber_phonenumber__["a" /* PhonenumberPage */],
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_password_password__["a" /* PasswordPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_verification_verification__["a" /* VerificationPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_createaccount_createaccount__["a" /* CreateaccountPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_category_category__["a" /* CategoryPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_shirts_shirts__["a" /* ShirtsPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_itemdetail_itemdetail__["a" /* ItemdetailPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_shippining_shippining__["a" /* ShippiningPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_payment_payment__["a" /* PaymentPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_placed_placed__["a" /* PlacedPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_wishlist_wishlist__["a" /* WishlistPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_my_account_my_account__["a" /* My_accountPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_code_code__["a" /* CodePage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_myorder_1_myorder_1__["a" /* Myorder_1Page */],
                __WEBPACK_IMPORTED_MODULE_21__pages_myorder_2_myorder_2__["a" /* Myorder_2Page */],
                __WEBPACK_IMPORTED_MODULE_22__pages_help_help__["a" /* HelpPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_cart_cart__["a" /* CartPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_review_review__["a" /* ReviewPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_short_short__["a" /* ShortPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_search_search__["a" /* SearchPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_filter_filter__["a" /* FilterPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_address_address__["a" /* AddressPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_addressselect_addressselect__["a" /* AddressSelectPage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_mysplash_mysplash__["a" /* MySplashPage */], __WEBPACK_IMPORTED_MODULE_0__pages_phone_phone__["a" /* PhonePage */], __WEBPACK_IMPORTED_MODULE_6__pages_otp_otp__["a" /* OtpPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_40_ionic_img_viewer__["b" /* IonicImageViewerModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["m" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_42__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_42__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: createTranslateLoader,
                        deps: [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */]]
                    }
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["k" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_29__pages_phonenumber_phonenumber__["a" /* PhonenumberPage */],
                __WEBPACK_IMPORTED_MODULE_0__pages_phone_phone__["a" /* PhonePage */], __WEBPACK_IMPORTED_MODULE_6__pages_otp_otp__["a" /* OtpPage */],
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_password_password__["a" /* PasswordPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_verification_verification__["a" /* VerificationPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_createaccount_createaccount__["a" /* CreateaccountPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_category_category__["a" /* CategoryPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_shirts_shirts__["a" /* ShirtsPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_itemdetail_itemdetail__["a" /* ItemdetailPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_shippining_shippining__["a" /* ShippiningPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_payment_payment__["a" /* PaymentPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_placed_placed__["a" /* PlacedPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_wishlist_wishlist__["a" /* WishlistPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_my_account_my_account__["a" /* My_accountPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_code_code__["a" /* CodePage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_myorder_1_myorder_1__["a" /* Myorder_1Page */],
                __WEBPACK_IMPORTED_MODULE_21__pages_myorder_2_myorder_2__["a" /* Myorder_2Page */],
                __WEBPACK_IMPORTED_MODULE_22__pages_help_help__["a" /* HelpPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_cart_cart__["a" /* CartPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_review_review__["a" /* ReviewPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_short_short__["a" /* ShortPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_search_search__["a" /* SearchPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_filter_filter__["a" /* FilterPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_address_address__["a" /* AddressPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_addressselect_addressselect__["a" /* AddressSelectPage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_mysplash_mysplash__["a" /* MySplashPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_45__ionic_native_device__["a" /* Device */],
                __WEBPACK_IMPORTED_MODULE_41__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_33__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_34__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_46__ionic_native_paypal__["a" /* PayPal */],
                __WEBPACK_IMPORTED_MODULE_35__ionic_native_social_sharing__["a" /* SocialSharing */],
                __WEBPACK_IMPORTED_MODULE_36__ionic_native_in_app_browser__["a" /* InAppBrowser */], __WEBPACK_IMPORTED_MODULE_44__ionic_native_globalization__["a" /* Globalization */],
                { provide: __WEBPACK_IMPORTED_MODULE_5__app_config__["a" /* APP_CONFIG */], useValue: __WEBPACK_IMPORTED_MODULE_5__app_config__["b" /* BaseAppConfig */] },
                { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["l" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_38__ionic_native_facebook__["a" /* Facebook */], __WEBPACK_IMPORTED_MODULE_39__ionic_native_google_plus__["a" /* GooglePlus */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 369:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderRequest; });
var OrderRequest = /** @class */ (function () {
    function OrderRequest() {
    }
    return OrderRequest;
}());

//# sourceMappingURL=order-request.models.js.map

/***/ }),

/***/ 372:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Address; });
var Address = /** @class */ (function () {
    function Address() {
    }
    return Address;
}());

//# sourceMappingURL=address.models.js.map

/***/ }),

/***/ 39:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__category_category__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__wishlist_wishlist__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__itemdetail_itemdetail__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__shirts_shirts__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_category_models__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__app_app_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__shippining_shippining__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};















var HomePage = /** @class */ (function () {
    function HomePage(config, events, modalCtrl, toastCtrl, navCtrl, service, menu, global, loadingCtrl, alertCtrl, translate) {
        var _this = this;
        this.config = config;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.menu = menu;
        this.global = global;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.subscriptions = [];
        this.banners = new Array();
        this.categoriesAll = new Array();
        this.productsAll = new Array();
        this.productsResponse = new Array();
        this.productsAllPage = 1;
        this.cartTotal = 0;
        this.slides = [
            {
                title: "Under Rs. 699",
                description: "Tops & Tunics",
                smalltext: "fashion wear of the weeks",
                image: "assets/imgs/slider-1.jpg",
            },
            {
                title: "Under Rs. 699",
                description: "Tops & Tunics",
                smalltext: "fashion wear of the weeks",
                image: "assets/imgs/slider-2.jpg",
            },
            {
                title: "Under Rs. 699",
                description: "Tops & Tunics",
                smalltext: "fashion wear of the weeks",
                image: "assets/imgs/slider-3.jpg",
            }
        ];
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
        }
        events.subscribe('category:setup', function () {
            _this.setupCategories();
        });
        this.setupCategories();
        this.loadBanners();
        this.loadProducts();
        this.translate.get('loading_products').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Loading products');
        var toOpen = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].TEMP_OPEN);
        var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].USER_KEY));
        ;
        if (user && toOpen && toOpen.length) {
            if (toOpen == __WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].TEMP_OPEN_CART) {
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__shippining_shippining__["a" /* ShippiningPage */]);
            }
            else if (toOpen == __WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].TEMP_OPEN_PRODUCT) {
                var product = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].TEMP_OPEN_PRODUCT));
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__shippining_shippining__["a" /* ShippiningPage */], { pro: product });
            }
            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].TEMP_OPEN);
            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].TEMP_OPEN_CART);
            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].TEMP_OPEN_PRODUCT);
        }
    }
    HomePage.prototype.setupCategories = function () {
        var categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES_PARENT));
        var cats = new Array();
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var cat = categories_1[_i];
            if (cats.length == 4) {
                break;
            }
            if (Number(cat.parent) == 0 && Number(cat.count) > 0) {
                cats.push(cat);
            }
        }
        var more = new __WEBPACK_IMPORTED_MODULE_10__models_category_models__["a" /* Category */]();
        more.name = 'More';
        more.id = '-1';
        cats.push(more);
        this.categoriesAll = cats;
    };
    HomePage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
        window.localStorage.setItem('productsAll', JSON.stringify(this.productsAll));
    };
    HomePage.prototype.ionViewDidEnter = function () {
        this.menu.enable(true);
        this.productsAll = JSON.parse(window.localStorage.getItem('productsAll'));
        if (!this.productsAll) {
            this.productsAll = new Array();
        }
        else {
            this.dismissLoading();
        }
        this.cartTotal = Number(this.global.getCartItemsCount());
    };
    HomePage.prototype.loadBanners = function () {
        var _this = this;
        var savedBanners = JSON.parse(window.localStorage.getItem('banners'));
        if (savedBanners && savedBanners.length) {
            this.banners = savedBanners;
        }
        var subscription = this.service.banners(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].ADMIN_API_KEY))
            .subscribe(function (data) {
            var banners = data;
            var categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES));
            if ((banners && banners.length) && (categories && categories.length)) {
                for (var _i = 0, banners_1 = banners; _i < banners_1.length; _i++) {
                    var ban = banners_1[_i];
                    for (var _a = 0, categories_2 = categories; _a < categories_2.length; _a++) {
                        var cat = categories_2[_a];
                        if (cat.id == ban.category) {
                            ban.catObj = cat;
                            break;
                        }
                    }
                }
            }
            _this.banners = banners;
            window.localStorage.setItem('banners', JSON.stringify(_this.banners));
        }, function (err) {
        });
        this.subscriptions.push(subscription);
    };
    HomePage.prototype.loadProducts = function () {
        var _this = this;
        var subscription = this.service.productsAll(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.productsAllPage)).subscribe(function (data) {
            _this.dismissLoading();
            var products = data;
            var proSplit = new Array();
            var productsAll = new Array();
            _this.productsResponse = new Array();
            for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
                var pro = products_1[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                if (proSplit.length == 2) {
                    productsAll.push(proSplit);
                    proSplit = new Array();
                }
                pro.favorite = _this.global.isFavorite(pro);
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                proSplit.push(pro);
                _this.productsResponse.push(pro);
            }
            if (proSplit.length > 0) {
                productsAll.push(proSplit);
            }
            _this.productsAll = productsAll;
        }, function (err) {
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    HomePage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.productsAllPage++;
        var subscription = this.service.productsAll(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.productsAllPage)).subscribe(function (data) {
            var products = data;
            var proSplit = new Array();
            for (var _i = 0, products_2 = products; _i < products_2.length; _i++) {
                var pro = products_2[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                if (proSplit.length == 2) {
                    _this.productsAll.push(proSplit);
                    proSplit = new Array();
                }
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                pro.favorite = _this.global.isFavorite(pro);
                proSplit.push(pro);
                _this.productsResponse.push(pro);
            }
            if (proSplit.length > 0) {
                _this.productsAll.push(proSplit);
            }
            infiniteScroll.complete();
        }, function (err) {
            infiniteScroll.complete();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    HomePage.prototype.toggleFavorite = function (pro) {
        pro.favorite = this.global.toggleFavorite(pro);
    };
    HomePage.prototype.itemdetailPage = function (pro) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__itemdetail_itemdetail__["a" /* ItemdetailPage */], { pro: pro, pros: this.productsResponse });
    };
    HomePage.prototype.categoryPage = function (cat) {
        if (cat && cat.id != '-1') {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__shirts_shirts__["a" /* ShirtsPage */], { cat: cat });
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__category_category__["a" /* CategoryPage */]);
        }
    };
    HomePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    HomePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    HomePage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    HomePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    HomePage.prototype.wishlistPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__wishlist_wishlist__["a" /* WishlistPage */]);
    };
    HomePage.prototype.searchPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__search_search__["a" /* SearchPage */]);
        // let modal = this.modalCtrl.create(SearchPage);
        // modal.present();
    };
    HomePage.prototype.cartPage = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_6__cart_cart__["a" /* CartPage */]);
        modal.onDidDismiss(function () {
            _this.cartTotal = Number(_this.global.getCartItemsCount());
        });
        modal.present();
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\home\home.html"*/'<ion-header class="bg-thime">\n\n  <ion-navbar>\n\n      <button ion-button menuToggle style="display: block !important;">\n\n          <ion-icon class="menu-icon">\n\n              <img src="assets/imgs/ic_menu.png">\n\n          </ion-icon>\n\n      </button>\n\n      <ion-title>\n\n          {{"app_title" | translate}}\n\n          <span float-right>\n\n              <ion-icon class="icon" (click)="wishlistPage()">\n\n                  <img src="assets/imgs/ic_my_wishlist.png" width="100%;">\n\n              </ion-icon>\n\n              <div class="icon" (click)="cartPage()">\n\n                  <img src="assets/imgs/ic_my_cart.png">\n\n                  <ion-badge>{{cartTotal}}</ion-badge>\n\n              </div>\n\n          </span>\n\n      </ion-title>\n\n  </ion-navbar>\n\n  <ion-searchbar (ionInput)="getItems($event)" placeholder="{{ \'placeholder_search\' | translate }}" (click)="searchPage()"></ion-searchbar>\n\n  <ion-list>\n\n      <ion-item *ngFor="let item of items">\n\n      </ion-item>\n\n  </ion-list>\n\n  <div class="tab-row">\n\n    <ion-row>\n\n      <ion-col *ngFor="let cat of categoriesAll" (click)="categoryPage(cat)">\n\n        <div class="img-box" text-center>\n\n          <figure>\n\n            <img *ngIf="cat.image" data-src="{{cat.image.src}}">\n\n            <img *ngIf="!cat.image" src="assets/imgs/placeholder_cat.png">\n\n            <img *ngIf="cat.id == -1" src="assets/imgs/more.png">\n\n          </figure>\n\n          <small class="text-white">{{cat.name}}</small>\n\n        </div>\n\n      </ion-col>\n\n    </ion-row>\n\n  </div>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n  <ion-slides autoplay="2000" loop="true" pager *ngIf="banners && banners.length" dir="rtl">\n\n    <ion-slide *ngFor="let slide of banners">\n\n      <img [src]="slide.img_src" class="slide-image" (click)="categoryPage(slide.catObj)" />\n\n    </ion-slide>\n\n  </ion-slides>\n\n\n\n  <p>{{\'latest_products\' | translate}}</p>\n\n  <div *ngIf="!loadingShown && (!productsAll || !productsAll.length)" style="position:relative; min-height: 148px;">\n\n    <div class="empty_placeholder">\n\n      <img src="assets/imgs/no_products.png">\n\n      <p>{{\'no_items\' | translate}}</p>\n\n    </div>\n\n  </div>\n\n  <ion-list>\n\n    <ion-row *ngFor="let products of productsAll">\n\n      <ion-col *ngFor="let pro of products">\n\n        <ion-card>\n\n          <ion-card-header>\n\n            <div *ngIf="pro.images && pro.images.length" class="img-box" (click)="itemdetailPage(pro)">\n\n              <img data-src="{{pro.images[0].src}}">\n\n            </div>\n\n            <div *ngIf="!pro.images || !pro.images.length" class="img-box" (click)="itemdetailPage(pro)">\n\n              <img src="assets/imgs/suit_PNG8132.png">\n\n            </div>\n\n            <ion-icon *ngIf="pro.favorite" name="ios-heart" class="text-light icon" (click)="toggleFavorite(pro)"></ion-icon>\n\n            <ion-icon *ngIf="!pro.favorite" name="ios-heart-outline" class="text-light icon" (click)="toggleFavorite(pro)"></ion-icon>\n\n          </ion-card-header>\n\n          <ion-card-content (click)="itemdetailPage(pro)">\n\n            <span class="text-white bg-green small-text">{{pro.average_rating}}<ion-icon name="md-star"></ion-icon></span>\n\n            <h5 class="text-black ">{{pro.name}}</h5>\n\n            <div class="rateing">\n\n              <div class="card-btn">\n\n                <div float-right>\n\n                  <div *ngIf="pro.type ==\'simple\'" class="price text-sky" [innerHTML]="pro.sale_price_html"\n\n                      style="float: right;">\n\n                  </div>\n\n                  <div *ngIf="pro.type ==\'variable\'" class="price text-sky d-flex" [innerHTML]="pro.price_html"\n\n                      style="float: right;">\n\n                  </div>\n\n                  <div *ngIf="pro.type ==\'simple\' && pro.regular_price!=pro.sale_price" class="price text-light mr-5" [innerHTML]="pro.regular_price_html" style="float: right;">\n\n                  </div>\n\n                </div>\n\n              </div>\n\n            </div>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-list>\n\n  <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n    <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n  </ion-infinite-scroll>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\home\home.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_12__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_14__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 44:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BaseAppConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var APP_CONFIG = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* InjectionToken */]("app.config");
var BaseAppConfig = {
    appName: "MOBIMALL",
    apiBase: "https://toyshome.store/wp-json/",
    perPage: "5",
    consumerKey: "ck_c7498361087e75fc7e5d257351c856425e1c52da",
    consumerSecret: "cs_9ca3b4e58933ab633536fd88e783ae63e74d6795",
    adminUsername: "",
    adminPassword: "",
    oneSignalAppId: "",
    oneSignalGPSenderId: "",
    paypalSandbox: "",
    paypalProduction: "",
    payuSalt: "",
    payuKey: "",
    availableLanguages: [{
            code: 'en',
            name: 'English'
        }, {
            code: 'ar',
            name: 'Arabic'
        }, {
            code: 'es',
            name: 'Spanish'
        }, {
            code: 'pt',
            name: 'Portuguese'
        }],
    firebaseConfig: {
        webApplicationId: "867575699626-5i6i67tfvjv7sdr72piq08hlab4tokdj.apps.googleusercontent.com",
        apiKey: "AIzaSyBTyVjBW7_kYS2RytcbE8Al6GXQ-YqMF3s",
        authDomain: "digitaldoctor-697b7.firebaseapp.com",
        databaseURL: "https://digitaldoctor-697b7.firebaseio.com",
        projectId: "digitaldoctor-697b7",
        storageBucket: "digitaldoctor-697b7.appspot.com",
        messagingSenderId: "867575699626"
    },
};
//# sourceMappingURL=app.config.js.map

/***/ }),

/***/ 471:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Category; });
var Category = /** @class */ (function () {
    function Category() {
    }
    return Category;
}());

//# sourceMappingURL=category.models.js.map

/***/ }),

/***/ 472:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_onesignal__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_login_login__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_category_category__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_wishlist_wishlist__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_my_account_my_account__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_myorder_2_myorder_2__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_addressselect_addressselect__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_help_help__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_review_review__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__models_auth_credential_models__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__app_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_mysplash_mysplash__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_globalization__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__node_modules_ngx_translate_core__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ionic_native_device__ = __webpack_require__(298);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
























var MyApp = /** @class */ (function () {
    function MyApp(config, globalization, device, translate, modalCtrl, events, alertCtrl, service, platform, statusBar, splashScreen, oneSignal) {
        var _this = this;
        this.config = config;
        this.globalization = globalization;
        this.device = device;
        this.translate = translate;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.service = service;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.oneSignal = oneSignal;
        this.subscriptions = [];
        this.rootPage = __WEBPACK_IMPORTED_MODULE_20__pages_mysplash_mysplash__["a" /* MySplashPage */];
        this.pageCategory = 1;
        this.categoriesAll = new Array();
        this.rtlSide = "left";
        var superAuth = "";
        // window.localStorage.clear();
        // window.localStorage.removeItem(Constants.USER_KEY);
        if (config.apiBase && config.apiBase.startsWith('https') && config.consumerKey && config.consumerKey.length && config.consumerSecret && config.consumerSecret.length) {
            superAuth = ("Basic " + btoa(config.consumerKey + ":" + config.consumerSecret));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].ADMIN_API_KEY, superAuth);
            this.onSuperAuthSetup(superAuth);
        }
        else if (config.apiBase && config.apiBase.startsWith('http:') && config.adminUsername && config.adminUsername.length && config.adminPassword && config.adminPassword.length) {
            var subscription = service.getAuthToken(new __WEBPACK_IMPORTED_MODULE_17__models_auth_credential_models__["a" /* AuthCredential */](config.adminUsername, config.adminPassword)).subscribe(function (data) {
                var authResponse = data;
                superAuth = ("Bearer " + authResponse.token);
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].ADMIN_API_KEY, superAuth);
                _this.onSuperAuthSetup(superAuth);
            }, function (err) {
                console.log('auth setup error');
            });
            this.subscriptions.push(subscription);
        }
        else {
            console.log('auth setup error');
        }
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].USER_KEY));
        this.initializeApp();
        this.listenToLoginEvents();
    }
    MyApp.prototype.onSuperAuthSetup = function (superAuth) {
        console.log('auth setup success: ' + superAuth);
        this.loadCurrency();
        this.loadParentCategories();
        this.loadPaymentGateways();
        //this.loadShippingLines();
    };
    MyApp.prototype.listenToLoginEvents = function () {
        var _this = this;
        this.events.subscribe('user:login', function () {
            _this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].USER_KEY));
        });
    };
    MyApp.prototype.loadCurrency = function () {
        var savedCurrency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].CURRENCY));
        if (!savedCurrency) {
            var subscription = this.service.currencies(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
                var currency = data;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].CURRENCY, JSON.stringify(currency));
                console.log('currency setup success');
            }, function (err) {
                console.log('currency setup error');
            });
            this.subscriptions.push(subscription);
        }
    };
    MyApp.prototype.loadShippingLines = function () {
        var subscription = this.service.shippingLines(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var shippingLines = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].SHIPPING_LINES, JSON.stringify(shippingLines));
            console.log('shippingLines setup success');
        }, function (err) {
            console.log('categories setup error');
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.loadPaymentGateways = function () {
        var subscription = this.service.paymentGateways(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var paymentGateway = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].PAYMENT_GATEWAYS, JSON.stringify(paymentGateway));
            console.log('payment-gateway setup success');
        }, function (err) {
            console.log('categories setup error');
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.loadParentCategories = function () {
        var _this = this;
        var subscription = this.service.categoriesParent(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var categories = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES_PARENT, JSON.stringify(categories));
            console.log('categories setup success');
            _this.events.publish('category:setup');
        }, function (err) {
            console.log('categories setup error');
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            __WEBPACK_IMPORTED_MODULE_5_firebase___default.a.initializeApp({
                apiKey: _this.config.firebaseConfig.apiKey,
                authDomain: _this.config.firebaseConfig.authDomain,
                databaseURL: _this.config.firebaseConfig.databaseURL,
                projectId: _this.config.firebaseConfig.projectId,
                storageBucket: _this.config.firebaseConfig.storageBucket,
                messagingSenderId: _this.config.firebaseConfig.messagingSenderId
            });
            if (_this.platform.is('cordova')) {
                _this.initOneSignal();
            }
            _this.globalize();
        });
    };
    MyApp.prototype.globalize = function () {
        var _this = this;
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en');
        console.log("globalaizing...");
        if (this.platform.is('cordova')) {
            this.initOneSignal();
            console.log("cordova detected");
            this.globalization.getPreferredLanguage().then(function (result) {
                console.log("language detected:----" + JSON.stringify(result));
                var suitableLang = _this.getSuitableLanguage(result.value);
                console.log(suitableLang);
                _this.translate.use(suitableLang);
                _this.setDirectionAccordingly(suitableLang);
            }).catch(function (e) {
                console.log(e);
                _this.translate.use('en');
                _this.setDirectionAccordingly('en');
            });
        }
        else {
            console.log("cordova not detected");
            this.translate.use('en');
            this.setDirectionAccordingly('en');
        }
    };
    MyApp.prototype.setDirectionAccordingly = function (lang) {
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
    };
    MyApp.prototype.getSideOfCurLang = function () {
        this.rtlSide = this.platform.dir() === 'rtl' ? "right" : "left";
        return this.rtlSide;
    };
    MyApp.prototype.getSuitableLanguage = function (language) {
        language = language.substring(0, 2).toLowerCase();
        console.log('check for: ' + language);
        return this.config.availableLanguages.some(function (x) { return x.code == language; }) ? language : 'en';
    };
    MyApp.prototype.initOneSignal = function () {
        var _this = this;
        if (this.config.oneSignalAppId && this.config.oneSignalAppId.length && this.config.oneSignalGPSenderId && this.config.oneSignalGPSenderId.length) {
            this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
            this.oneSignal.handleNotificationReceived().subscribe(function (data) {
                // do something when notification is received
                console.log(data);
            });
            this.oneSignal.handleNotificationOpened().subscribe(function (data) {
                if (data.notification.payload
                    && data.notification.payload.additionalData) {
                    _this.myorder_1Page();
                }
            });
            this.oneSignal.endInit();
            this.oneSignal.getIds().then(function (id) {
                if (id.userId) {
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].ONESIGNAL_PLAYER_ID, id.userId.toString());
                }
            });
        }
    };
    MyApp.prototype.addressPage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_12__pages_addressselect_addressselect__["a" /* AddressSelectPage */]);
    };
    MyApp.prototype.myorder_1Page = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_11__pages_myorder_2_myorder_2__["a" /* Myorder_2Page */]);
    };
    MyApp.prototype.myorder_2Page = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_11__pages_myorder_2_myorder_2__["a" /* Myorder_2Page */]);
    };
    MyApp.prototype.my_accountPage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_my_account_my_account__["a" /* My_accountPage */]);
    };
    MyApp.prototype.categoryPage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_8__pages_category_category__["a" /* CategoryPage */]);
    };
    MyApp.prototype.homePage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */]);
    };
    MyApp.prototype.reviewPage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_15__pages_review_review__["a" /* ReviewPage */]);
    };
    MyApp.prototype.wishlistPage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_9__pages_wishlist_wishlist__["a" /* WishlistPage */]);
    };
    MyApp.prototype.cartPage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_14__pages_cart_cart__["a" /* CartPage */]);
    };
    MyApp.prototype.helpPage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_13__pages_help_help__["a" /* HelpPage */]);
    };
    MyApp.prototype.categoriesPage = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_8__pages_category_category__["a" /* CategoryPage */]);
    };
    MyApp.prototype.actionNavHeader = function () {
        if (this.user) {
            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_my_account_my_account__["a" /* My_accountPage */]);
        }
        else {
            this.nav.push(__WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */]);
        }
    };
    MyApp.prototype.phonenumberPage = function () {
        var _this = this;
        this.translate.get(['logout', 'logout_message', 'no', 'yes']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['logout'],
                message: text['logout_message'],
                buttons: [{
                        text: text['no'],
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: text['yes'],
                        handler: function () {
                            _this.user = null;
                            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_18__models_constants_models__["a" /* Constants */].USER_KEY, null);
                            _this.homePage();
                        }
                    }]
            });
            alert.present();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\DevIT\Mobimall\src\app\app.html"*/'<ion-menu [side]="rtlSide" [content]="content">\n\n  <ion-header>\n\n    <ion-toolbar>\n\n      <ion-list>\n\n        <ion-item menuClose (click)="actionNavHeader()">\n\n          <ion-avatar item-start>\n\n            <img src="assets/imgs/icon.png">\n\n          </ion-avatar>\n\n          <h2 *ngIf="user">{{\'hey\' | translate}} {{user.first_name}}\n\n            <ion-icon name="ios-arrow-forward"></ion-icon>\n\n          </h2>\n\n          <h2 *ngIf="!user">{{\'hey\' | translate}} {{\'guest\' | translate}}\n\n            <ion-icon name="ios-arrow-forward"></ion-icon>\n\n          </h2>\n\n          <p *ngIf="user">{{user.email}}</p>\n\n        </ion-item>\n\n      </ion-list>\n\n    </ion-toolbar>\n\n    <div *ngIf="user" class="menu-tabs" padding text-center>\n\n      <ion-row>\n\n        <ion-col menuClose (click)="myorder_1Page()">\n\n          <img item-start src="assets/imgs/my_order.png">\n\n          <p>{{\'my_orders\' | translate}}</p>\n\n        </ion-col>\n\n        <!-- <ion-col col-4 menuClose (click)="my_accountPage()">\n\n            <img src="assets/imgs/my-card.png">\n\n            <p>My Card</p>\n\n        </ion-col> -->\n\n        <ion-col menuClose (click)="addressPage()">\n\n          <img item-start src="assets/imgs/my_location.png">\n\n          <p>{{\'my_address\' | translate}}</p>\n\n        </ion-col>\n\n      </ion-row>\n\n    </div>\n\n  </ion-header>\n\n  <ion-content>\n\n    <div class="menu-title">\n\n      <ion-list>\n\n        <button ion-item menuClose (click)="homePage()">\n\n          <img item-start src="assets/imgs/ic_home.png ">\n\n          {{\'home\' | translate}}\n\n        </button>\n\n        <button ion-item menuClose (click)="categoriesPage()">\n\n          <img item-start src="assets/imgs/ic_categories.png ">\n\n          {{\'categories\' | translate}}\n\n        </button>\n\n        <!--\n\n        <button ion-item menuClose (click)="myorder_2Page()">\n\n            <img item-start src="assets/imgs/ic_my_cart.png ">\n\n                My Cart\n\n        </button>\n\n        -->\n\n        <button ion-item menuClose (click)="wishlistPage()">\n\n          <img item-start src="assets/imgs/ic_my_wishlist.png ">\n\n          {{\'my_wishes\' | translate}}\n\n        </button>\n\n        <button *ngIf="user" ion-item menuClose (click)="my_accountPage()">\n\n          <img item-start src="assets/imgs/ic_my_account.png ">\n\n          {{\'My Account\' | translate}}\n\n        </button>\n\n        <button ion-item menuClose (click)="helpPage()">\n\n          <img item-start src="assets/imgs/ic_help.png ">\n\n          {{\'help_center\' | translate}}\n\n        </button>\n\n        <button *ngIf="user" ion-item menuClose (click)="phonenumberPage()">\n\n          <img item-start src="assets/imgs/ic_logout.png ">\n\n          {{\'logout\' | translate}}\n\n        </button>\n\n        <!--\n\n        <button ion-item menuClose (click)="reviewPage()">\n\n          <img src="assets/imgs/ic_more.png ">\n\n                Add Reviews\n\n        </button>\n\n        -->\n\n      </ion-list>\n\n    </div>\n\n  </ion-content>\n\n</ion-menu>\n\n\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n\n<ion-nav [root]="rootPage " [class]="deviceModel" #content swipeBackEnabled="false" type="overlay"></ion-nav>'/*ion-inline-end:"C:\DevIT\Mobimall\src\app\app.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_16__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_19__app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_21__ionic_native_globalization__["a" /* Globalization */], __WEBPACK_IMPORTED_MODULE_23__ionic_native_device__["a" /* Device */],
            __WEBPACK_IMPORTED_MODULE_22__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_16__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_onesignal__["a" /* OneSignal */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 473:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VerificationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__createaccount_createaccount__ = __webpack_require__(153);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var VerificationPage = /** @class */ (function () {
    function VerificationPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    VerificationPage.prototype.createaccountPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__createaccount_createaccount__["a" /* CreateaccountPage */]);
    };
    VerificationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-verification ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\verification\verification.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n      <ion-icon class="menu-icon"><img src="assets/imgs/ic_menu.png"></ion-icon>\n\n    </button>\n\n        <ion-title>Verification Code</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n    <div class="form" padding-left padding-right>\n\n        <p text-center>Please enter Verification code <br>sent on +91 903 335 6708</p>\n\n        <ion-list>\n\n            <ion-item>\n\n                <ion-label>Verification code</ion-label>\n\n                <ion-input type="text" text-right value="______"></ion-input>\n\n            </ion-item>\n\n        </ion-list>\n\n        <button ion-button full class="bg-thime btn-round btn-text" (click)="createaccountPage()">Verify</button>\n\n        <p text-center>\n\n            <span float-left class="text-sky">Resend</span>\n\n            <span float-right>1:32 min left</span>\n\n        </p>\n\n    </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\verification\verification.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */]])
    ], VerificationPage);
    return VerificationPage;
}());

//# sourceMappingURL=verification.js.map

/***/ }),

/***/ 474:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Myorder_1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cart_cart__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var Myorder_1Page = /** @class */ (function () {
    function Myorder_1Page(navCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
    }
    Myorder_1Page.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    Myorder_1Page.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    Myorder_1Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-myorder_1 ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\myorder_1\myorder_1.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n      <ion-icon class="menu-icon"><img src="assets/imgs/ic_menu.png"></ion-icon>\n\n    </button>\n\n        <ion-title>My Order\n\n            <span float-right> \n\n               <ion-icon class="icon" (click)="searchPage()"><img src="assets/imgs/ic_search.png" width="100%;"></ion-icon>\n\n              <ion-icon class="icon" (click)="cartPage()"><img src="assets/imgs/ic_my_cart.png" width="100%;"></ion-icon>            \n\n            </span>\n\n        </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <ion-card class="border-bottom-none border" style="position: relative;">\n\n        <ion-card-header>\n\n            <p class="left-side">\n\n                <span class="text-light">Ordered ID</span> 2513254112\n\n                <br>\n\n                <span class="text-light">Placed on</span> 17-march-17\n\n            </p>\n\n            <p class="right-side text-sky">\n\n                Cancel Order\n\n            </p>\n\n        </ion-card-header>\n\n        <ion-card-content>\n\n            <ion-row>\n\n                <ion-col col-7>\n\n                    <h4>Unique For Men Black Formal Slim Fit Shirt</h4>\n\n                    <small><span class="text-light">Quantity:</span> 1</small>\n\n                    <p>\n\n                        <img src="assets/imgs/rupee-black.png"> 380\n\n                        <small class="text-light">via COD</small>\n\n                    </p>\n\n                    <small><span class="text-light">Tracking Status on</span> 15-March\'17</small>\n\n                    <button ion-button full class="bg-green btn-round  btn-text">Reached Hub,US  <ion-icon name="ios-arrow-down-outline"></ion-icon></button>\n\n                </ion-col>\n\n                <ion-col col-5>\n\n                    <div class="img-box">\n\n                        <img src="assets/imgs/shirt-2.jpg">\n\n                    </div>\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n    <div class="order-info border-top-none border">\n\n        <div class="order-container">\n\n            <div class="status active">\n\n                <p padding-left padding-right>Order<br>Placed</p>\n\n                <ion-icon name="md-radio-button-on"></ion-icon>\n\n                <p style="color: #555">12:05pm<br>12 May 17</p>\n\n            </div>\n\n            <div class="status active">\n\n                <p>\n\n                    Dispatched<br>from Bangalore\n\n                </p>\n\n                <ion-icon name="md-radio-button-on"></ion-icon>\n\n                <p style="color: #555">12:05pm<br>12 May 17</p>\n\n            </div>\n\n            <div class="status active">\n\n                <p>\n\n                    Reached Hub <br>New Delhi\n\n                </p>\n\n                <ion-icon name="md-radio-button-on"></ion-icon>\n\n                <p>12:05pm<br>12 May 17</p>\n\n            </div>\n\n            <div class="status">\n\n                <p>\n\n                    Out for<br>Delivery\n\n                </p>\n\n                <ion-icon name="md-radio-button-on"></ion-icon>\n\n                <p style="color: #555">12:05pm<br>12 May 17</p>\n\n            </div>\n\n            <div class="status">\n\n                <p>\n\n                    Item<br>Delivery\n\n                </p>\n\n                <ion-icon name="md-radio-button-on"></ion-icon>\n\n                <p style="color: #555">12:05pm<br>12 May 17</p>\n\n            </div>\n\n        </div>\n\n    </div>\n\n    <ion-card>\n\n        <ion-card-header>\n\n            <p class="left-side">\n\n                <span class="text-light">Ordered ID</span> 2513254112\n\n                <br>\n\n                <span class="text-light">Placed on</span> 17-march-17\n\n            </p>\n\n            <p class="right-side text-sky">\n\n                Return Product\n\n            </p>\n\n        </ion-card-header>\n\n        <ion-card-content>\n\n            <ion-row>\n\n                <ion-col col-7>\n\n                    <h4>Unique For Men Black Formal Slim Fit Shirt</h4>\n\n                    <small><span class="text-light">Quantity:</span> 1</small>\n\n                    <p>\n\n                        <img src="assets/imgs/rupee-black.png"> 880\n\n                        <small class="text-light">via Credit Card</small>\n\n                    </p>\n\n                    <small><span class="text-light">Delivered on </span> 05-May\'17</small>\n\n                    <button ion-button full class="bg-thime btn-round  btn-text">Rate Now<ion-icon name="ios-arrow-forward"></ion-icon></button>\n\n                </ion-col>\n\n                <ion-col col-5>\n\n                    <div class="img-box">\n\n                        <img src="assets/imgs/bag.jpg">\n\n                    </div>\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-card-content>\n\n    </ion-card>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\myorder_1\myorder_1.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */]])
    ], Myorder_1Page);
    return Myorder_1Page;
}());

//# sourceMappingURL=myorder_1.js.map

/***/ }),

/***/ 475:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhonenumberPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__password_password__ = __webpack_require__(152);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PhonenumberPage = /** @class */ (function () {
    function PhonenumberPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    PhonenumberPage.prototype.homePage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomePage */]);
    };
    PhonenumberPage.prototype.passwordPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__password_password__["a" /* PasswordPage */]);
    };
    PhonenumberPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-phonenumber ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\phonenumber\phonenumber.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>MOBIMALL\n            <span float-right (click)="homePage()">Skip</span>\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <p>Heart</p>\n    <div class="form" padding-left padding-right>\n        <p text-center>Please provide your Mobile number<br> to Login/Sign up on Mobimall</p>\n        <ion-list>\n            <ion-item>\n                <ion-label>Phone Number</ion-label>\n                <ion-input type="text" text-right value="+91 9876543210"></ion-input>\n            </ion-item>\n        </ion-list>\n        <button ion-button full class="bg-thime btn-round btn-text" (click)="passwordPage()">Continue</button>\n    </div>\n</ion-content>\n'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\phonenumber\phonenumber.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */]])
    ], PhonenumberPage);
    return PhonenumberPage;
}());

//# sourceMappingURL=phonenumber.js.map

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Global; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_cart_item_models__ = __webpack_require__(258);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Global = /** @class */ (function () {
    function Global() {
    }
    Global.prototype.decrementCartItem = function (pro) {
        this.checkCartItems();
        var decrement = false;
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].product_id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            if (this.cartItems[pos].quantity > 1) {
                this.cartItems[pos].quantity = this.cartItems[pos].quantity - 1;
                decrement = true;
            }
            else {
                this.cartItems.splice(pos, 1);
            }
            window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        }
        return decrement;
    };
    Global.prototype.incrementCartItem = function (pro) {
        this.checkCartItems();
        var increment = false;
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].product_id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
            increment = true;
            window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        }
        return increment;
    };
    Global.prototype.removeCartItem = function (pro) {
        this.checkCartItems();
        var removed = false;
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].product_id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems.splice(pos, 1);
            window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
            removed = true;
        }
        return removed;
    };
    Global.prototype.addCartItem = function (pro) {
        this.checkCartItems();
        var added = false;
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].product_id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
        }
        else {
            var cartItem = new __WEBPACK_IMPORTED_MODULE_1__models_cart_item_models__["a" /* CartItem */]();
            cartItem.product = pro;
            cartItem.product_id = pro.id;
            cartItem.quantity = 1;
            this.cartItems.push(cartItem);
            added = true;
        }
        console.log(this.cartItems);
        window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        return added;
    };
    Global.prototype.toggleFavorite = function (pro) {
        this.checkFavorites();
        var toggleResult = false;
        var pos = -1;
        for (var i = 0; i < this.favorites.length; i++) {
            if (pro.id == this.favorites[i].id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.favorites.splice(pos, 1);
            window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
            console.log('saving remove');
            toggleResult = false;
        }
        else {
            this.favorites.push(pro);
            window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
            console.log('saving save');
            toggleResult = true;
        }
        return toggleResult;
    };
    Global.prototype.removeFavorite = function (pro) {
        this.checkFavorites();
        var removed = false;
        var pos = -1;
        for (var i = 0; i < this.favorites.length; i++) {
            if (pro.id == this.favorites[i].id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.favorites.splice(pos, 1);
            window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
            removed = true;
        }
        return removed;
    };
    Global.prototype.isFavorite = function (pro) {
        this.checkFavorites();
        var fav = false;
        for (var _i = 0, _a = this.favorites; _i < _a.length; _i++) {
            var product = _a[_i];
            if (pro.id == product.id) {
                fav = true;
                break;
            }
        }
        return fav;
    };
    Global.prototype.addInSearchHistory = function (query) {
        this.checkSearchHistory();
        var index = this.searchHistory.indexOf(query);
        if (index == -1) {
            if (this.searchHistory.length == 5) {
                this.searchHistory.splice(0, 1);
            }
            this.searchHistory.push(query);
            window.localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    };
    Global.prototype.clearCart = function () {
        this.cartItems = new Array();
        window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    };
    Global.prototype.clearSearchHistory = function () {
        this.searchHistory = new Array();
        window.localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    };
    Global.prototype.checkCartItems = function () {
        if (this.cartItems == null) {
            var cartItems = JSON.parse(window.localStorage.getItem('cartItems'));
            if (cartItems != null) {
                this.cartItems = cartItems;
            }
            else {
                this.cartItems = new Array();
            }
        }
    };
    Global.prototype.checkFavorites = function () {
        if (this.favorites == null) {
            var favProducts = JSON.parse(window.localStorage.getItem('favoriteProducts'));
            if (favProducts != null) {
                this.favorites = favProducts;
            }
            else {
                this.favorites = new Array();
            }
        }
    };
    Global.prototype.checkSearchHistory = function () {
        if (this.searchHistory == null) {
            var history_1 = JSON.parse(window.localStorage.getItem('searchHistory'));
            if (history_1 != null) {
                this.searchHistory = history_1;
            }
            else {
                this.searchHistory = new Array();
            }
        }
    };
    Global.prototype.refreshCartItems = function () {
        var cartItems = JSON.parse(window.localStorage.getItem('cartItems'));
        if (cartItems != null) {
            this.cartItems = cartItems;
        }
        else {
            this.cartItems = new Array();
        }
    };
    Global.prototype.getSearchHistory = function () {
        this.checkSearchHistory();
        return this.searchHistory;
    };
    Global.prototype.getFavorites = function () {
        this.checkFavorites();
        return this.favorites;
    };
    Global.prototype.getCartItems = function () {
        this.checkCartItems();
        return this.cartItems;
    };
    Global.prototype.getCartItemsCount = function () {
        var cartItems = JSON.parse(window.localStorage.getItem('cartItems'));
        if (cartItems != null) {
            this.cartItems = cartItems;
        }
        else {
            this.cartItems = new Array();
        }
        return this.cartItems.length;
    };
    Global = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], Global);
    return Global;
}());

//# sourceMappingURL=global.js.map

/***/ }),

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemdetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shippining_shippining__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_social_sharing__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__login_login__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__shirts_shirts__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__category_category__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ionic_img_viewer__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var ItemdetailPage = /** @class */ (function () {
    function ItemdetailPage(translate, socialSharing, navCtrl, imageViewerCtrl, toastCtrl, modalCtrl, global, navParams, service, loadingCtrl, alertCtrl) {
        this.translate = translate;
        this.socialSharing = socialSharing;
        this.navCtrl = navCtrl;
        this.imageViewerCtrl = imageViewerCtrl;
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.global = global;
        this.navParams = navParams;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingShown = false;
        this.subscriptions = [];
        this.details = false;
        this.productsResponse = new Array();
        this.productVariations = new Array();
        this.cartTotal = 0;
        this.product = this.navParams.get('pro');
        if (this.product) {
            this.product.favorite = global.isFavorite(this.product);
            var productsResponse = this.navParams.get('pros');
            if (productsResponse && productsResponse.length) {
                for (var i = productsResponse.length - 1; i >= 0; i--) {
                    if (productsResponse[i].id != this.product.id) {
                        productsResponse[i].favorite = global.isFavorite(productsResponse[i]);
                        this.productsResponse.push(productsResponse[i]);
                    }
                }
            }
            if (this.product.images && this.product.images.length) {
                this.imageToDisplay = this.product.images[0].src;
            }
            this.loadReviews();
            if (this.product.type == 'variable') {
                this.loadVariations();
            }
        }
        else {
            this.loadProductById(this.navParams.get('pro_id'));
        }
    }
    ItemdetailPage_1 = ItemdetailPage;
    ItemdetailPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    ItemdetailPage.prototype.ionViewDidEnter = function () {
        this.cartTotal = Number(this.global.getCartItemsCount());
    };
    ItemdetailPage.prototype.loadProductById = function (proId) {
        var _this = this;
        this.translate.get('loading_products').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Loading products');
        var subscription = this.service.productById(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), proId).subscribe(function (data) {
            _this.product = data;
            _this.product.favorite = _this.global.isFavorite(_this.product);
            if (_this.product.images && _this.product.images.length) {
                _this.imageToDisplay = _this.product.images[0].src;
            }
            if (!_this.currencyText) {
                var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].CURRENCY));
                if (currency) {
                    _this.currencyText = currency.value;
                    var iconText = currency.options[currency.value];
                    _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                }
            }
            if (!_this.product.sale_price) {
                _this.product.sale_price = _this.product.regular_price;
            }
            if (_this.currencyIcon) {
                _this.product.regular_price_html = _this.currencyIcon + ' ' + _this.product.regular_price;
                _this.product.sale_price_html = _this.currencyIcon + ' ' + _this.product.sale_price;
            }
            else if (_this.currencyText) {
                _this.product.regular_price_html = _this.currencyText + ' ' + _this.product.regular_price;
                _this.product.sale_price_html = _this.currencyText + ' ' + _this.product.sale_price;
            }
            _this.loadReviews();
            if (_this.product.type == 'variable') {
                _this.loadVariations();
            }
            _this.dismissLoading();
        }, function (err) {
        });
        this.subscriptions.push(subscription);
    };
    ItemdetailPage.prototype.loadVariations = function () {
        var _this = this;
        this.translate.get('loading_versions').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Loading variations');
        var subscription = this.service.productVariations(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.product.id).subscribe(function (data) {
            var variations = data;
            for (var _i = 0, variations_1 = variations; _i < variations_1.length; _i++) {
                var vari = variations_1[_i];
                var variAttris = '';
                for (var i = 0; i < vari.attributes.length; i++) {
                    var attri = vari.attributes[i].name + ' ' + vari.attributes[i].option + (i < vari.attributes.length - 1 ? ', ' : '');
                    variAttris = variAttris + attri;
                }
                vari.name = _this.product.name + ' - ' + variAttris;
                vari.type = 'variable';
                vari.images = new Array();
                vari.images.push(vari.image);
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!vari.sale_price) {
                    vari.sale_price = vari.regular_price;
                }
                if (_this.currencyIcon) {
                    vari.regular_price_html = _this.currencyIcon + ' ' + vari.regular_price;
                    vari.sale_price_html = _this.currencyIcon + ' ' + vari.sale_price;
                }
                else if (_this.currencyText) {
                    vari.regular_price_html = _this.currencyText + ' ' + vari.regular_price;
                    vari.sale_price_html = _this.currencyText + ' ' + vari.sale_price;
                }
            }
            _this.productVariations = variations;
            _this.dismissLoading();
        }, function (err) {
        });
        this.subscriptions.push(subscription);
    };
    ItemdetailPage.prototype.showImage = function (src) {
        this.imageToDisplay = src;
    };
    ItemdetailPage.prototype.presentImage = function (myImage) {
        var imageViewer = this.imageViewerCtrl.create(myImage);
        imageViewer.present();
    };
    ItemdetailPage.prototype.loadReviews = function () {
        var _this = this;
        var subscription = this.service.productsReviews(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.product.id).subscribe(function (data) {
            var reviews = data;
            var approved = new Array();
            for (var _i = 0, reviews_1 = reviews; _i < reviews_1.length; _i++) {
                var rev = reviews_1[_i];
                if (rev.verified) {
                    approved.push(rev);
                }
            }
            _this.reviews = approved;
        }, function (err) {
        });
        this.subscriptions.push(subscription);
    };
    ItemdetailPage.prototype.viewMoreSimilar = function () {
        var cat = this.product && this.product.categories.length ? this.product.categories[0] : null;
        if (cat && cat.id != '-1') {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__shirts_shirts__["a" /* ShirtsPage */], { cat: cat });
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__category_category__["a" /* CategoryPage */]);
        }
    };
    ItemdetailPage.prototype.itemdetailPage = function (pro) {
        this.navCtrl.push(ItemdetailPage_1, { pro: pro, pros: this.productsResponse });
    };
    ItemdetailPage.prototype.viewMore = function () {
        this.details = true;
    };
    ItemdetailPage.prototype.viewLess = function () {
        this.details = false;
    };
    ItemdetailPage.prototype.toggleFavorite = function (pro) {
        pro.favorite = this.global.toggleFavorite(pro);
    };
    ItemdetailPage.prototype.shareProduct = function (pro) {
        this.socialSharing.share('Found this product on Mobimall', pro.name, null, pro.permalink).then(function (data) {
            console.log(data);
        }).catch(function (err) {
            console.log(err);
        });
    };
    ItemdetailPage.prototype.addVariation = function (variation) {
        var _this = this;
        if (variation.in_stock && variation.purchasable) {
            var added = this.global.addCartItem(variation);
            if (added) {
                this.cartTotal = this.cartTotal + 1;
            }
            this.translate.get(added ? 'card_update1' : 'card_update2').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast(added ? 'Added in cart' : 'Updated in cart');
        }
        else {
            this.translate.get("item_empty").subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    ItemdetailPage.prototype.buyVariation = function (variation) {
        var _this = this;
        var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].USER_KEY));
        if (user != null) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__shippining_shippining__["a" /* ShippiningPage */], { pro: variation });
        }
        else {
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].TEMP_OPEN, __WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].TEMP_OPEN_PRODUCT);
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].TEMP_OPEN_PRODUCT, JSON.stringify(variation));
            this.translate.get("no_sign_in").subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Sign in to continue');
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__login_login__["a" /* LoginPage */]);
        }
    };
    ItemdetailPage.prototype.addToCart = function () {
        var _this = this;
        if (this.product.in_stock && this.product.purchasable) {
            var added = this.global.addCartItem(this.product);
            if (added) {
                this.cartTotal = this.cartTotal + 1;
            }
            this.translate.get(added ? 'card_update1' : 'card_update2').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else {
            this.translate.get("item_empty").subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    ItemdetailPage.prototype.buyNow = function () {
        var _this = this;
        var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].USER_KEY));
        if (user != null) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__shippining_shippining__["a" /* ShippiningPage */], { pro: this.product });
        }
        else {
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].TEMP_OPEN, __WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].TEMP_OPEN_PRODUCT);
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].TEMP_OPEN_PRODUCT, JSON.stringify(this.product));
            this.translate.get("no_sign_in").subscribe(function (value) {
                _this.showToast(value);
            });
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__login_login__["a" /* LoginPage */]);
        }
    };
    ItemdetailPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ItemdetailPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ItemdetailPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    ItemdetailPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ItemdetailPage.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    ItemdetailPage.prototype.cartPage = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__cart_cart__["a" /* CartPage */]);
        modal.onDidDismiss(function () {
            _this.cartTotal = Number(_this.global.getCartItemsCount());
        });
        modal.present();
    };
    ItemdetailPage = ItemdetailPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-itemdetail ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\itemdetail\itemdetail.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon class="menu-icon">\n\n                <img src="assets/imgs/ic_menu.png">\n\n            </ion-icon>\n\n        </button>\n\n        <ion-title class="text-white" *ngIf="product">{{product.categories[0].name}}\n\n            <span float-right>\n\n                <ion-icon class="icon" (click)="cartPage()">\n\n                    <img src="assets/imgs/ic_my_cart.png" width="100%;">\n\n                    <ion-badge>{{cartTotal}}</ion-badge>\n\n                </ion-icon>\n\n            </span>\n\n        </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <!--<select size & color>-->\n\n    <div *ngIf="product" class="img-section shadow-bottom" text-center>\n\n        <figure class="img-box">\n\n            <img *ngIf="imageToDisplay" data-src="{{imageToDisplay}}" #myImage (click)="presentImage(myImage)" />\n\n            <img *ngIf="!imageToDisplay" src="assets/imgs/item-img.png">\n\n        </figure>\n\n\n\n        <div *ngIf="product.images && product.images.length" class="tab-btn-box">\n\n            <div class="tab-btn">\n\n                <img data-src="{{product.images[0].src}}" (click)="showImage(product.images[0].src)">\n\n            </div>\n\n            <div *ngIf="product.images.length > 1" class="tab-btn">\n\n                <img data-src="{{product.images[1].src}}" (click)="showImage(product.images[1].src)">\n\n            </div>\n\n            <div *ngIf="product.images.length > 2" class="tab-btn">\n\n                <img data-src="{{product.images[2].src}}" (click)="showImage(product.images[2].src)">\n\n            </div>\n\n            <!--\n\n  			<div *ngIf="product.images.length > 3" class="tab-btn">\n\n                  <img data-src="{{product.images[3].src}}" (click)="showImage(product.images[3].src)">\n\n              </div>\n\n  			-->\n\n        </div>\n\n        <div class="d-flex" style="align-items: start;">\n\n            <span>{{product.name}}</span>\n\n            <span class="icon">\n\n                <ion-icon name="share-alt" (click)="shareProduct(product)"></ion-icon>\n\n                <ion-icon *ngIf="product.favorite" name="ios-heart" class="text-light icon" (click)="toggleFavorite(product)"></ion-icon>\n\n                <ion-icon *ngIf="!product.favorite" name="ios-heart-outline" class="text-light icon" (click)="toggleFavorite(product)"></ion-icon>\n\n            </span>\n\n        </div>\n\n        <div class="card-btn">\n\n            <div class="d-flex" style="padding: 1rem">\n\n                <div style="margin-right:  auto;">\n\n                    <small class="text-white bg-green" float-left>{{product.average_rating}}\n\n                        <ion-icon name="md-star"></ion-icon>\n\n                    </small>\n\n                    <span *ngIf="product.rating_count > 0" class="text-sky small-text ">Read all\n\n                        {{product.rating_count}} Review</span>\n\n                </div>\n\n                <div style="width: 70%;" float-right>\n\n                    <div *ngIf="product.type==\'simple\'" class="price text-sky" [innerHTML]="product.sale_price_html" style="float: right;"></div>\n\n                    <div *ngIf="product.type==\'simple\'&&product.regular_price!=product.sale_price" class="price text-light mr-5" [innerHTML]="product.regular_price_html"\n\n                        style="float: right;">\n\n                        <!-- <img src="assets/imgs/rupee-light.png" class="rupee-icon">{{pro.regular_price}} -->\n\n                    </div>\n\n                    <div *ngIf="product.type==\'variable\'" class="price text-sky" [innerHTML]="product.price_html" style="float: right;">\n\n                        <!-- <img src="assets/imgs/rupee-sky.png" class="rupee-icon">{{pro.sale_price}} -->\n\n                    </div>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n\n\n\n    <!-- Variations start -->\n\n    <div *ngIf="productVariations && productVariations.length" class="your-items">\n\n        <ion-card-header>\n\n            <p no-margin> {{\'product_versions\' | translate}}</p>\n\n        </ion-card-header>\n\n        <ion-card-content *ngFor="let item of productVariations">\n\n            <ion-row>\n\n                <ion-col col-3>\n\n                    <div *ngIf="item.images && item.images.length" class="img-box">\n\n                        <img data-src="{{item.images[0].src}}">\n\n                    </div>\n\n                    <div *ngIf="!item.images || !item.images.length" class="img-box">\n\n                        <img src="assets/imgs/suit_PNG8132.png">\n\n                    </div>\n\n                </ion-col>\n\n                <ion-col col-9>\n\n                    <h4>{{item.name}}</h4>\n\n                    <div class="rate">\n\n                        <div style="display: flex;" class="price-box">\n\n                            <div *ngIf="item.regular_price != item.sale_price" class="price text-light" padding-right\n\n                                [innerHTML]="item.regular_price_html">\n\n                            </div>\n\n                            <div class="price text-sky" [innerHTML]="item.sale_price_html">\n\n                            </div>\n\n                        </div>\n\n                        <p text-right class="card-bottom text-black">\n\n                            <button ion-button class="small button btn-round bg-green" text-right (click)="buyVariation(item)">{{\'buy\' | translate}}</button>\n\n                        </p>\n\n                    </div>\n\n                    <p class="card-bottom">\n\n                        <button ion-button class="small button btn-round" text-right (click)="addVariation(item)"> {{\'add_cart\' | translate}}</button>\n\n                    </p>\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-card-content>\n\n    </div>\n\n    <!-- Variations end -->\n\n\n\n    <!--    <Key features>-->\n\n    <div *ngIf="product" class="features bg-white shadow-bottom" padding>\n\n        <h6 class="heading text-black">{{\'description\' | translate}}</h6>\n\n        <div *ngIf="!details" [innerHTML]="product.short_description"></div>\n\n        <div *ngIf="details" [innerHTML]="product.description"></div>\n\n        <span *ngIf="!details" text-right class="text-sky" (click)="viewMore()">{{\'view\' | translate}}\n\n            <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n\n        </span>\n\n        <span class="text-sky more_less" *ngIf="details" text-right (click)="viewLess()">{{\'View less\' | translate}}\n\n            <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n\n        </span>\n\n    </div>\n\n\n\n    <div *ngIf="reviews && reviews.length" class="reating-review bg-white" padding>\n\n        <div class="lick">\n\n            <div *ngFor="let review of reviews">\n\n                <p padding-top>\n\n                    <span class="left-side">\n\n                        <ion-badge class="badges bg-green text-white">{{review.rating}}\n\n                            <ion-icon name="md-star"></ion-icon>\n\n                        </ion-badge>\n\n                        <span class="bold">{{review.name}}</span>\n\n                    </span>\n\n                    <span class="right-side">\n\n                        <span class="text-light">{{review.date_created}}</span>\n\n                    </span>\n\n                </p>\n\n\n\n                <h5 class="text-black" style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">\n\n                    {{review.review}}\n\n                </h5>\n\n            </div>\n\n            <h4 class="text-sky" text-right>\n\n                {{\'read_reviews\' | translate}}\n\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n\n            </h4>\n\n            <div class="btn review text-sky">{{\'write_own_review\' | translate}}</div>\n\n        </div>\n\n    </div>\n\n    <!--    <reating & review end>-->\n\n\n\n    <!--    <similar Products>-->\n\n    <div *ngIf="productsResponse && productsResponse.length" class="products" padding-top>\n\n        <h6 class="heading">{{\'similar_products\' | translate}}\n\n            <span text-right class="text-sky" (click)="viewMoreSimilar()">{{\'view\' | translate}}\n\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n\n            </span>\n\n        </h6>\n\n        <ion-scroll scrollX="true" style="height:220px;white-space: nowrap;">\n\n            <ion-card *ngFor="let pro of productsResponse" class="products-item">\n\n                <ion-card-header>\n\n                    <div *ngIf="pro.images && pro.images.length" class="img-box" (click)="itemdetailPage(pro)">\n\n                        <img data-src="{{pro.images[0].src}}">\n\n                    </div>\n\n                    <div *ngIf="pro.images == null || pro.images.length == 0" class="img-box" (click)="itemdetailPage(pro)">\n\n                        <img src="assets/imgs/suit_PNG8132.png">\n\n                    </div>\n\n                    <ion-icon *ngIf="pro.favorite" name="ios-heart" class="text-light icon" (click)="toggleFavorite(pro)"></ion-icon>\n\n                    <ion-icon *ngIf="!pro.favorite" name="ios-heart-outline" class="text-light icon" (click)="toggleFavorite(pro)"></ion-icon>\n\n                </ion-card-header>\n\n                <ion-card-content>\n\n                    <h5 class="text-black">{{pro.name}}</h5>\n\n                    <div class="rateing">\n\n                        <div class="card-bottom">\n\n                            <p class="" float-left>\n\n                                <span class="text-white bg-green small-text">{{pro.average_rating}}\n\n                                    <ion-icon name="md-star"></ion-icon>\n\n                                </span>\n\n                                <span class="text-light bold"> ({{pro.rating_count}})</span>\n\n                            </p>\n\n                            <div class="d-flex" float-right>\n\n                                <div *ngIf="pro.type ==\'simple\' && pro.regular_price!=pro.sale_price" class="price text-light mr-5"\n\n                                    [innerHTML]="pro.regular_price_html"></div>\n\n                                <div *ngIf="pro.type ==\'simple\'" class="price text-sky" [innerHTML]="pro.sale_price_html"></div>\n\n                                <div *ngIf="pro.type ==\'variable\'" class="price text-sky" [innerHTML]="pro.price_html"></div>\n\n                            </div>\n\n                        </div>\n\n                    </div>\n\n                </ion-card-content>\n\n            </ion-card>\n\n        </ion-scroll>\n\n    </div>\n\n    <!--    <similar Products end>-->\n\n    <div *ngIf="product && product.type==\'simple\'" style="height: 56px;"></div>\n\n    <div *ngIf="product && product.type==\'simple\'" class="receipt btn-fisx-bottom">\n\n      <ion-row>\n\n          <ion-col>\n\n              <button ion-button full class="btn-round green-shadow btn-text" style="background: #fff;color: #4dd711;text-transform: capitalize;"\n\n                  (click)="addToCart()">{{\'add_cart\' | translate}}</button>\n\n          </ion-col>\n\n          <ion-col>\n\n              <button ion-button full class="bg-green btn-round green-shadow btn-text" (click)="buyNow()" style="text-transform: capitalize;">{{\'buy\' | translate}}</button>\n\n          </ion-col>\n\n      </ion-row>\n\n    </div>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\itemdetail\itemdetail.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_2__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_13__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_social_sharing__["a" /* SocialSharing */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_12_ionic_img_viewer__["a" /* ImageViewerController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_2__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ItemdetailPage);
    return ItemdetailPage;
    var ItemdetailPage_1;
}());

//# sourceMappingURL=itemdetail.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WishlistPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__itemdetail_itemdetail__ = __webpack_require__(55);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var WishlistPage = /** @class */ (function () {
    function WishlistPage(navCtrl, modalCtrl, global) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.global = global;
        this.productsAll = new Array();
        this.favorites = new Array();
        this.favorites = global.getFavorites();
        this.listFavorites();
    }
    WishlistPage.prototype.listFavorites = function () {
        var proSplit = new Array();
        var productsAll = new Array();
        for (var _i = 0, _a = this.favorites; _i < _a.length; _i++) {
            var pro = _a[_i];
            if (proSplit.length == 2) {
                productsAll.push(proSplit);
                proSplit = new Array();
            }
            pro.favorite = true;
            proSplit.push(pro);
        }
        if (proSplit.length > 0) {
            productsAll.push(proSplit);
        }
        this.productsAll = productsAll;
    };
    WishlistPage.prototype.toggleFavorite = function (pro) {
        pro.favorite = this.global.toggleFavorite(pro);
        this.listFavorites();
    };
    WishlistPage.prototype.itemdetailPage = function (pro) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__itemdetail_itemdetail__["a" /* ItemdetailPage */], { pro: pro, pros: this.favorites });
    };
    WishlistPage.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    WishlistPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-wishlist ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\wishlist\wishlist.html"*/'<ion-header class="bg-thime">\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon class="menu-icon">\n\n                <img src="assets/imgs/ic_menu.png">\n\n            </ion-icon>\n\n        </button>\n\n        <ion-title>{{"my_wishes" | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <div class="empty_placeholder" *ngIf="!favorites.length">\n\n        <img src="assets/imgs/no_products.png">\n\n        <p>{{"no_favorites_added" | translate}}</p>\n\n    </div>\n\n\n\n    <ion-list>\n\n        <ion-row *ngFor="let products of productsAll">\n\n            <ion-col *ngFor="let pro of products">\n\n                <ion-card>\n\n                    <ion-card-header>\n\n                        <div *ngIf="pro.images && pro.images.length" class="img-box" (click)="itemdetailPage(pro)">\n\n                            <img data-src="{{pro.images[0].src}}">\n\n                        </div>\n\n                        <div *ngIf="pro.images == null || pro.images.length == 0" class="img-box" (click)="itemdetailPage(pro)">\n\n                            <img src="assets/imgs/suit_PNG8132.png">\n\n                        </div>\n\n                        <ion-icon *ngIf="pro.favorite" name="ios-heart" class="text-light icon" (click)="toggleFavorite(pro)"></ion-icon>\n\n                        <ion-icon *ngIf="!pro.favorite" name="ios-heart-outline" class="text-light icon" (click)="toggleFavorite(pro)"></ion-icon>\n\n                    </ion-card-header>\n\n                    <ion-card-content (click)="itemdetailPage(pro)">\n\n                        <h5 class="text-black">{{pro.name}}</h5>\n\n                        <div class="rateing">\n\n                            <div class="card-btn">\n\n                                <p class="" float-left>\n\n                                    <span class="text-white bg-green small-text">{{pro.average_rating}}\n\n                                        <ion-icon name="md-star"></ion-icon>\n\n                                    </span>\n\n                                    <span class="text-light bold"> ({{pro.rating_count}})</span>\n\n                                </p>\n\n                                <div style="width: 70%;" float-right>\n\n                                    <div *ngIf="pro.type ==\'simple\'" class="price text-sky" [innerHTML]="pro.sale_price_html"\n\n                                        style="float: right;">\n\n                                        <!-- <img src="assets/imgs/rupee-sky.png" class="rupee-icon">{{pro.sale_price}} -->\n\n                                    </div>\n\n                                    <div *ngIf="pro.type ==\'variable\'" class="price text-sky d-flex" [innerHTML]="pro.price_html"\n\n                                        style="float: right;">\n\n                                        <!-- <img src="assets/imgs/rupee-sky.png" class="rupee-icon">{{pro.sale_price}} -->\n\n                                    </div>\n\n                                    <div *ngIf="pro.type ==\'simple\' && pro.regular_price!=pro.sale_price" class="price text-light mr-5"\n\n                                        [innerHTML]="pro.regular_price_html" style="float: right;">\n\n                                        <!-- <img src="assets/imgs/rupee-light.png" class="rupee-icon">{{pro.regular_price}} -->\n\n                                    </div>\n\n                                </div>\n\n                            </div>\n\n                        </div>\n\n                    </ion-card-content>\n\n                </ion-card>\n\n            </ion-col>\n\n        </ion-row>\n\n    </ion-list>\n\n\n\n    <!-- <ion-card *ngFor="let fav of favorites">\n\n        <ion-card-content>\n\n            <ion-row>\n\n                <ion-col col-3>\n\n                    <div *ngIf="fav.images && fav.images.length" class="img-box" (click)="itemdetailPage(pro)">\n\n                        <img data-src="{{fav.images[0].src}}">\n\n                    </div>\n\n                    <div *ngIf="fav.images == null || fav.images.length == 0" class="img-box" (click)="itemdetailPage(pro)">\n\n                        <img src="assets/imgs/suit_PNG8132.png">\n\n                    </div>\n\n                </ion-col>\n\n                <ion-col col-9>\n\n                    <h4>{{fav.name}}\n\n                        <span class="icon text-light">\n\n                            <img src="assets/imgs/delete.png" (click)="removeFavorite(pro)">\n\n                        </span>\n\n                    </h4>\n\n                    <div class="rateing">\n\n                        <p class=text-light>{{fav.categories[0].name}}</p>\n\n                        <div class="card-btn" padding-top>\n\n                            <div class="">\n\n                                <div float-left>\n\n                                    <small class="text-white bg-green" float-left>{{fav.average_rating}}\n\n                                        <ion-icon name="md-star"></ion-icon>\n\n                                    </small>\n\n                                    <span class="text-light small-text">({{fav.rating_count}} reviews)</span>\n\n                                </div>\n\n                                <div style="display: flex;" float-right>\n\n                                    <div class="price text-light mr-5" [innerHTML]="fav.regular_price_html">\n\n    </div>\n\n    <div class="price text-sky" [innerHTML]="fav.sale_price_html">\n\n    </div>\n\n    </div>\n\n    </div>\n\n    </div>\n\n    </div>\n\n    </ion-col>\n\n    </ion-row>\n\n    </ion-card-content>\n\n    </ion-card> -->\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\wishlist\wishlist.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]])
    ], WishlistPage);
    return WishlistPage;
}());

//# sourceMappingURL=wishlist.js.map

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shirts_shirts__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CategoryPage = /** @class */ (function () {
    function CategoryPage(translate, navCtrl, modalCtrl, service, toastCtrl) {
        var _this = this;
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.service = service;
        this.toastCtrl = toastCtrl;
        this.categoriesAllNew = new Array();
        this.subscriptions = [];
        this.pageCategory = 1;
        var categoriesAll = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES));
        this.setupCategories(categoriesAll);
        // this.showToast('Refreshing . . .');
        this.translate.get('refreshing').subscribe(function (value) {
            _this.showToast(value);
            _this.refreshCategories();
        });
    }
    CategoryPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    CategoryPage.prototype.refreshCategories = function () {
        var _this = this;
        var subscription = this.service.categories(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.pageCategory)).subscribe(function (data) {
            var categories = data;
            if (categories.length == 0) {
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES, JSON.stringify(_this.categoriesAllNew));
                console.log('categories setup success');
                _this.setupCategories(_this.categoriesAllNew);
            }
            else {
                _this.categoriesAllNew = _this.categoriesAllNew.concat(categories);
                _this.pageCategory++;
                _this.refreshCategories();
            }
        }, function (err) {
            console.log('categories setup error');
        });
        this.subscriptions.push(subscription);
    };
    CategoryPage.prototype.setupCategories = function (savedCats) {
        var catsToShow = new Array();
        var parentWithChild;
        if (savedCats && savedCats.length) {
            for (var _i = 0, savedCats_1 = savedCats; _i < savedCats_1.length; _i++) {
                var catP = savedCats_1[_i];
                if (Number(catP.parent) == 0) {
                    parentWithChild = new Array();
                    for (var _a = 0, savedCats_2 = savedCats; _a < savedCats_2.length; _a++) {
                        var catC = savedCats_2[_a];
                        if (Number(catP.id) == Number(catC.parent)) {
                            parentWithChild.push(catC);
                        }
                    }
                    if (parentWithChild.length == 0) {
                        continue;
                    }
                    parentWithChild.unshift(catP);
                    catsToShow.push(parentWithChild);
                }
            }
        }
        this.categoriesAll = catsToShow;
    };
    CategoryPage.prototype.shirtsPage = function (cat) {
        if (cat.id != '-1') {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__shirts_shirts__["a" /* ShirtsPage */], { cat: cat });
        }
    };
    CategoryPage.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    CategoryPage.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    CategoryPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CategoryPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-category ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\category\category.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon class="menu-icon">\n\n                <img src="assets/imgs/ic_menu.png" style="width: 100%">\n\n            </ion-icon>\n\n        </button>\n\n        <ion-title>{{\'categories\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <div *ngFor="let cats of categoriesAll" class="man-fashion">\n\n        <ion-row>\n\n            <ion-col col-6 (click)="shirtsPage(cats[0])">\n\n                <figure>\n\n                    <img *ngIf="cats[0].image != null" data-src="{{cats[0].image.src}}">\n\n                    <img *ngIf="cats[0].image == null" src="assets/imgs/man-fashion.png">\n\n                </figure>\n\n            </ion-col>\n\n            <ion-col col-6>\n\n                <h6 [innerHTML]="cats[0].name" class="text-white" (click)="shirtsPage(cats[0])"></h6>\n\n                <div style="height: 150px;overflow: hidden;overflow-y: auto">\n\n                    <div *ngFor="let cat of cats">\n\n                        <p *ngIf="cat.parent != 0" class="text-white" (click)="shirtsPage(cat)">{{cat.name}}\n\n                            <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                        </p>\n\n                    </div>\n\n                </div>\n\n            </ion-col>\n\n        </ion-row>\n\n    </div>\n\n\n\n    <!--\n\n\n\n    <div class="girl-fashion">\n\n        <ion-row>\n\n            <ion-col col-6>\n\n                <img src="assets/imgs/girl-fashion.png">\n\n            </ion-col>\n\n            <ion-col col-6>\n\n                <h6 class="text-white">WOMEN\'S FASHION</h6>\n\n                <p class="text-white">Western Wear\n\n                    <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                </p>\n\n                <p class="text-white">Sarees\n\n                    <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                </p>\n\n                <p class="text-white">Kurtis\n\n                    <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                </p>\n\n                <p class="text-white">Lingerie\n\n                    <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                </p>\n\n            </ion-col>\n\n        </ion-row>\n\n    </div>\n\n\n\n    <div class="kids-fashion">\n\n        <ion-row>\n\n            <ion-col col-6>\n\n                <img src="assets/imgs/kid-fashion.png">\n\n            </ion-col>\n\n            <ion-col col-6>\n\n                <h6 class="text-white">KIDS\'S FASHION</h6>\n\n                <p class="text-white">Boy\'s Wear\n\n                    <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                </p>\n\n                <p class="text-white">Girl\'s Wear\n\n                    <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                </p>\n\n                <p class="text-white">Baby Wear\n\n                    <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                </p>\n\n                <p class="text-white">Baby Girl\n\n                    <ion-icon name="ios-arrow-forward-outline" text-right class="icon"></ion-icon>\n\n                </p>\n\n            </ion-col>\n\n        </ion-row>\n\n    </div>\n\n	-->\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\category\category.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */]])
    ], CategoryPage);
    return CategoryPage;
}());

//# sourceMappingURL=category.js.map

/***/ }),

/***/ 79:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShippiningPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__payment_payment__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__code_code__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__addressselect_addressselect__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_cart_item_models__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var ShippiningPage = /** @class */ (function () {
    function ShippiningPage(translate, modalCtrl, navCtrl, navParams, global, toastCtrl) {
        this.translate = translate;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.global = global;
        this.toastCtrl = toastCtrl;
        this.editMainCart = false;
        this.total = 0;
        this.total_items = 0;
        this.total_items_html = '0';
        this.total_html = '0';
        this.deliveryPayble = '0';
        this.couponAmount = '0';
        this.addressChangeText = 'Change';
        this.currencyIcon = '';
        this.currencyText = '';
        var product = this.navParams.get('pro');
        if (product == null) {
            this.cartItems = global.getCartItems();
            this.editMainCart = true;
        }
        else {
            var cartItems = new Array();
            var cartItem = new __WEBPACK_IMPORTED_MODULE_7__models_cart_item_models__["a" /* CartItem */]();
            cartItem.product = product;
            cartItem.product_id = product.id;
            cartItem.quantity = 1;
            cartItems.push(cartItem);
            this.cartItems = cartItems;
        }
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
        }
        this.deliveryPayble = this.currencyIcon + ' ' + this.deliveryPayble;
        this.calculateTotal();
        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
    }
    ShippiningPage.prototype.ionViewDidEnter = function () {
        this.selectedAddress = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS));
        this.addressChangeText = this.selectedAddress == null ? 'Add' : 'Change';
    };
    ShippiningPage.prototype.addressPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__addressselect_addressselect__["a" /* AddressSelectPage */], { action: 'choose' });
    };
    ShippiningPage.prototype.removeItem = function (product) {
        if (this.editMainCart) {
            this.global.removeCartItem(product);
            this.cartItems = this.global.getCartItems();
            this.calculateTotal();
        }
        else {
            var pos = -1;
            for (var i = 0; i < this.cartItems.length; i++) {
                if (product.id == this.cartItems[i].product_id) {
                    pos = i;
                    break;
                }
            }
            if (pos != -1) {
                this.cartItems.splice(pos, 1);
                this.cartItems = this.cartItems;
            }
        }
        if (this.cartItems.length == 0) {
            this.navCtrl.pop();
        }
    };
    ShippiningPage.prototype.decrementItem = function (product) {
        if (this.editMainCart) {
            var decremented = this.global.decrementCartItem(product);
            if (!decremented) {
                this.cartItems = this.global.getCartItems();
                this.calculateTotal();
            }
            else {
                this.total_items_html = this.currencyIcon + ' ' + (this.total - Number(product.sale_price));
            }
        }
        else {
            var pos = -1;
            for (var i = 0; i < this.cartItems.length; i++) {
                if (product.id == this.cartItems[i].product_id) {
                    pos = i;
                    break;
                }
            }
            if (pos != -1) {
                if (this.cartItems[pos].quantity > 1) {
                    this.cartItems[pos].quantity = this.cartItems[pos].quantity - 1;
                    this.cartItems = this.cartItems;
                }
                else {
                    this.cartItems.splice(pos, 1);
                    this.cartItems = this.cartItems;
                }
                this.calculateTotal();
            }
        }
        if (this.cartItems.length == 0) {
            this.navCtrl.pop();
        }
    };
    ShippiningPage.prototype.incrementItem = function (product) {
        if (this.editMainCart) {
            var incremented = this.global.incrementCartItem(product);
            if (incremented) {
                this.calculateTotal();
            }
        }
        else {
            var pos = -1;
            for (var i = 0; i < this.cartItems.length; i++) {
                if (product.id == this.cartItems[i].product_id) {
                    pos = i;
                    break;
                }
            }
            if (pos != -1) {
                this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
                this.cartItems = this.cartItems;
                this.calculateTotal();
            }
        }
    };
    ShippiningPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ShippiningPage.prototype.calculateTotal = function () {
        var sum = 0;
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var item = _a[_i];
            sum = sum + Number(item.product.sale_price) * item.quantity;
        }
        this.total_items = sum;
        this.total = (sum - (this.coupon ? this.coupon.discount_type == 'percent' ? (sum * Number(this.coupon.amount) / 100) : Number(this.coupon.amount) : 0));
        this.total_items_html = this.currencyIcon + ' ' + this.total_items;
        this.total_html = this.currencyIcon + ' ' + this.total;
    };
    ShippiningPage.prototype.paymentPage = function () {
        var _this = this;
        if (this.selectedAddress == null) {
            this.translate.get('field_error_address').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Please select an address.');
        }
        else {
            if (!this.coupon) {
                window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
            }
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__payment_payment__["a" /* PaymentPage */], { cart: this.cartItems, totalItems: this.total_items, total: this.total });
        }
    };
    ShippiningPage.prototype.removeCoupon = function () {
        this.coupon = null;
        this.calculateTotal();
        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
    };
    ShippiningPage.prototype.codePage = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__code_code__["a" /* CodePage */]);
        modal.onDidDismiss(function () {
            var coupon = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].SELECTED_COUPON));
            if (coupon) {
                if (coupon.discount_type == 'fixed_product') {
                    var allowed = false;
                    for (var _i = 0, _a = coupon.product_ids; _i < _a.length; _i++) {
                        var itemCA = _a[_i];
                        for (var _b = 0, _c = _this.cartItems; _b < _c.length; _b++) {
                            var item = _c[_b];
                            if (itemCA == Number(item.product_id)) {
                                allowed = true;
                                break;
                            }
                        }
                        if (allowed) {
                            break;
                        }
                    }
                    if (allowed) {
                        _this.coupon = coupon;
                        _this.couponAmount = _this.currencyIcon + ' ' + _this.coupon.amount + (_this.coupon.discount_type == 'percent' ? '%' : '');
                        _this.calculateTotal();
                    }
                }
                else {
                    _this.coupon = coupon;
                    _this.couponAmount = _this.currencyIcon + ' ' + _this.coupon.amount + (_this.coupon.discount_type == 'percent' ? '%' : '');
                    _this.calculateTotal();
                }
            }
        });
        modal.present();
    };
    ShippiningPage.prototype.goBack = function () {
        this.navCtrl.pop();
    };
    ShippiningPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-shippining ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\shippining\shippining.html"*/'<ion-header>\n\n    <ion-navbar hideBackButton="true">\n\n        <button style="background-color:transparent;" ion-button class="back" (click)="goBack()">\n\n            <ion-icon style="color: #ffffff !important; font-size:2.4rem;" name="md-arrow-back"></ion-icon>\n\n        </button>\n\n        <ion-title>{{"confirm_order" | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <div class="address-section">\n\n        <ion-row text-center class="status">\n\n            <ion-col class="complate">\n\n                <ion-icon name="ios-checkmark-circle"></ion-icon>\n\n                <span>{{"login" | translate}}</span>\n\n            </ion-col>\n\n            <ion-col class="processing">\n\n                <ion-icon name="md-radio-button-off"></ion-icon>\n\n                <span>{{"shipping" | translate}}</span>\n\n            </ion-col>\n\n            <ion-col class="panding">\n\n                <ion-icon name="ion-record"></ion-icon>\n\n                <span>{{"payment" | translate}}</span>\n\n            </ion-col>\n\n        </ion-row>\n\n        <ion-card>\n\n            <ion-card-header>\n\n                <p>\n\n                    {{"your_dlvr_address" | translate}}\n\n                    <span class="text-sky" (click)="addressPage()">{{addressChangeText | translate}}\n\n                        <ion-icon name="ios-arrow-forward" class="icon"></ion-icon>\n\n                    </span>\n\n                </p>\n\n            </ion-card-header>\n\n            <ion-card-content *ngIf="!selectedAddress">\n\n                <div class="addres-detail">\n\n                    <h3>\n\n                        <ion-icon name="ios-pin-outline" class="icon-position"></ion-icon>{{"No address selected" | translate}}\n\n                    </h3>\n\n                    <p>{{"Add an address to continue." | translate}}</p>\n\n                </div>\n\n            </ion-card-content>\n\n            <ion-card-content *ngIf="selectedAddress">\n\n                <div class="addres-detail">\n\n                    <h3>\n\n                        <ion-icon name="ios-pin-outline" class="icon-position"></ion-icon>{{selectedAddress.first_name}}\n\n                    </h3>\n\n                    <p>{{selectedAddress.address_1}}, {{selectedAddress.address_2}}\n\n                        <br> {{selectedAddress.city}}</p>\n\n                    <p>{{selectedAddress.phone}}</p>\n\n                </div>\n\n            </ion-card-content>\n\n        </ion-card>\n\n    </div>\n\n    <div class="your-items">\n\n        <ion-card *ngIf="cartItems && cartItems.length">\n\n            <ion-card-header>\n\n                <p>{{"YOUR ITEMS" | translate}}</p>\n\n            </ion-card-header>\n\n            <ion-card-content *ngFor="let item of cartItems">\n\n                <ion-row>\n\n                    <ion-col col-3>\n\n                        <div *ngIf="item.product.images && item.product.images.length" class="img-box">\n\n                            <img data-src="{{item.product.images[0].src}}">\n\n                        </div>\n\n                        <div *ngIf="!item.product.images || !item.product.images.length" class="img-box">\n\n                            <img src="assets/imgs/suit_PNG8132.png">\n\n                        </div>\n\n                    </ion-col>\n\n                    <ion-col col-9>\n\n                        <h4>{{item.product.name}}</h4>\n\n                        <div class="rate">\n\n                            <div style="display: flex;" class="price-box">\n\n                                <div class="price text-light" padding-right [innerHTML]="item.product.regular_price_html">\n\n                                </div>\n\n                                <div class="price text-sky" [innerHTML]="item.product.sale_price_html">\n\n                                </div>\n\n                            </div>\n\n                            <p text-right>\n\n                                <span class="">\n\n                                    <ion-icon name="ios-add" (click)="incrementItem(item.product)"></ion-icon>\n\n                                    {{item.quantity}}\n\n                                    <ion-icon name="ios-remove" (click)="decrementItem(item.product)"></ion-icon>\n\n                                </span>\n\n                            </p>\n\n                        </div>\n\n                        <p class="card-bottom" padding-top>\n\n                            <span class="text-sky small" text-right (click)="removeItem(item.product)"> {{"Remove" | translate}}</span>\n\n                        </p>\n\n                    </ion-col>\n\n                </ion-row>\n\n            </ion-card-content>\n\n        </ion-card>\n\n    </div>\n\n    <div class="spacebar-bottom"></div>\n\n    <div class="receipt btn-fisx-bottom">\n\n        <ion-card>\n\n            <ion-card-header>\n\n                <p>{{"item_price" | translate}}\n\n                    <span text-right [innerHTML]="total_items_html">\n\n                    </span>\n\n                </p>\n\n                <p>{{"dlvr_pybl" | translate}}\n\n                    <span text-right [innerHTML]="deliveryPayble">\n\n                    </span>\n\n                </p>\n\n                <p *ngIf="coupon">{{"coupon" | translate}} ({{coupon.code}}) {{"applied" | translate}}\n\n                    <span text-right [innerHTML]="couponAmount">\n\n                    </span>\n\n                    <ion-icon name="md-close" class="cross" (click)="removeCoupon()"></ion-icon>\n\n                </p>\n\n                <div *ngIf="!coupon" text-center class="text-sky" (click)="codePage()">{{"have_promo" | translate}}?</div>\n\n            </ion-card-header>\n\n            <ion-card-content>\n\n                <p>{{"amt_pybl" | translate}}\n\n                    <span text-right [innerHTML]="total_html">\n\n                    </span>\n\n                </p>\n\n                <button ion-button full class="bg-green btn-round green-shadow btn-text" (click)="paymentPage()" text-uppercase>{{"Continue" | translate}}</button>\n\n            </ion-card-content>\n\n        </ion-card>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\shippining\shippining.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_5__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_5__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */]])
    ], ShippiningPage);
    return ShippiningPage;
}());

//# sourceMappingURL=shippining.js.map

/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressSelectPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__address_address__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var AddressSelectPage = /** @class */ (function () {
    function AddressSelectPage(translate, navParams, navCtrl, modalCtrl, viewCtrl, toastCtrl, service, loadingCtrl) {
        this.translate = translate;
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.viewCtrl = viewCtrl;
        this.toastCtrl = toastCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.addresses = new Array();
        this.loadingShown = false;
        this.subscriptions = [];
        this.select = (navParams.get('action') != null);
    }
    AddressSelectPage.prototype.ionViewDidEnter = function () {
        var addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST));
        if (addresses != null) {
            this.addresses = addresses;
        }
    };
    AddressSelectPage.prototype.addressNew = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__address_address__["a" /* AddressPage */]);
    };
    AddressSelectPage.prototype.addressEditSelect = function (address) {
        var _this = this;
        if (this.select) {
            for (var _i = 0, _a = this.addresses; _i < _a.length; _i++) {
                var add = _a[_i];
                if (add.id == -100) {
                    add.id = address.id;
                    break;
                }
            }
            address.id = -100;
            var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY));
            user.billing = address;
            user.shipping = address;
            user.first_name = address.first_name;
            user.last_name = address.last_name;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(user));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS, JSON.stringify(address));
            this.translate.get('just_a_moment').subscribe(function (value) {
                _this.presentLoading(value);
            });
            var subscription = this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(user.id), user).subscribe(function (data) {
                _this.dismissLoading();
                _this.navCtrl.pop();
            }, function (err) {
                _this.dismissLoading();
                _this.navCtrl.pop();
            });
            this.subscriptions.push(subscription);
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__address_address__["a" /* AddressPage */], { address: address });
        }
    };
    AddressSelectPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    AddressSelectPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    AddressSelectPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    AddressSelectPage.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    AddressSelectPage.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    AddressSelectPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-addressselect ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\addressselect\addressselect.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon class="menu-icon">\n\n                <img src="assets/imgs/ic_menu.png">\n\n            </ion-icon>\n\n        </button>\n\n        <ion-title>{{\'my_address\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding class="bg-light">\n\n    <div class="address-section">\n\n        <p text-center padding-bottom margin-bottom>\n\n            {{\'my_address_heading\' | translate}}</p>\n\n        <ion-card>\n\n            <ion-card-content *ngIf="!addresses || !addresses.length">\n\n                <div class="addres-detail">\n\n                    <h3>\n\n                        <ion-icon name="ios-pin-outline" class="icon-position"></ion-icon>{{\'address_empty\' | translate}}\n\n                    </h3>\n\n                    <p>{{\'my_address_add_new\' | translate}}.</p>\n\n                </div>\n\n            </ion-card-content>\n\n            <ion-card-content *ngIf="addresses && addresses.length">\n\n                <div *ngFor="let address of addresses" class="addres-detail" (click)="addressEditSelect(address)">\n\n                    <h3>\n\n                        <ion-icon name="ios-pin-outline" class="icon-position"></ion-icon>{{address.first_name}}\n\n                    </h3>\n\n                    <p>{{address.address_1}}, {{address.address_2}}\n\n                        <br> {{address.city}}</p>\n\n                    <p>{{address.phone}}</p>\n\n                </div>\n\n            </ion-card-content>\n\n        </ion-card>\n\n\n\n    </div>\n\n    <ion-card>\n\n        <ion-card-content>\n\n            <div class="new-addres" (click)="addressNew()">\n\n                <h3>\n\n                    <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>{{\'my_address_add_new\' | translate}}\n\n                </h3>\n\n            </div>\n\n        </ion-card-content>\n\n    </ion-card>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\addressselect\addressselect.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */]])
    ], AddressSelectPage);
    return AddressSelectPage;
}());

//# sourceMappingURL=addressselect.js.map

/***/ }),

/***/ 83:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__phone_phone__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__password_password__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__createaccount_createaccount__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_auth_credential_models__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_register_request_models__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_app_config__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_firebase__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_facebook__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_google_plus__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};















var LoginPage = /** @class */ (function () {
    function LoginPage(config, translate, facebook, events, modalCtrl, toastCtrl, navCtrl, service, loadingCtrl, alertCtrl, google, platform) {
        this.config = config;
        this.translate = translate;
        this.facebook = facebook;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.google = google;
        this.platform = platform;
        this.loadingShown = false;
        this.authError = "";
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_9__models_register_request_models__["a" /* RegisterRequest */]('', '', '', '', '');
        this.subscriptions = [];
        this.credentials = new __WEBPACK_IMPORTED_MODULE_7__models_auth_credential_models__["a" /* AuthCredential */]('', '');
        this.registerRequestPasswordConfirm = '';
        this.buttonDisabled = true;
        this.token = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].ADMIN_API_KEY);
        if (this.userLoggedIn()) {
            navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */]);
        }
    }
    LoginPage.prototype.userLoggedIn = function () {
        var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_KEY));
        return user != null;
    };
    LoginPage.prototype.checkNumber = function () {
        var _this = this;
        var phone = JSON.parse(JSON.stringify(this.credentials.username));
        if (isNaN(phone)) {
            this.buttonDisabled = true;
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast("Phone number is not valid");
        }
        else if (phone.length > 10) {
            this.buttonDisabled = true;
            setTimeout(function () {
                phone = phone.slice(0, 10);
            }, 100);
        }
        else if (phone.length == 10 && phone != '' && !isNaN(phone) && this.credentials.password != '') {
            this.buttonDisabled = false;
        }
        else {
            this.buttonDisabled = true;
        }
        this.credentials.username = phone;
    };
    LoginPage.prototype.signIn = function () {
        var _this = this;
        this.authError = "";
        var phone = JSON.parse(JSON.stringify(this.registerRequest.username));
        if (isNaN(phone)) {
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast("Phone no. is not valid");
        }
        if (this.credentials.username.length == 0 || this.credentials.password.length == 0) {
            this.translate.get('login_box_empty').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Username or Password cannot be empty!');
        }
        else {
            this.translate.get('loging').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.presentLoading('Logging in');
            var subscription = this.service.getAuthToken(this.credentials).subscribe(function (data) {
                var authResponse = data;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
                _this.getUser(_this.getUserIdFromToken(authResponse.token));
            }, function (err) {
                _this.removeTempCart();
                _this.authError = err.error.message.replace('username', 'mobile no.');
                var pos = _this.authError.indexOf('<a');
                if (pos != -1) {
                    _this.authError = _this.authError.substr(0, pos) + '<a target="_blank" ' + _this.authError.substr(pos + 2, _this.authError.length - 1);
                }
                _this.dismissLoading();
                //this.presentErrorAlert("Unable to login with provided credentials");
            });
            this.subscriptions.push(subscription);
        }
    };
    LoginPage.prototype.loginFB = function () {
        var _this = this;
        this.translate.get('loging_fb').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Logging in Facebook');
        if (this.platform.is('cordova')) {
            this.fbOnPhone();
        }
        else {
            this.fbOnBrowser();
        }
    };
    LoginPage.prototype.loginGoogle = function () {
        var _this = this;
        this.translate.get('loging_google').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Logging in Google+');
        if (this.platform.is('cordova')) {
            this.googleOnPhone();
        }
        else {
            this.googleOnBrowser();
        }
    };
    LoginPage.prototype.googleOnPhone = function () {
        var _this = this;
        var provider = {
            'webClientId': this.config.firebaseConfig.webApplicationId,
            'offline': false,
            'scopes': 'profile email'
        };
        console.log("In cordova");
        console.log("Calling google in cordova");
        this.google.login(provider).then(function (res) {
            _this.dismissLoading();
            _this.translate.get('google_success_auth1').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Google signup success, authenticating with firebase');
            console.log('Google signup success, authenticating with firebase');
            var googleCredential = __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth.GoogleAuthProvider.credential(res.idToken);
            __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth().signInAndRetrieveDataWithCredential(googleCredential)
                .then(function (response) {
                _this.registerRequest.email = response.user.email;
                _this.registerRequest.first_name = _this.getNames(response.user.displayName).first_name;
                _this.registerRequest.last_name = _this.getNames(response.user.displayName).last_name;
                _this.dismissLoading();
                _this.translate.get('google_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                // this.presentLoading('Firebase authenticated google signup, creating user..');
                console.log('Firebase authenticated google signup, creating user..');
                _this.checkUser();
            }, function (err) {
                console.log("Error in firebase auth after google login:-- ", JSON.stringify(err));
                _this.dismissLoading();
                _this.presentErrorAlert('google login err: ' + err);
            });
        }, function (err) {
            console.log("Error: in google access:-- ", JSON.stringify(err));
            _this.dismissLoading();
            _this.presentErrorAlert('google login err: ' + err);
        });
    };
    LoginPage.prototype.getNames = function (displayName) {
        var obj = { first_name: '', last_name: '' };
        if (!displayName.length || displayName == "") {
            return obj;
        }
        var names = displayName.split(" ");
        obj.first_name = names[0];
        for (var i = 0; i < names.length; i++) {
            if (names[i] != obj.first_name && names[i] != "" && names[i].length > 0) {
                obj.last_name = names[i];
                break;
            }
        }
        return obj;
    };
    LoginPage.prototype.googleOnBrowser = function () {
        var _this = this;
        try {
            console.log("In not cordova");
            var provider = new __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth.GoogleAuthProvider();
            __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth().signInWithPopup(provider).then(function (result) {
                _this.registerRequest.email = result.user.email;
                _this.registerRequest.first_name = _this.getNames(result.user.displayName).first_name;
                _this.registerRequest.last_name = _this.getNames(result.user.displayName).last_name;
                console.log(_this.registerRequest);
                _this.dismissLoading();
                _this.translate.get('google_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                // this.presentLoading('Firebase authenticated google signup, creating user..');
                _this.checkUser();
                console.log(result);
            }).catch(function (error) {
                console.log(error);
                _this.dismissLoading();
            });
        }
        catch (err) {
            this.dismissLoading();
            console.log(err);
        }
    };
    LoginPage.prototype.fbOnPhone = function () {
        var _this = this;
        console.log("In cordova");
        this.facebook.login(["public_profile", 'email']).then(function (response) {
            _this.dismissLoading();
            _this.translate.get('fb_success_auth1').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Facebook signup success, authenticating with firebase');
            console.log('Facebook signup success, authenticating with firebase');
            console.log("fb response are:--" + JSON.stringify(response));
            var facebookCredential = __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
            console.log("fb response are:--" + JSON.stringify(facebookCredential));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_API_KEY, response.authResponse.accessToken);
            __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth().signInAndRetrieveDataWithCredential(facebookCredential)
                .then(function (success) {
                console.log("after firebase auth fb response are:--" + JSON.stringify(response));
                _this.registerRequest.email = success.user.email;
                _this.registerRequest.first_name = _this.getNames(success.user.displayName).first_name;
                _this.registerRequest.last_name = _this.getNames(success.user.displayName).last_name;
                _this.dismissLoading();
                _this.translate.get('fb_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                // this.presentLoading('Firebase authenticated Facebook login, creating user..');
                console.log('Firebase authenticated Facebook login, creating user..');
                _this.checkUser();
            }).catch(function (error) {
                console.log("Error in firebase auth after fb login" + JSON.stringify(error));
                _this.showToast("Error in Facebook login");
                _this.dismissLoading();
            });
        }).catch(function (error) {
            console.log("Error in fb login" + JSON.stringify(error));
            _this.showToast("Error in Facebook login");
            _this.dismissLoading();
        });
    };
    LoginPage.prototype.fbOnBrowser = function () {
        var _this = this;
        console.log("In not cordova");
        var provider = new __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        provider.addScope('user_friends');
        provider.addScope('email');
        provider.addScope('public_profile');
        __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth().signInWithPopup(provider)
            .then(function (result) {
            _this.registerRequest.email = result.user.email;
            _this.registerRequest.first_name = _this.getNames(result.user.displayName).first_name;
            _this.registerRequest.last_name = _this.getNames(result.user.displayName).last_name;
            _this.dismissLoading();
            _this.presentLoading('Firebase authenticated Facebook login, creating user..');
            _this.checkUser();
        }).catch(function (error) {
            console.log(error);
            _this.dismissLoading();
            _this.showToast("Facebook login unsuccessfull");
        });
    };
    LoginPage.prototype.checkUser = function () {
        this.dismissLoading();
        var component = this;
        component.translate.get('check_token').subscribe(function (value) {
            component.presentLoading(value);
        });
        //component.presentLoading("Getting the user token");
        console.log("Getting the user token");
        __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.auth().currentUser.getIdToken(false).then(function (idToken) {
            component.dismissLoading();
            component.translate.get('check_user').subscribe(function (value) {
                component.presentLoading(value);
            });
            // component.presentLoading("Checking the user");
            console.log("Checking the user");
            component.service.checkToken(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), idToken)
                .subscribe(function (data) {
                console.log("User exist:---");
                console.log(JSON.stringify(data));
                // user exists
                var authResponse = data;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
                component.dismissLoading();
                component.getUser(component.getUserIdFromToken(authResponse.token));
            }, function (err) {
                // if error code is 404, user not exists
                console.log("User not exist");
                component.dismissLoading();
                component.verifyPhone();
            });
        }).catch(function (error) {
            component.dismissLoading();
            console.log("error");
        });
    };
    LoginPage.prototype.verifyPhone = function () {
        var obj = JSON.parse(JSON.stringify(this.registerRequest));
        window.localStorage.setItem('userCreateData', JSON.stringify(obj));
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__phone_phone__["a" /* PhonePage */]);
    };
    LoginPage.prototype.getUser = function (userId) {
        var _this = this;
        this.translate.get('fetch_user').subscribe(function (value) {
            _this.presentLoading(value);
        });
        var subscription = this.service.getUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), userId).subscribe(function (data) {
            _this.dismissLoading();
            var userResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(userResponse));
            if (userResponse.billing && userResponse.billing.address_1 && userResponse.billing.address_1.length && userResponse.billing.address_2 && userResponse.billing.address_2.length) {
                userResponse.billing.id = -100;
                var addresses = new Array();
                addresses.push(userResponse.billing);
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS, JSON.stringify(userResponse.billing));
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST, JSON.stringify(addresses));
            }
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */]);
            _this.events.publish('user:login');
        }, function (err) {
            _this.removeTempCart();
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentErrorAlert("Unable to login with provided credentials");
        });
        this.subscriptions.push(subscription);
    };
    LoginPage.prototype.getUserIdFromToken = function (token) {
        var decodedString = window.atob(token.split(".")[1]);
        return JSON.parse(decodedString).data.user.id;
    };
    LoginPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    LoginPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    LoginPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    LoginPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    LoginPage.prototype.signupPage = function () {
        this.removeTempCart();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__createaccount_createaccount__["a" /* CreateaccountPage */]);
    };
    LoginPage.prototype.homePage = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */]);
    };
    LoginPage.prototype.passwordPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__password_password__["a" /* PasswordPage */]);
    };
    LoginPage.prototype.removeTempCart = function () {
        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].TEMP_OPEN);
        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].TEMP_OPEN_CART);
        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].TEMP_OPEN_PRODUCT);
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\login\login.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>\n\n      <p padding-start style="width:100%">{{"app_title" | translate}}</p>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div class="form bg-white" padding-left padding-right>\n\n    <p text-center padding-bottom margin-bottom>{{"Sign in to" | translate}} {{"app_title" | translate}}</p>\n\n    <ion-list>\n\n      <ion-item>\n\n        <ion-label>{{"phone" | translate}}</ion-label>\n\n        <ion-input type="tel" text-end placeholder="{{\'phone\' | translate}}" [(ngModel)]="credentials.username" (ngModelChange)="checkNumber($event)">\n\n        </ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>{{"password" | translate}}</ion-label>\n\n        <ion-input type="password" text-end placeholder="{{\'password\' | translate}}" [(ngModel)]="credentials.password"></ion-input>\n\n      </ion-item>\n\n    </ion-list>\n\n    <button ion-button full class="bg-thime btn-round btn-text" (click)="signIn()">{{"Continue" | translate}}</button>\n\n    <!-- <br> -->\n\n    <p text-center [innerHTML]="authError" style="margin-bottom:35px"></p>\n\n    <p text-center (click)="passwordPage()" style="margin-bottom:35px">\n\n      {{"forgot_password" | translate}}\n\n    </p>\n\n    <p text-center style="margin-bottom:15px">{{"or_continue_with" | translate}}</p>\n\n    <ion-grid>\n\n      <ion-row>\n\n        <ion-col col-6>\n\n          <button ion-button icon-left full class="btn-social btn-facebook" (click)="loginFB()">\n\n            <ion-icon class="icon">\n\n              <img src="assets/imgs/fb.png">\n\n            </ion-icon>\n\n            <span>{{"Facebook" | translate}}</span>\n\n          </button>\n\n        </ion-col>\n\n        <ion-col col-6>\n\n          <button ion-button full icon-left class="btn-social btn-google" (click)="loginGoogle()">\n\n            <ion-icon class="icon">\n\n              <img src="assets/imgs/google.png">\n\n            </ion-icon>\n\n            <span>{{"Google" | translate}}</span>\n\n          </button>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-grid>\n\n  </div>\n\n  <div class="btn-fisx-bottom">\n\n    <p text-center>{{"not_registered" | translate}}</p>\n\n    <button ion-button full class="bg-white btn-round text-sky btn-text" (click)="signupPage()">{{"register" | translate}}</button>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\login\login.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_10__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_14__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_12__ionic_native_facebook__["a" /* Facebook */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* Events */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["v" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_13__ionic_native_google_plus__["a" /* GooglePlus */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["u" /* Platform */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 84:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterRequest; });
var RegisterRequest = /** @class */ (function () {
    function RegisterRequest(email, username, password, firstname, lastname) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.roles = 'contributor';
        this.first_name = firstname;
        this.last_name = lastname;
    }
    return RegisterRequest;
}());

//# sourceMappingURL=register-request.models.js.map

/***/ }),

/***/ 85:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthCredential; });
var AuthCredential = /** @class */ (function () {
    function AuthCredential(username, password) {
        this.username = username;
        this.password = password;
    }
    return AuthCredential;
}());

//# sourceMappingURL=auth-credential.models.js.map

/***/ }),

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShirtsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__short_short__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__cart_cart__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__filter_filter__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__search_search__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__itemdetail_itemdetail__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__wishlist_wishlist__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_constants_models__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__node_modules_ngx_translate_core__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var ShirtsPage = /** @class */ (function () {
    function ShirtsPage(navParams, modalCtrl, global, toastCtrl, navCtrl, service, loadingCtrl, alertCtrl, translate) {
        var _this = this;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.global = global;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.subscriptions = [];
        this.productsAll = new Array();
        this.productsResponse = new Array();
        this.productsAllPage = 1;
        this.category = navParams.get('cat');
        this.loadProducts();
        this.translate.get('field_error_country').subscribe(function (value) {
            _this.showToast(value);
        });
        this.translate.get('loading_products').subscribe(function (value) {
            _this.presentLoading(value);
        });
    }
    ShirtsPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    ShirtsPage.prototype.loadProducts = function () {
        var _this = this;
        var subscription = this.service.productsByCategory(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.category.id, String(this.productsAllPage)).subscribe(function (data) {
            _this.dismissLoading();
            var products = data;
            _this.productsResponse = new Array();
            var proSplit = new Array();
            for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
                var pro = products_1[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                if (proSplit.length == 2) {
                    _this.productsAll.push(proSplit);
                    proSplit = new Array();
                }
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                pro.favorite = _this.global.isFavorite(pro);
                proSplit.push(pro);
                _this.productsResponse.push(pro);
            }
            if (proSplit.length > 0) {
                _this.productsAll.push(proSplit);
            }
            _this.productsAll = _this.productsAll;
        }, function (err) {
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    ShirtsPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.productsAllPage++;
        var subscription = this.service.productsByCategory(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.category.id, String(this.productsAllPage)).subscribe(function (data) {
            var products = data;
            var proSplit = new Array();
            for (var _i = 0, products_2 = products; _i < products_2.length; _i++) {
                var pro = products_2[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                if (proSplit.length == 2) {
                    _this.productsAll.push(proSplit);
                    proSplit = new Array();
                }
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                pro.favorite = _this.global.isFavorite(pro);
                proSplit.push(pro);
                _this.productsResponse.push(pro);
            }
            if (proSplit.length > 0) {
                _this.productsAll.push(proSplit);
            }
            infiniteScroll.complete();
        }, function (err) {
            infiniteScroll.complete();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    ShirtsPage.prototype.itemdetailPage = function (pro) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__itemdetail_itemdetail__["a" /* ItemdetailPage */], { pro: pro, pros: this.productsResponse });
    };
    ShirtsPage.prototype.toggleFavorite = function (pro) {
        pro.favorite = this.global.toggleFavorite(pro);
    };
    ShirtsPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ShirtsPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ShirtsPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    ShirtsPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ShirtsPage.prototype.sortPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__short_short__["a" /* ShortPage */]);
        modal.onDidDismiss(function () { });
        modal.present();
    };
    ShirtsPage.prototype.filterPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_6__filter_filter__["a" /* FilterPage */]);
        modal.present();
    };
    ShirtsPage.prototype.searchPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__search_search__["a" /* SearchPage */]);
        // let modal = this.modalCtrl.create(SearchPage);
        // modal.present();
    };
    ShirtsPage.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    ShirtsPage.prototype.wishlistPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__wishlist_wishlist__["a" /* WishlistPage */]);
    };
    ShirtsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-shirts ',template:/*ion-inline-start:"C:\DevIT\Mobimall\src\pages\shirts\shirts.html"*/'<ion-header class="bg-thime">\n\n    <ion-navbar>\n\n        <ion-title>\n\n            <p [innerHTML]="category.name"></p>\n\n            <span>\n\n                <ion-icon class="icon" (click)="wishlistPage()">\n\n                    <img src="assets/imgs/ic_my_wishlist.png" width="100%;">\n\n                </ion-icon>\n\n                <ion-icon class="icon" (click)="cartPage()">\n\n                    <img src="assets/imgs/ic_my_cart.png" width="100%;">\n\n                </ion-icon>\n\n            </span>\n\n        </ion-title>\n\n    </ion-navbar>\n\n    <div class="d-flex icon-box ">\n\n        <ion-searchbar (ionInput)="getItems($event)" placeholder="{{\'search_box\' | translate}}" (click)="searchPage()" style="margin-right: 7px;"></ion-searchbar>\n\n    </div>\n\n</ion-header>\n\n\n\n\n\n<ion-content class="bg-light">\n\n    <div class="empty_placeholder" *ngIf="!loadingShown && (!productsAll || !productsAll.length)">\n\n        <img src="assets/imgs/no_products.png">\n\n        <p>{{"no_items_cat" | translate}}</p>\n\n    </div>\n\n    <ion-list>\n\n        <ion-row *ngFor="let products of productsAll">\n\n            <ion-col *ngFor="let pro of products">\n\n                <ion-card>\n\n                    <ion-card-header>\n\n                        <div *ngIf="pro.images && pro.images.length" class="img-box" (click)="itemdetailPage(pro)">\n\n                            <img data-src="{{pro.images[0].src}}">\n\n                        </div>\n\n                        <div *ngIf="pro.images == null || pro.images.length == 0" class="img-box" (click)="itemdetailPage(pro)">\n\n                            <img src="assets/imgs/suit_PNG8132.png">\n\n                        </div>\n\n                        <ion-icon *ngIf="pro.favorite" name="ios-heart" class="text-red icon" (click)="toggleFavorite(pro)"></ion-icon>\n\n                        <ion-icon *ngIf="!pro.favorite" name="ios-heart-outline" class="text-red icon" (click)="toggleFavorite(pro)"></ion-icon>\n\n                    </ion-card-header>\n\n                    <ion-card-content (click)="itemdetailPage(pro)">\n\n                        <h5 class="text-black">{{pro.name}}</h5>\n\n                        <div class="rateing">\n\n                            <div class="card-btn">\n\n                                <p class="" float-left>\n\n                                    <span class="text-white bg-green small-text">{{pro.average_rating}}\n\n                                        <ion-icon name="md-star"></ion-icon>\n\n                                    </span>\n\n                                    <span class="text-light bold"> ({{pro.rating_count}})</span>\n\n                                </p>\n\n                                <div style="width: 70%;" float-right>\n\n                                    <div *ngIf="pro.type ==\'simple\'" class="price text-sky" [innerHTML]="pro.sale_price_html"\n\n                                        style="float: right;"></div>\n\n                                    <div *ngIf="pro.type ==\'variable\'" class="price text-sky" [innerHTML]="pro.price_html"\n\n                                        style="float: right;"></div>\n\n                                    <div *ngIf="pro.type ==\'simple\' && pro.regular_price!=pro.sale_price" class="price text-light mr-5"\n\n                                        [innerHTML]="pro.regular_price_html" style="float: right;"></div>\n\n                                </div>\n\n                            </div>\n\n                        </div>\n\n                    </ion-card-content>\n\n                </ion-card>\n\n            </ion-col>\n\n        </ion-row>\n\n    </ion-list>\n\n    <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n        <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n    </ion-infinite-scroll>\n\n</ion-content>'/*ion-inline-end:"C:\DevIT\Mobimall\src\pages\shirts\shirts.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ModalController */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_11__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], ShirtsPage);
    return ShirtsPage;
}());

//# sourceMappingURL=shirts.js.map

/***/ })

},[299]);
//# sourceMappingURL=main.js.map