import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { ɵɵinject, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { DBkeys, ConfigurationServiceAbstractProvider, LocalStoreManagerServiceAbstractProvider, Utilities } from '@polpware/ngx-appkit-contracts-alpha';
import { from, Subject, throwError } from 'rxjs';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { NgxLoggerImpl } from '@polpware/ngx-logger';

class User {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(id, userName, fullName, email, jobTitle, phoneNumber, roles) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }
    get friendlyName() {
        let name = this.fullName || this.userName;
        if (this.jobTitle) {
            name = this.jobTitle + ' ' + name;
        }
        return name;
    }
}

// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
class Permission {
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

class OidcHelperService {
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
    get baseUrl() { return this.configurations.baseUrl; }
    loginWithPassword(userName, password) {
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('client_id', this.clientId)
            .append('grant_type', 'password')
            .append('scope', this.scope);
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap(() => {
            return this.http.post(this.oauthService.tokenEndpoint, params, { headers: header });
        }));
    }
    refreshLogin() {
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('client_id', this.clientId)
            .append('grant_type', 'refresh_token');
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap(() => {
            return this.http.post(this.oauthService.tokenEndpoint, params, { headers: header });
        }));
    }
    get accessToken() {
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }
    get accessTokenExpiryDate() {
        return this.localStorage.getDataObject(DBkeys.TOKEN_EXPIRES_IN, true);
    }
    get refreshToken() {
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }
    get isSessionExpired() {
        if (this.accessTokenExpiryDate == null) {
            return true;
        }
        return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
    }
}
/** @nocollapse */ OidcHelperService.ɵfac = function OidcHelperService_Factory(t) { return new (t || OidcHelperService)(ɵɵinject(HttpClient), ɵɵinject(OAuthService), ɵɵinject(ConfigurationServiceAbstractProvider), ɵɵinject(LocalStoreManagerServiceAbstractProvider)); };
/** @nocollapse */ OidcHelperService.ɵprov = ɵɵdefineInjectable({ token: OidcHelperService, factory: OidcHelperService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(OidcHelperService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: HttpClient }, { type: OAuthService }, { type: ConfigurationServiceAbstractProvider }, { type: LocalStoreManagerServiceAbstractProvider }]; }, null); })();

/**
 * Helper class to decode and find JWT expiration.
 */
class JwtHelper {
    urlBase64Decode(str) {
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
    b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    decodeToken(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    }
    getTokenExpirationDate(token) {
        let decoded;
        decoded = this.decodeToken(token);
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.exp);
        return date;
    }
    isTokenExpired(token, offsetSeconds) {
        const date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
}
/** @nocollapse */ JwtHelper.ɵfac = function JwtHelper_Factory(t) { return new (t || JwtHelper)(); };
/** @nocollapse */ JwtHelper.ɵprov = ɵɵdefineInjectable({ token: JwtHelper, factory: JwtHelper.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(JwtHelper, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();

class AuthService {
    constructor(router, oidcHelperService, _logger, configurationServiceProvider, localStoreManagerProvider) {
        this.router = router;
        this.oidcHelperService = oidcHelperService;
        this._logger = _logger;
        this._loginStatus = new Subject();
        this.localStorage = localStoreManagerProvider.get();
        this.configurations = configurationServiceProvider.get();
        this.initializeLoginStatus();
    }
    get loginUrl() { return this.configurations.loginUrl; }
    get homeUrl() { return this.configurations.homeUrl; }
    initializeLoginStatus() {
        this.localStorage.getInitEvent().subscribe(() => {
            this.emitLoginStatus();
        });
    }
    gotoPage(page, preserveParams = true) {
        const navigationExtras = {
            queryParamsHandling: preserveParams ? 'merge' : '', preserveFragment: preserveParams
        };
        this.router.navigate([page], navigationExtras);
    }
    gotoHomePage() {
        this.router.navigate([this.homeUrl]);
    }
    redirectLoginUser(ignoreQueryParams) {
        this._logger.debug(`login redirect url is: ${this.loginRedirectUrl}`);
        this._logger.debug(`home url is: ${this.homeUrl}`);
        const redirect = (this.loginRedirectUrl &&
            (this.loginRedirectUrl != '/') &&
            (this.loginRedirectUrl != this.loginUrl)) ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
        this._logger.debug(`final redirect url is: ${redirect}`);
        const urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        const urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');
        const navigationExtras = {
            fragment: urlParamsAndFragment.secondPart
        };
        if (!ignoreQueryParams) {
            Object.assign(navigationExtras, {
                queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
                queryParamsHandling: 'merge'
            });
        }
        this._logger.debug(`Redirection url is: ${urlAndParams.firstPart}`);
        this._logger.debug('Extra parameters: ');
        this._logger.debug(navigationExtras);
        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    }
    redirectLogoutUser() {
        const redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;
        this.router.navigate([redirect]);
    }
    redirectForLogin(redirectUrl) {
        if (redirectUrl) {
            this.loginRedirectUrl = redirectUrl;
        }
        else {
            this.loginRedirectUrl = this.router.url;
        }
        this.router.navigate([this.loginUrl]);
    }
    // todo: Is this useful????
    /**
     * Prepare the login URL,
     * including setting up the right redirect url.
     * @param redirectUrl Redirect url.
     */
    prepareLoginUrl(redirectUrl) {
        if (redirectUrl) {
            this.loginRedirectUrl = redirectUrl;
        }
        else {
            this.loginRedirectUrl = this.router.url;
        }
        return this.router.parseUrl(this.loginUrl);
    }
    reLogin() {
        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    }
    // Will not change the status that we have 
    refreshLogin() {
        return this.oidcHelperService.refreshLogin()
            .pipe(map(resp => this.processLoginResponse(resp, this.rememberMe, true)));
    }
    loginWithPassword(userName, password, rememberMe) {
        // Clean what we have before, without emitting any event. 
        this.logout(true);
        return this.oidcHelperService.loginWithPassword(userName, password)
            .pipe(map(resp => this.processLoginResponse(resp, rememberMe)));
    }
    loginWithToken(accessToken, refreshToken, expiresIn, saveInStorage) {
        refreshToken = refreshToken || '';
        expiresIn = 24 * 60 * 60 * 1000;
        const tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
        const accessTokenExpiry = tokenExpiryDate;
        const jwtHelper = new JwtHelper();
        const decodedAccessToken = jwtHelper.decodeToken(accessToken);
        const permissions = Array.isArray(decodedAccessToken.permission) ? decodedAccessToken.permission : [decodedAccessToken.permission];
        if (!this.isLoggedIn) {
            this.configurations.import(decodedAccessToken.configuration);
        }
        const user = new User(decodedAccessToken.sub, decodedAccessToken.name, decodedAccessToken.fullname, decodedAccessToken.email, decodedAccessToken.jobtitle, decodedAccessToken.phone_number, Array.isArray(decodedAccessToken.role) ? decodedAccessToken.role : [decodedAccessToken.role]);
        user.isEnabled = true;
        if (saveInStorage) {
            this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, false);
        }
        // todo: Do we need to emit events?
        return user;
    }
    // Silent event in case.
    processLoginResponse(response, rememberMe, silentEvent) {
        const accessToken = response.access_token;
        if (accessToken == null) {
            throw new Error('accessToken cannot be null');
        }
        rememberMe = rememberMe || this.rememberMe;
        const refreshToken = response.refresh_token || this.refreshToken;
        const expiresIn = response.expires_in;
        const tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
        const accessTokenExpiry = tokenExpiryDate;
        const jwtHelper = new JwtHelper();
        const decodedAccessToken = jwtHelper.decodeToken(accessToken);
        const permissions = Array.isArray(decodedAccessToken.permission) ? decodedAccessToken.permission : [decodedAccessToken.permission];
        if (!this.isLoggedIn) {
            this.configurations.import(decodedAccessToken.configuration);
        }
        const user = new User(decodedAccessToken.sub, decodedAccessToken.name, decodedAccessToken.fullname, decodedAccessToken.email, decodedAccessToken.jobtitle, decodedAccessToken.phone_number, Array.isArray(decodedAccessToken.role) ? decodedAccessToken.role : [decodedAccessToken.role]);
        user.isEnabled = true;
        this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, rememberMe);
        if (silentEvent !== true) {
            this.emitLoginStatus(user);
        }
        return user;
    }
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
    emitLoginStatus(currentUser) {
        const user = currentUser || this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
        const isLoggedIn = user != null;
        this._loginStatus.next(isLoggedIn);
    }
    getLoginStatusEvent() {
        return this._loginStatus.asObservable();
    }
    get currentUser() {
        const user = this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
        return user;
    }
    get userPermissions() {
        return this.localStorage.getDataObject(DBkeys.USER_PERMISSIONS, false) || [];
    }
    get accessToken() {
        return this.oidcHelperService.accessToken;
    }
    get accessTokenExpiryDate() {
        return this.oidcHelperService.accessTokenExpiryDate;
    }
    get refreshToken() {
        return this.oidcHelperService.refreshToken;
    }
    get isSessionExpired() {
        return this.oidcHelperService.isSessionExpired;
    }
    get isLoggedIn() {
        return this.currentUser != null;
    }
    get rememberMe() {
        return this.localStorage.getDataObject(DBkeys.REMEMBER_ME, false) == true;
    }
}
/** @nocollapse */ AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(ɵɵinject(Router), ɵɵinject(OidcHelperService), ɵɵinject(NgxLoggerImpl), ɵɵinject(ConfigurationServiceAbstractProvider), ɵɵinject(LocalStoreManagerServiceAbstractProvider)); };
/** @nocollapse */ AuthService.ɵprov = ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: Router }, { type: OidcHelperService }, { type: NgxLoggerImpl }, { type: ConfigurationServiceAbstractProvider }, { type: LocalStoreManagerServiceAbstractProvider }]; }, null); })();

class AuthGuard {
    constructor(_authService) {
        this._authService = _authService;
    }
    canActivate(route, state) {
        const url = state.url;
        return this.checkLogin(url);
    }
    canActivateChild(route, state) {
        return this.canActivate(route, state);
    }
    canLoad(route) {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }
    checkLogin(url) {
        if (this._authService.isLoggedIn) {
            return true;
        }
        this._authService.redirectForLogin();
        return false;
    }
}
/** @nocollapse */ AuthGuard.ɵfac = function AuthGuard_Factory(t) { return new (t || AuthGuard)(ɵɵinject(AuthService)); };
/** @nocollapse */ AuthGuard.ɵprov = ɵɵdefineInjectable({ token: AuthGuard, factory: AuthGuard.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(AuthGuard, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: AuthService }]; }, null); })();

class EndpointBase {
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    refreshLogin() {
        return this.authService.refreshLogin().pipe(catchError(error => {
            return this.handleError(error, () => this.refreshLogin());
        }));
    }
    get requestHeaders() {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.authService.accessToken,
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*'
        });
        return { headers };
    }
    handleError(error, continuation) {
        // If the error is about authentication. 
        if (error.status == 401) {
            // Pause if the refreshing is in progress. 
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            // Try to refresh to see if we can rescue 
            this.isRefreshingLogin = true;
            return from(this.authService.refreshLogin())
                .pipe(mergeMap(() => {
                this.isRefreshingLogin = false;
                // Run the resumed tasks 
                this.resumeTasks(true);
                // Continue to run the paused 
                return continuation();
            }), catchError(refreshLoginError => {
                this.isRefreshingLogin = false;
                this.resumeTasks(false);
                // Logout and notify others of the changes 
                this.authService.logout();
                if (refreshLoginError.status == 401 ||
                    (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
                    return throwError('session expired');
                }
                else {
                    return throwError(`unknown refresh error (${refreshLoginError || 'server error'})`);
                }
            }));
        }
        if (error.error && error.error.error == 'invalid_grant') {
            // Logout 
            this.authService.logout();
            return throwError((error.error && error.error.error_description) ?
                `session expired (${error.error.error_description})` : 'session expired');
        }
        else {
            return throwError(error);
        }
    }
    pauseTask(continuation) {
        if (!this.taskPauser) {
            this.taskPauser = new Subject();
        }
        return this.taskPauser.pipe(switchMap(continueOp => {
            return continueOp ? continuation() : throwError('session expired');
        }));
    }
    resumeTasks(continueOp) {
        setTimeout(() => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        });
    }
}

class NonAuthGuard {
    constructor(_authService) {
        this._authService = _authService;
    }
    canActivate(next, state) {
        return this.checkNonLogin();
    }
    canActivateChild(next, state) {
        return this.checkNonLogin();
    }
    checkNonLogin() {
        if (this._authService.isLoggedIn) {
            this._authService.redirectLoginUser();
            return false;
        }
        return true;
    }
}
/** @nocollapse */ NonAuthGuard.ɵfac = function NonAuthGuard_Factory(t) { return new (t || NonAuthGuard)(ɵɵinject(AuthService)); };
/** @nocollapse */ NonAuthGuard.ɵprov = ɵɵdefineInjectable({ token: NonAuthGuard, factory: NonAuthGuard.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NonAuthGuard, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: AuthService }]; }, null); })();

class NgxOauth2Module {
}
/** @nocollapse */ NgxOauth2Module.ɵmod = ɵɵdefineNgModule({ type: NgxOauth2Module });
/** @nocollapse */ NgxOauth2Module.ɵinj = ɵɵdefineInjector({ factory: function NgxOauth2Module_Factory(t) { return new (t || NgxOauth2Module)(); }, providers: [], imports: [[
            OAuthModule,
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(NgxOauth2Module, { imports: [OAuthModule] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgxOauth2Module, [{
        type: NgModule,
        args: [{
                declarations: [],
                imports: [
                    OAuthModule,
                ],
                exports: [],
                providers: []
            }]
    }], null, null); })();

/*
 * Public API Surface of ngx-oauth2
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AuthGuard, AuthService, EndpointBase, JwtHelper, NgxOauth2Module, NonAuthGuard, OidcHelperService, Permission, User };
//# sourceMappingURL=polpware-ngx-oauth2.js.map
