import { Injectable, NgModule } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { from, Subject, throwError } from 'rxjs';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';
import { DBkeys, ConfigurationServiceAbstractProvider, LocalStoreManagerServiceAbstractProvider, Utilities } from '@polpware/ngx-appkit-contracts-alpha';
import { Router } from '@angular/router';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/user.model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
class User {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    /**
     * @param {?=} id
     * @param {?=} userName
     * @param {?=} fullName
     * @param {?=} email
     * @param {?=} jobTitle
     * @param {?=} phoneNumber
     * @param {?=} roles
     */
    constructor(id, userName, fullName, email, jobTitle, phoneNumber, roles) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }
    /**
     * @return {?}
     */
    get friendlyName() {
        /** @type {?} */
        let name = this.fullName || this.userName;
        if (this.jobTitle) {
            name = this.jobTitle + ' ' + name;
        }
        return name;
    }
}
if (false) {
    /** @type {?} */
    User.prototype.id;
    /** @type {?} */
    User.prototype.userName;
    /** @type {?} */
    User.prototype.fullName;
    /** @type {?} */
    User.prototype.email;
    /** @type {?} */
    User.prototype.jobTitle;
    /** @type {?} */
    User.prototype.phoneNumber;
    /** @type {?} */
    User.prototype.isEnabled;
    /** @type {?} */
    User.prototype.isLockedOut;
    /** @type {?} */
    User.prototype.roles;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/login-response.model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
/**
 * @record
 */
function LoginResponse() { }
if (false) {
    /** @type {?} */
    LoginResponse.prototype.access_token;
    /** @type {?} */
    LoginResponse.prototype.refresh_token;
    /** @type {?} */
    LoginResponse.prototype.expires_in;
    /** @type {?} */
    LoginResponse.prototype.token_type;
}
/**
 * @record
 */
function AccessToken() { }
if (false) {
    /** @type {?} */
    AccessToken.prototype.nbf;
    /** @type {?} */
    AccessToken.prototype.exp;
    /** @type {?} */
    AccessToken.prototype.iss;
    /** @type {?} */
    AccessToken.prototype.aud;
    /** @type {?} */
    AccessToken.prototype.client_id;
    /** @type {?} */
    AccessToken.prototype.sub;
    /** @type {?} */
    AccessToken.prototype.auth_time;
    /** @type {?} */
    AccessToken.prototype.idp;
    /** @type {?} */
    AccessToken.prototype.role;
    /** @type {?} */
    AccessToken.prototype.permission;
    /** @type {?} */
    AccessToken.prototype.name;
    /** @type {?} */
    AccessToken.prototype.email;
    /** @type {?} */
    AccessToken.prototype.phone_number;
    /** @type {?} */
    AccessToken.prototype.fullname;
    /** @type {?} */
    AccessToken.prototype.jobtitle;
    /** @type {?} */
    AccessToken.prototype.configuration;
    /** @type {?} */
    AccessToken.prototype.scope;
    /** @type {?} */
    AccessToken.prototype.amr;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/permission.model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
class Permission {
    /**
     * @param {?=} name
     * @param {?=} value
     * @param {?=} groupName
     * @param {?=} description
     */
    constructor(name, value, groupName, description) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }
}
Permission.viewUsersPermission = 'users.view';
Permission.manageUsersPermission = 'users.manage';
Permission.viewRolesPermission = 'roles.view';
Permission.manageRolesPermission = 'roles.manage';
Permission.assignRolesPermission = 'roles.assign';
if (false) {
    /** @type {?} */
    Permission.viewUsersPermission;
    /** @type {?} */
    Permission.manageUsersPermission;
    /** @type {?} */
    Permission.viewRolesPermission;
    /** @type {?} */
    Permission.manageRolesPermission;
    /** @type {?} */
    Permission.assignRolesPermission;
    /** @type {?} */
    Permission.prototype.name;
    /** @type {?} */
    Permission.prototype.value;
    /** @type {?} */
    Permission.prototype.groupName;
    /** @type {?} */
    Permission.prototype.description;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/oidc-helper.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OidcHelperService {
    /**
     * @param {?} http
     * @param {?} oauthService
     * @param {?} configurationServiceProvider
     * @param {?} localStoreManagerProvider
     */
    constructor(http, oauthService, configurationServiceProvider, localStoreManagerProvider) {
        this.http = http;
        this.oauthService = oauthService;
        this.clientId = 'quickapp_spa';
        this.scope = 'openid email phone profile offline_access roles quickapp_api';
        this.localStorage = localStoreManagerProvider.get();
        this.configurations = configurationServiceProvider.get();
        /*
        if (environment.requireHttps !== undefined) {
            this.oauthService.configure({
                requireHttps: false
            });
        } */
    }
    /**
     * @private
     * @return {?}
     */
    get baseUrl() { return this.configurations.baseUrl; }
    /**
     * @param {?} userName
     * @param {?} password
     * @return {?}
     */
    loginWithPassword(userName, password) {
        /** @type {?} */
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        /** @type {?} */
        const params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('client_id', this.clientId)
            .append('grant_type', 'password')
            .append('scope', this.scope);
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap((/**
         * @return {?}
         */
        () => {
            return this.http.post(this.oauthService.tokenEndpoint, params, { headers: header });
        })));
    }
    /**
     * @return {?}
     */
    refreshLogin() {
        /** @type {?} */
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        /** @type {?} */
        const params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('client_id', this.clientId)
            .append('grant_type', 'refresh_token');
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap((/**
         * @return {?}
         */
        () => {
            return this.http.post(this.oauthService.tokenEndpoint, params, { headers: header });
        })));
    }
    /**
     * @return {?}
     */
    get accessToken() {
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }
    /**
     * @return {?}
     */
    get accessTokenExpiryDate() {
        return this.localStorage.getDataObject(DBkeys.TOKEN_EXPIRES_IN, true);
    }
    /**
     * @return {?}
     */
    get refreshToken() {
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }
    /**
     * @return {?}
     */
    get isSessionExpired() {
        if (this.accessTokenExpiryDate == null) {
            return true;
        }
        return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
    }
}
OidcHelperService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcHelperService.ctorParameters = () => [
    { type: HttpClient },
    { type: OAuthService },
    { type: ConfigurationServiceAbstractProvider },
    { type: LocalStoreManagerServiceAbstractProvider }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.clientId;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.scope;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.localStorage;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.configurations;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.http;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.oauthService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/jwt-helper.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class JwtHelper {
    /**
     * @param {?} str
     * @return {?}
     */
    urlBase64Decode(str) {
        /** @type {?} */
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return this.b64DecodeUnicode(output);
    }
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (/**
         * @param {?} c
         * @return {?}
         */
        (c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })).join(''));
    }
    /**
     * @param {?} token
     * @return {?}
     */
    decodeToken(token) {
        /** @type {?} */
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        /** @type {?} */
        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    }
    /**
     * @param {?} token
     * @return {?}
     */
    getTokenExpirationDate(token) {
        /** @type {?} */
        let decoded;
        decoded = this.decodeToken(token);
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        /** @type {?} */
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    isTokenExpired(token, offsetSeconds) {
        /** @type {?} */
        const date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
}
JwtHelper.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/auth.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AuthService {
    /**
     * @param {?} router
     * @param {?} oidcHelperService
     * @param {?} configurationServiceProvider
     * @param {?} localStoreManagerProvider
     */
    constructor(router, oidcHelperService, configurationServiceProvider, localStoreManagerProvider) {
        this.router = router;
        this.oidcHelperService = oidcHelperService;
        this._loginStatus = new Subject();
        this.localStorage = localStoreManagerProvider.get();
        this.configurations = configurationServiceProvider.get();
        this.initializeLoginStatus();
    }
    /**
     * @return {?}
     */
    get loginUrl() { return this.configurations.loginUrl; }
    /**
     * @return {?}
     */
    get homeUrl() { return this.configurations.homeUrl; }
    /**
     * @private
     * @return {?}
     */
    initializeLoginStatus() {
        this.localStorage.getInitEvent().subscribe((/**
         * @return {?}
         */
        () => {
            this.emitLoginStatus();
        }));
    }
    /**
     * @param {?} page
     * @param {?=} preserveParams
     * @return {?}
     */
    gotoPage(page, preserveParams = true) {
        /** @type {?} */
        const navigationExtras = {
            queryParamsHandling: preserveParams ? 'merge' : '', preserveFragment: preserveParams
        };
        this.router.navigate([page], navigationExtras);
    }
    /**
     * @return {?}
     */
    gotoHomePage() {
        this.router.navigate([this.homeUrl]);
    }
    /**
     * @return {?}
     */
    redirectLoginUser() {
        /** @type {?} */
        const redirect = (this.loginRedirectUrl &&
            (this.loginRedirectUrl != '/') &&
            (this.loginRedirectUrl != this.loginUrl)) ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
        /** @type {?} */
        const urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        /** @type {?} */
        const urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');
        /** @type {?} */
        const navigationExtras = {
            fragment: urlParamsAndFragment.secondPart,
            queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
            queryParamsHandling: 'merge'
        };
        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    }
    /**
     * @return {?}
     */
    redirectLogoutUser() {
        /** @type {?} */
        const redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;
        this.router.navigate([redirect]);
    }
    /**
     * @param {?=} redirectUrl
     * @return {?}
     */
    redirectForLogin(redirectUrl) {
        if (redirectUrl) {
            this.loginRedirectUrl = redirectUrl;
        }
        else {
            this.loginRedirectUrl = this.router.url;
        }
        this.router.navigate([this.loginUrl]);
    }
    /**
     * @return {?}
     */
    reLogin() {
        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    }
    // Will not change the status that we have 
    /**
     * @return {?}
     */
    refreshLogin() {
        return this.oidcHelperService.refreshLogin()
            .pipe(map((/**
         * @param {?} resp
         * @return {?}
         */
        resp => this.processLoginResponse(resp, this.rememberMe, true))));
    }
    /**
     * @param {?} userName
     * @param {?} password
     * @param {?=} rememberMe
     * @return {?}
     */
    loginWithPassword(userName, password, rememberMe) {
        // Clean what we have before, without emitting any event. 
        this.logout(true);
        return this.oidcHelperService.loginWithPassword(userName, password)
            .pipe(map((/**
         * @param {?} resp
         * @return {?}
         */
        resp => this.processLoginResponse(resp, rememberMe))));
    }
    // Silent event in case.
    /**
     * @private
     * @param {?} response
     * @param {?} rememberMe
     * @param {?=} silentEvent
     * @return {?}
     */
    processLoginResponse(response, rememberMe, silentEvent) {
        /** @type {?} */
        const accessToken = response.access_token;
        if (accessToken == null) {
            throw new Error('accessToken cannot be null');
        }
        rememberMe = rememberMe || this.rememberMe;
        /** @type {?} */
        const refreshToken = response.refresh_token || this.refreshToken;
        /** @type {?} */
        const expiresIn = response.expires_in;
        /** @type {?} */
        const tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
        /** @type {?} */
        const accessTokenExpiry = tokenExpiryDate;
        /** @type {?} */
        const jwtHelper = new JwtHelper();
        /** @type {?} */
        const decodedAccessToken = (/** @type {?} */ (jwtHelper.decodeToken(accessToken)));
        /** @type {?} */
        const permissions = Array.isArray(decodedAccessToken.permission) ? decodedAccessToken.permission : [decodedAccessToken.permission];
        if (!this.isLoggedIn) {
            this.configurations.import(decodedAccessToken.configuration);
        }
        /** @type {?} */
        const user = new User(decodedAccessToken.sub, decodedAccessToken.name, decodedAccessToken.fullname, decodedAccessToken.email, decodedAccessToken.jobtitle, decodedAccessToken.phone_number, Array.isArray(decodedAccessToken.role) ? decodedAccessToken.role : [decodedAccessToken.role]);
        user.isEnabled = true;
        this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, rememberMe);
        if (silentEvent !== true) {
            this.emitLoginStatus(user);
        }
        return user;
    }
    /**
     * @private
     * @param {?} user
     * @param {?} permissions
     * @param {?} accessToken
     * @param {?} refreshToken
     * @param {?} expiresIn
     * @param {?} rememberMe
     * @return {?}
     */
    saveUserDetails(user, permissions, accessToken, refreshToken, expiresIn, rememberMe) {
        if (rememberMe) {
            this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
        }
        else {
            this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
        }
        this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    }
    // Silient event in case.
    /**
     * @param {?=} silentEvent
     * @return {?}
     */
    logout(silentEvent) {
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);
        this.configurations.clearLocalChanges();
        if (silentEvent !== true) {
            this.emitLoginStatus();
        }
    }
    /**
     * @private
     * @param {?=} currentUser
     * @return {?}
     */
    emitLoginStatus(currentUser) {
        /** @type {?} */
        const user = currentUser || this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
        /** @type {?} */
        const isLoggedIn = user != null;
        this._loginStatus.next(isLoggedIn);
    }
    /**
     * @return {?}
     */
    getLoginStatusEvent() {
        return this._loginStatus.asObservable();
    }
    /**
     * @return {?}
     */
    get currentUser() {
        /** @type {?} */
        const user = this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
        return user;
    }
    /**
     * @return {?}
     */
    get userPermissions() {
        return this.localStorage.getDataObject(DBkeys.USER_PERMISSIONS, false) || [];
    }
    /**
     * @return {?}
     */
    get accessToken() {
        return this.oidcHelperService.accessToken;
    }
    /**
     * @return {?}
     */
    get accessTokenExpiryDate() {
        return this.oidcHelperService.accessTokenExpiryDate;
    }
    /**
     * @return {?}
     */
    get refreshToken() {
        return this.oidcHelperService.refreshToken;
    }
    /**
     * @return {?}
     */
    get isSessionExpired() {
        return this.oidcHelperService.isSessionExpired;
    }
    /**
     * @return {?}
     */
    get isLoggedIn() {
        return this.currentUser != null;
    }
    /**
     * @return {?}
     */
    get rememberMe() {
        return this.localStorage.getDataObject(DBkeys.REMEMBER_ME, false) == true;
    }
}
AuthService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
AuthService.ctorParameters = () => [
    { type: Router },
    { type: OidcHelperService },
    { type: ConfigurationServiceAbstractProvider },
    { type: LocalStoreManagerServiceAbstractProvider }
];
if (false) {
    /** @type {?} */
    AuthService.prototype.loginRedirectUrl;
    /** @type {?} */
    AuthService.prototype.logoutRedirectUrl;
    /** @type {?} */
    AuthService.prototype.reLoginDelegate;
    /**
     * @type {?}
     * @private
     */
    AuthService.prototype._loginStatus;
    /**
     * @type {?}
     * @private
     */
    AuthService.prototype.localStorage;
    /**
     * @type {?}
     * @private
     */
    AuthService.prototype.configurations;
    /**
     * @type {?}
     * @private
     */
    AuthService.prototype.router;
    /**
     * @type {?}
     * @private
     */
    AuthService.prototype.oidcHelperService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/auth-guard.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AuthGuard {
    /**
     * @param {?} authService
     * @param {?} router
     */
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    canActivate(route, state) {
        /** @type {?} */
        const url = state.url;
        return this.checkLogin(url);
    }
    /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    canActivateChild(route, state) {
        return this.canActivate(route, state);
    }
    /**
     * @param {?} route
     * @return {?}
     */
    canLoad(route) {
        /** @type {?} */
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }
    /**
     * @param {?} url
     * @return {?}
     */
    checkLogin(url) {
        if (this.authService.isLoggedIn) {
            return true;
        }
        this.authService.loginRedirectUrl = url;
        this.router.navigate(['/login']);
        return false;
    }
}
AuthGuard.decorators = [
    { type: Injectable }
];
/** @nocollapse */
AuthGuard.ctorParameters = () => [
    { type: AuthService },
    { type: Router }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    AuthGuard.prototype.authService;
    /**
     * @type {?}
     * @private
     */
    AuthGuard.prototype.router;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/endpoint-base.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EndpointBase {
    /**
     * @param {?} http
     * @param {?} authService
     */
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    /**
     * @protected
     * @return {?}
     */
    get requestHeaders() {
        /** @type {?} */
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.authService.accessToken,
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*'
        });
        return { headers };
    }
    /**
     * @return {?}
     */
    refreshLogin() {
        return this.authService.refreshLogin().pipe(catchError((/**
         * @param {?} error
         * @return {?}
         */
        error => {
            return this.handleError(error, (/**
             * @return {?}
             */
            () => this.refreshLogin()));
        })));
    }
    /**
     * @protected
     * @param {?} error
     * @param {?} continuation
     * @return {?}
     */
    handleError(error, continuation) {
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            this.isRefreshingLogin = true;
            return from(this.authService.refreshLogin()).pipe(mergeMap((/**
             * @return {?}
             */
            () => {
                this.isRefreshingLogin = false;
                this.resumeTasks(true);
                return continuation();
            })), catchError((/**
             * @param {?} refreshLoginError
             * @return {?}
             */
            refreshLoginError => {
                this.isRefreshingLogin = false;
                this.resumeTasks(false);
                this.authService.reLogin();
                if (refreshLoginError.status == 401 || (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
                    return throwError('session expired');
                }
                else {
                    return throwError(`unknown refresh error (${refreshLoginError || 'server error'})`);
                }
            })));
        }
        if (error.error && error.error.error == 'invalid_grant') {
            this.authService.reLogin();
            return throwError((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
        }
        else {
            return throwError(error);
        }
    }
    /**
     * @private
     * @param {?} continuation
     * @return {?}
     */
    pauseTask(continuation) {
        if (!this.taskPauser) {
            this.taskPauser = new Subject();
        }
        return this.taskPauser.pipe(switchMap((/**
         * @param {?} continueOp
         * @return {?}
         */
        continueOp => {
            return continueOp ? continuation() : throwError('session expired');
        })));
    }
    /**
     * @private
     * @param {?} continueOp
     * @return {?}
     */
    resumeTasks(continueOp) {
        setTimeout((/**
         * @return {?}
         */
        () => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        }));
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    EndpointBase.prototype.taskPauser;
    /**
     * @type {?}
     * @private
     */
    EndpointBase.prototype.isRefreshingLogin;
    /**
     * @type {?}
     * @protected
     */
    EndpointBase.prototype.http;
    /**
     * @type {?}
     * @private
     */
    EndpointBase.prototype.authService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/ngx-oauth2.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxOauth2Module {
}
NgxOauth2Module.decorators = [
    { type: NgModule, args: [{
                declarations: [],
                imports: [
                    OAuthModule,
                ],
                exports: [],
                providers: [
                    OidcHelperService,
                    AuthService,
                    JwtHelper,
                    AuthGuard
                ]
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: polpware-ngx-oauth2.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { AuthGuard, AuthService, EndpointBase, JwtHelper, NgxOauth2Module, OidcHelperService, Permission, User };
//# sourceMappingURL=polpware-ngx-oauth2.js.map
