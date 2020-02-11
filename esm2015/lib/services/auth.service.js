/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/auth.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStoreManagerServiceAbstractProvider, ConfigurationServiceAbstractProvider, Utilities, DBkeys, ConfigurationServiceConstants } from '@polpware/ngx-appkit-contracts-alpha';
import { OidcHelperService } from './oidc-helper.service';
import { JwtHelper } from './jwt-helper';
import { User } from '../models/user.model';
export class AuthService {
    /**
     * @param {?} router
     * @param {?} oidcHelperService
     * @param {?} configurationServiceProvider
     * @param {?} localStoreManagerProvider
     */
    constructor(router, oidcHelperService, configurationServiceProvider, localStoreManagerProvider) {
        this.router = router;
        this.oidcHelperService = oidcHelperService;
        this.previousIsLoggedInCheck = false;
        this._loginStatus = new BehaviorSubject(false);
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
            this.reevaluateLoginStatus();
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
        console.log('loginRedirectUrl 2' + this.loginRedirectUrl);
        console.log(this.homeUrl);
        /** @type {?} */
        const redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationServiceConstants.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
        console.log('directurl=' + redirect);
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
     * @return {?}
     */
    redirectForLogin() {
        console.log('redirect for login');
        this.loginRedirectUrl = this.router.url;
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
    /**
     * @return {?}
     */
    refreshLogin() {
        return this.oidcHelperService.refreshLogin()
            .pipe(map((/**
         * @param {?} resp
         * @return {?}
         */
        resp => this.processLoginResponse(resp, this.rememberMe))));
    }
    /**
     * @param {?} userName
     * @param {?} password
     * @param {?=} rememberMe
     * @return {?}
     */
    loginWithPassword(userName, password, rememberMe) {
        if (this.isLoggedIn) {
            this.logout();
        }
        return this.oidcHelperService.loginWithPassword(userName, password)
            .pipe(map((/**
         * @param {?} resp
         * @return {?}
         */
        resp => this.processLoginResponse(resp, rememberMe))));
    }
    /**
     * @private
     * @param {?} response
     * @param {?=} rememberMe
     * @return {?}
     */
    processLoginResponse(response, rememberMe) {
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
        this.reevaluateLoginStatus(user);
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
    /**
     * @return {?}
     */
    logout() {
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);
        this.configurations.clearLocalChanges();
        this.reevaluateLoginStatus();
    }
    /**
     * @private
     * @param {?=} currentUser
     * @return {?}
     */
    reevaluateLoginStatus(currentUser) {
        /** @type {?} */
        const user = currentUser || this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
        /** @type {?} */
        const isLoggedIn = user != null;
        if (this.previousIsLoggedInCheck != isLoggedIn) {
            setTimeout((/**
             * @return {?}
             */
            () => {
                this._loginStatus.next(isLoggedIn);
            }));
        }
        this.previousIsLoggedInCheck = isLoggedIn;
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
        this.reevaluateLoginStatus(user);
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
    AuthService.prototype.previousIsLoggedInCheck;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBb0IsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRCxPQUFPLEVBQWMsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBRUgsd0NBQXdDLEVBRXhDLG9DQUFvQyxFQUNwQyxTQUFTLEVBQ1QsTUFBTSxFQUNOLDZCQUE2QixFQUNoQyxNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBSTVDLE1BQU0sT0FBTyxXQUFXOzs7Ozs7O0lBZXBCLFlBQ1ksTUFBYyxFQUNkLGlCQUFvQyxFQUM1Qyw0QkFBa0UsRUFDbEUseUJBQW1FO1FBSDNELFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBUnhDLDRCQUF1QixHQUFHLEtBQUssQ0FBQztRQUNoQyxpQkFBWSxHQUFHLElBQUksZUFBZSxDQUFVLEtBQUssQ0FBQyxDQUFDO1FBV3ZELElBQUksQ0FBQyxZQUFZLEdBQUcseUJBQXlCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGNBQWMsR0FBRyw0QkFBNEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUV6RCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUNqQyxDQUFDOzs7O0lBeEJELElBQVcsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7O0lBQzlELElBQVcsT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7OztJQXlCcEQscUJBQXFCO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFO1lBQzVDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ2pDLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7O0lBRUQsUUFBUSxDQUFDLElBQVksRUFBRSxjQUFjLEdBQUcsSUFBSTs7Y0FFbEMsZ0JBQWdCLEdBQXFCO1lBQ3ZDLG1CQUFtQixFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYztTQUN2RjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs7O0lBRUQsWUFBWTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7OztJQUVELGlCQUFpQjtRQUViLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O2NBRXBCLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksNkJBQTZCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQ3RMLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFFN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLENBQUM7O2NBRS9CLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQzs7Y0FDMUQsWUFBWSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQzs7Y0FFeEUsZ0JBQWdCLEdBQXFCO1lBQ3ZDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxVQUFVO1lBQ3pDLFdBQVcsRUFBRSxTQUFTLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztZQUN4RSxtQkFBbUIsRUFBRSxPQUFPO1NBQy9CO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNyRSxDQUFDOzs7O0lBRUQsa0JBQWtCOztjQUNSLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVE7UUFDaEYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUU5QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQzs7OztJQUVELGdCQUFnQjtRQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDOzs7O0lBRUQsT0FBTztRQUNILElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDMUI7YUFBTTtZQUNILElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQzs7OztJQUVELFlBQVk7UUFDUixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUU7YUFDdkMsSUFBSSxDQUFDLEdBQUc7Ozs7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDOzs7Ozs7O0lBRUQsaUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLFVBQW9CO1FBQ3RFLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDakI7UUFFRCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO2FBQzlELElBQUksQ0FBQyxHQUFHOzs7O1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDOzs7Ozs7O0lBRU8sb0JBQW9CLENBQUMsUUFBdUIsRUFBRSxVQUFvQjs7Y0FDaEUsV0FBVyxHQUFHLFFBQVEsQ0FBQyxZQUFZO1FBRXpDLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDakQ7UUFFRCxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7O2NBRXJDLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxZQUFZOztjQUMxRCxTQUFTLEdBQUcsUUFBUSxDQUFDLFVBQVU7O2NBQy9CLGVBQWUsR0FBRyxJQUFJLElBQUksRUFBRTtRQUNsQyxlQUFlLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQzs7Y0FDL0QsaUJBQWlCLEdBQUcsZUFBZTs7Y0FDbkMsU0FBUyxHQUFHLElBQUksU0FBUyxFQUFFOztjQUMzQixrQkFBa0IsR0FBRyxtQkFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxFQUFlOztjQUV0RSxXQUFXLEdBQXVCLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7UUFFdEosSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDaEU7O2NBRUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUNqQixrQkFBa0IsQ0FBQyxHQUFHLEVBQ3RCLGtCQUFrQixDQUFDLElBQUksRUFDdkIsa0JBQWtCLENBQUMsUUFBUSxFQUMzQixrQkFBa0IsQ0FBQyxLQUFLLEVBQ3hCLGtCQUFrQixDQUFDLFFBQVEsRUFDM0Isa0JBQWtCLENBQUMsWUFBWSxFQUMvQixLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFbEcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Ozs7Ozs7Ozs7O0lBRU8sZUFBZSxDQUFDLElBQVUsRUFBRSxXQUErQixFQUFFLFdBQW1CLEVBQUUsWUFBb0IsRUFBRSxTQUFlLEVBQUUsVUFBbUI7UUFDaEosSUFBSSxVQUFVLEVBQUU7WUFDWixJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNsRTthQUFNO1lBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1RSxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM1RSxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDdEU7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7OztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFeEMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDakMsQ0FBQzs7Ozs7O0lBRU8scUJBQXFCLENBQUMsV0FBa0I7O2NBQ3RDLElBQUksR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQU8sTUFBTSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7O2NBQ3ZGLFVBQVUsR0FBRyxJQUFJLElBQUksSUFBSTtRQUUvQixJQUFJLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxVQUFVLEVBQUU7WUFDNUMsVUFBVTs7O1lBQUMsR0FBRyxFQUFFO2dCQUNaLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsRUFBQyxDQUFDO1NBQ047UUFFRCxJQUFJLENBQUMsdUJBQXVCLEdBQUcsVUFBVSxDQUFDO0lBQzlDLENBQUM7Ozs7SUFFRCxtQkFBbUI7UUFDZixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDNUMsQ0FBQzs7OztJQUVELElBQUksV0FBVzs7Y0FFTCxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQU8sTUFBTSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7UUFDOUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Ozs7SUFFRCxJQUFJLGVBQWU7UUFDZixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFxQixNQUFNLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JHLENBQUM7Ozs7SUFFRCxJQUFJLFdBQVc7UUFDWCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUM7SUFDOUMsQ0FBQzs7OztJQUVELElBQUkscUJBQXFCO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDO0lBQ3hELENBQUM7Ozs7SUFFRCxJQUFJLFlBQVk7UUFDWixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7SUFDL0MsQ0FBQzs7OztJQUVELElBQUksZ0JBQWdCO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDO0lBQ25ELENBQUM7Ozs7SUFFRCxJQUFJLFVBQVU7UUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO0lBQ3BDLENBQUM7Ozs7SUFFRCxJQUFJLFVBQVU7UUFDVixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFVLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDO0lBQ3ZGLENBQUM7OztZQWpPSixVQUFVOzs7O1lBcEJGLE1BQU07WUFjTixpQkFBaUI7WUFOdEIsb0NBQW9DO1lBRnBDLHdDQUF3Qzs7OztJQW1CeEMsdUNBQWdDOztJQUNoQyx3Q0FBaUM7O0lBRWpDLHNDQUFtQzs7Ozs7SUFFbkMsOENBQXdDOzs7OztJQUN4QyxtQ0FBMkQ7Ozs7O0lBRTNELG1DQUFpRDs7Ozs7SUFDakQscUNBQXNEOzs7OztJQUdsRCw2QkFBc0I7Ozs7O0lBQ3RCLHdDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFbWFpbDogaW5mb0BlYmVubW9ubmV5LmNvbVxuLy8gd3d3LmViZW5tb25uZXkuY29tL3RlbXBsYXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICAgIElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0LFxuICAgIExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3QsXG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIFV0aWxpdGllcyxcbiAgICBEQmtleXMsXG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VDb25zdGFudHNcbn0gZnJvbSAnQHBvbHB3YXJlL25neC1hcHBraXQtY29udHJhY3RzLWFscGhhJztcblxuaW1wb3J0IHsgT2lkY0hlbHBlclNlcnZpY2UgfSBmcm9tICcuL29pZGMtaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyJztcbmltcG9ydCB7IEFjY2Vzc1Rva2VuLCBMb2dpblJlc3BvbnNlIH0gZnJvbSAnLi4vbW9kZWxzL2xvZ2luLXJlc3BvbnNlLm1vZGVsJztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi9tb2RlbHMvdXNlci5tb2RlbCc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uVmFsdWVzIH0gZnJvbSAnLi4vbW9kZWxzL3Blcm1pc3Npb24ubW9kZWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuICAgIHB1YmxpYyBnZXQgbG9naW5VcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmxvZ2luVXJsOyB9XG4gICAgcHVibGljIGdldCBob21lVXJsKCkgeyByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9ucy5ob21lVXJsOyB9XG5cbiAgICBwdWJsaWMgbG9naW5SZWRpcmVjdFVybDogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2dvdXRSZWRpcmVjdFVybDogc3RyaW5nO1xuXG4gICAgcHVibGljIHJlTG9naW5EZWxlZ2F0ZTogKCkgPT4gdm9pZDtcblxuICAgIHByaXZhdGUgcHJldmlvdXNJc0xvZ2dlZEluQ2hlY2sgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9sb2dpblN0YXR1cyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gICAgcHJpdmF0ZSBsb2NhbFN0b3JhZ2U6IElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0O1xuICAgIHByaXZhdGUgY29uZmlndXJhdGlvbnM6IElDb25maWd1cmF0aW9uU2VydmljZUNvbnRyYWN0O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgb2lkY0hlbHBlclNlcnZpY2U6IE9pZGNIZWxwZXJTZXJ2aWNlLFxuICAgICAgICBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyOiBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgICAgIGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXI6IExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXIuZ2V0KCk7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMgPSBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyLmdldCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxvZ2luU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplTG9naW5TdGF0dXMoKSB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmdldEluaXRFdmVudCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlZXZhbHVhdGVMb2dpblN0YXR1cygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnb3RvUGFnZShwYWdlOiBzdHJpbmcsIHByZXNlcnZlUGFyYW1zID0gdHJ1ZSkge1xuXG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBxdWVyeVBhcmFtc0hhbmRsaW5nOiBwcmVzZXJ2ZVBhcmFtcyA/ICdtZXJnZScgOiAnJywgcHJlc2VydmVGcmFnbWVudDogcHJlc2VydmVQYXJhbXNcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcGFnZV0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICAgIGdvdG9Ib21lUGFnZSgpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuaG9tZVVybF0pO1xuICAgIH1cblxuICAgIHJlZGlyZWN0TG9naW5Vc2VyKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2dpblJlZGlyZWN0VXJsIDInICsgdGhpcy5sb2dpblJlZGlyZWN0VXJsKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5ob21lVXJsKTtcblxuICAgICAgICBjb25zdCByZWRpcmVjdCA9IHRoaXMubG9naW5SZWRpcmVjdFVybCAmJiB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgIT0gJy8nICYmIHRoaXMubG9naW5SZWRpcmVjdFVybCAhPSBDb25maWd1cmF0aW9uU2VydmljZUNvbnN0YW50cy5kZWZhdWx0SG9tZVVybCA/IHRoaXMubG9naW5SZWRpcmVjdFVybCA6IHRoaXMuaG9tZVVybDtcbiAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gbnVsbDtcblxuICAgICAgICBjb25zb2xlLmxvZygnZGlyZWN0dXJsPScgKyByZWRpcmVjdCk7XG5cbiAgICAgICAgY29uc3QgdXJsUGFyYW1zQW5kRnJhZ21lbnQgPSBVdGlsaXRpZXMuc3BsaXRJblR3byhyZWRpcmVjdCwgJyMnKTtcbiAgICAgICAgY29uc3QgdXJsQW5kUGFyYW1zID0gVXRpbGl0aWVzLnNwbGl0SW5Ud28odXJsUGFyYW1zQW5kRnJhZ21lbnQuZmlyc3RQYXJ0LCAnPycpO1xuXG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBmcmFnbWVudDogdXJsUGFyYW1zQW5kRnJhZ21lbnQuc2Vjb25kUGFydCxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiBVdGlsaXRpZXMuZ2V0UXVlcnlQYXJhbXNGcm9tU3RyaW5nKHVybEFuZFBhcmFtcy5zZWNvbmRQYXJ0KSxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zSGFuZGxpbmc6ICdtZXJnZSdcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsQW5kUGFyYW1zLmZpcnN0UGFydF0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICAgIHJlZGlyZWN0TG9nb3V0VXNlcigpIHtcbiAgICAgICAgY29uc3QgcmVkaXJlY3QgPSB0aGlzLmxvZ291dFJlZGlyZWN0VXJsID8gdGhpcy5sb2dvdXRSZWRpcmVjdFVybCA6IHRoaXMubG9naW5Vcmw7XG4gICAgICAgIHRoaXMubG9nb3V0UmVkaXJlY3RVcmwgPSBudWxsO1xuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtyZWRpcmVjdF0pO1xuICAgIH1cblxuICAgIHJlZGlyZWN0Rm9yTG9naW4oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWRpcmVjdCBmb3IgbG9naW4nKTtcbiAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gdGhpcy5yb3V0ZXIudXJsO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5sb2dpblVybF0pO1xuICAgIH1cblxuICAgIHJlTG9naW4oKSB7XG4gICAgICAgIGlmICh0aGlzLnJlTG9naW5EZWxlZ2F0ZSkge1xuICAgICAgICAgICAgdGhpcy5yZUxvZ2luRGVsZWdhdGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVkaXJlY3RGb3JMb2dpbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVmcmVzaExvZ2luKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5yZWZyZXNoTG9naW4oKVxuICAgICAgICAgICAgLnBpcGUobWFwKHJlc3AgPT4gdGhpcy5wcm9jZXNzTG9naW5SZXNwb25zZShyZXNwLCB0aGlzLnJlbWVtYmVyTWUpKSk7XG4gICAgfVxuXG4gICAgbG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgcmVtZW1iZXJNZT86IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lLCBwYXNzd29yZClcbiAgICAgICAgICAgIC5waXBlKG1hcChyZXNwID0+IHRoaXMucHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcCwgcmVtZW1iZXJNZSkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NMb2dpblJlc3BvbnNlKHJlc3BvbnNlOiBMb2dpblJlc3BvbnNlLCByZW1lbWJlck1lPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmFjY2Vzc190b2tlbjtcblxuICAgICAgICBpZiAoYWNjZXNzVG9rZW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhY2Nlc3NUb2tlbiBjYW5ub3QgYmUgbnVsbCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtZW1iZXJNZSA9IHJlbWVtYmVyTWUgfHwgdGhpcy5yZW1lbWJlck1lO1xuXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4gfHwgdGhpcy5yZWZyZXNoVG9rZW47XG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHJlc3BvbnNlLmV4cGlyZXNfaW47XG4gICAgICAgIGNvbnN0IHRva2VuRXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRva2VuRXhwaXJ5RGF0ZS5zZXRTZWNvbmRzKHRva2VuRXhwaXJ5RGF0ZS5nZXRTZWNvbmRzKCkgKyBleHBpcmVzSW4pO1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbkV4cGlyeSA9IHRva2VuRXhwaXJ5RGF0ZTtcbiAgICAgICAgY29uc3Qgand0SGVscGVyID0gbmV3IEp3dEhlbHBlcigpO1xuICAgICAgICBjb25zdCBkZWNvZGVkQWNjZXNzVG9rZW4gPSBqd3RIZWxwZXIuZGVjb2RlVG9rZW4oYWNjZXNzVG9rZW4pIGFzIEFjY2Vzc1Rva2VuO1xuXG4gICAgICAgIGNvbnN0IHBlcm1pc3Npb25zOiBQZXJtaXNzaW9uVmFsdWVzW10gPSBBcnJheS5pc0FycmF5KGRlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uKSA/IGRlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uIDogW2RlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uXTtcblxuICAgICAgICBpZiAoIXRoaXMuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucy5pbXBvcnQoZGVjb2RlZEFjY2Vzc1Rva2VuLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLnN1YixcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5uYW1lLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmZ1bGxuYW1lLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmVtYWlsLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmpvYnRpdGxlLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLnBob25lX251bWJlcixcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGUpID8gZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGUgOiBbZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGVdKTtcbiAgICAgICAgdXNlci5pc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc2F2ZVVzZXJEZXRhaWxzKHVzZXIsIHBlcm1pc3Npb25zLCBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuLCBhY2Nlc3NUb2tlbkV4cGlyeSwgcmVtZW1iZXJNZSk7XG5cbiAgICAgICAgdGhpcy5yZWV2YWx1YXRlTG9naW5TdGF0dXModXNlcik7XG5cbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlVXNlckRldGFpbHModXNlcjogVXNlciwgcGVybWlzc2lvbnM6IFBlcm1pc3Npb25WYWx1ZXNbXSwgYWNjZXNzVG9rZW46IHN0cmluZywgcmVmcmVzaFRva2VuOiBzdHJpbmcsIGV4cGlyZXNJbjogRGF0ZSwgcmVtZW1iZXJNZTogYm9vbGVhbikge1xuICAgICAgICBpZiAocmVtZW1iZXJNZSkge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEoYWNjZXNzVG9rZW4sIERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEocmVmcmVzaFRva2VuLCBEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShleHBpcmVzSW4sIERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHBlcm1pc3Npb25zLCBEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YSh1c2VyLCBEQmtleXMuQ1VSUkVOVF9VU0VSKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShhY2Nlc3NUb2tlbiwgREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEocmVmcmVzaFRva2VuLCBEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEoZXhwaXJlc0luLCBEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEocGVybWlzc2lvbnMsIERCa2V5cy5VU0VSX1BFUk1JU1NJT05TKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YSh1c2VyLCBEQmtleXMuQ1VSUkVOVF9VU0VSKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHJlbWVtYmVyTWUsIERCa2V5cy5SRU1FTUJFUl9NRSk7XG4gICAgfVxuXG4gICAgbG9nb3V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMpO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5DVVJSRU5UX1VTRVIpO1xuXG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMuY2xlYXJMb2NhbENoYW5nZXMoKTtcblxuICAgICAgICB0aGlzLnJlZXZhbHVhdGVMb2dpblN0YXR1cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVldmFsdWF0ZUxvZ2luU3RhdHVzKGN1cnJlbnRVc2VyPzogVXNlcikge1xuICAgICAgICBjb25zdCB1c2VyID0gY3VycmVudFVzZXIgfHwgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxVc2VyPihEQmtleXMuQ1VSUkVOVF9VU0VSLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IGlzTG9nZ2VkSW4gPSB1c2VyICE9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmlvdXNJc0xvZ2dlZEluQ2hlY2sgIT0gaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9naW5TdGF0dXMubmV4dChpc0xvZ2dlZEluKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmV2aW91c0lzTG9nZ2VkSW5DaGVjayA9IGlzTG9nZ2VkSW47XG4gICAgfVxuXG4gICAgZ2V0TG9naW5TdGF0dXNFdmVudCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luU3RhdHVzLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50VXNlcigpOiBVc2VyIHtcblxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxVc2VyPihEQmtleXMuQ1VSUkVOVF9VU0VSLCBmYWxzZSk7XG4gICAgICAgIHRoaXMucmVldmFsdWF0ZUxvZ2luU3RhdHVzKHVzZXIpO1xuXG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgIH1cblxuICAgIGdldCB1c2VyUGVybWlzc2lvbnMoKTogUGVybWlzc2lvblZhbHVlc1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8UGVybWlzc2lvblZhbHVlc1tdPihEQmtleXMuVVNFUl9QRVJNSVNTSU9OUywgZmFsc2UpIHx8IFtdO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5hY2Nlc3NUb2tlbjtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW5FeHBpcnlEYXRlKCk6IERhdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5hY2Nlc3NUb2tlbkV4cGlyeURhdGU7XG4gICAgfVxuXG4gICAgZ2V0IHJlZnJlc2hUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5yZWZyZXNoVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0IGlzU2Vzc2lvbkV4cGlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmlzU2Vzc2lvbkV4cGlyZWQ7XG4gICAgfVxuXG4gICAgZ2V0IGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVc2VyICE9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IHJlbWVtYmVyTWUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PGJvb2xlYW4+KERCa2V5cy5SRU1FTUJFUl9NRSwgZmFsc2UpID09IHRydWU7XG4gICAgfVxufVxuIl19