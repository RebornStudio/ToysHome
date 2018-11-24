import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface FirebaseConfig {
	apiKey: string,
	authDomain: string,
	databaseURL: string,
	projectId: string,
	storageBucket: string,
	messagingSenderId: string,
	webApplicationId: string
}

export interface AppConfig {
	appName: string;
	apiBase: string;
	perPage: string;
	consumerKey: string;
	consumerSecret: string;
	adminUsername: string;
	adminPassword: string;
	oneSignalAppId: string;
	oneSignalGPSenderId: string;
	paypalSandbox: string;
	paypalProduction: string;
	payuSalt: string;
	payuKey: string;
	availableLanguages: Array<any>;
	firebaseConfig: FirebaseConfig;
}

export const BaseAppConfig: AppConfig = {
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