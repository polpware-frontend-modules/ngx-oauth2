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
import { Subject } from 'rxjs';
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
        /** @type {?} */
        const redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationServiceConstants.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBb0IsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRCxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBRUgsd0NBQXdDLEVBRXhDLG9DQUFvQyxFQUNwQyxTQUFTLEVBQ1QsTUFBTSxFQUNOLDZCQUE2QixFQUNoQyxNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBSTVDLE1BQU0sT0FBTyxXQUFXOzs7Ozs7O0lBZXBCLFlBQ1ksTUFBYyxFQUNkLGlCQUFvQyxFQUM1Qyw0QkFBa0UsRUFDbEUseUJBQW1FO1FBSDNELFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBUnhDLDRCQUF1QixHQUFHLEtBQUssQ0FBQztRQUNoQyxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFXMUMsSUFBSSxDQUFDLFlBQVksR0FBRyx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXpELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Ozs7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aWw6IGluZm9AZWJlbm1vbm5leS5jb21cbi8vIHd3dy5lYmVubW9ubmV5LmNvbS90ZW1wbGF0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gICAgSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3QsXG4gICAgTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdCxcbiAgICBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgVXRpbGl0aWVzLFxuICAgIERCa2V5cyxcbiAgICBDb25maWd1cmF0aW9uU2VydmljZUNvbnN0YW50c1xufSBmcm9tICdAcG9scHdhcmUvbmd4LWFwcGtpdC1jb250cmFjdHMtYWxwaGEnO1xuXG5pbXBvcnQgeyBPaWRjSGVscGVyU2VydmljZSB9IGZyb20gJy4vb2lkYy1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBKd3RIZWxwZXIgfSBmcm9tICcuL2p3dC1oZWxwZXInO1xuaW1wb3J0IHsgQWNjZXNzVG9rZW4sIExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvbG9naW4tcmVzcG9uc2UubW9kZWwnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL21vZGVscy91c2VyLm1vZGVsJztcbmltcG9ydCB7IFBlcm1pc3Npb25WYWx1ZXMgfSBmcm9tICcuLi9tb2RlbHMvcGVybWlzc2lvbi5tb2RlbCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG4gICAgcHVibGljIGdldCBsb2dpblVybCgpIHsgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbnMubG9naW5Vcmw7IH1cbiAgICBwdWJsaWMgZ2V0IGhvbWVVcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmhvbWVVcmw7IH1cblxuICAgIHB1YmxpYyBsb2dpblJlZGlyZWN0VXJsOiBzdHJpbmc7XG4gICAgcHVibGljIGxvZ291dFJlZGlyZWN0VXJsOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgcmVMb2dpbkRlbGVnYXRlOiAoKSA9PiB2b2lkO1xuXG4gICAgcHJpdmF0ZSBwcmV2aW91c0lzTG9nZ2VkSW5DaGVjayA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2xvZ2luU3RhdHVzID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIHByaXZhdGUgbG9jYWxTdG9yYWdlOiBJTG9jYWxTdG9yZU1hbmFnZXJDb250cmFjdDtcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25zOiBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIG9pZGNIZWxwZXJTZXJ2aWNlOiBPaWRjSGVscGVyU2VydmljZSxcbiAgICAgICAgY29uZmlndXJhdGlvblNlcnZpY2VQcm92aWRlcjogQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgICAgICBsb2NhbFN0b3JlTWFuYWdlclByb3ZpZGVyOiBMb2NhbFN0b3JlTWFuYWdlclNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyKSB7XG5cbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JlTWFuYWdlclByb3ZpZGVyLmdldCgpO1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25zID0gY29uZmlndXJhdGlvblNlcnZpY2VQcm92aWRlci5nZXQoKTtcblxuICAgICAgICB0aGlzLmluaXRpYWxpemVMb2dpblN0YXR1cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZUxvZ2luU3RhdHVzKCkge1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5nZXRJbml0RXZlbnQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWV2YWx1YXRlTG9naW5TdGF0dXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ290b1BhZ2UocGFnZTogc3RyaW5nLCBwcmVzZXJ2ZVBhcmFtcyA9IHRydWUpIHtcblxuICAgICAgICBjb25zdCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuICAgICAgICAgICAgcXVlcnlQYXJhbXNIYW5kbGluZzogcHJlc2VydmVQYXJhbXMgPyAnbWVyZ2UnIDogJycsIHByZXNlcnZlRnJhZ21lbnQ6IHByZXNlcnZlUGFyYW1zXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3BhZ2VdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9XG5cbiAgICBnb3RvSG9tZVBhZ2UoKSB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmhvbWVVcmxdKTtcbiAgICB9XG5cbiAgICByZWRpcmVjdExvZ2luVXNlcigpIHtcblxuICAgICAgICBjb25zdCByZWRpcmVjdCA9IHRoaXMubG9naW5SZWRpcmVjdFVybCAmJiB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgIT0gJy8nICYmIHRoaXMubG9naW5SZWRpcmVjdFVybCAhPSBDb25maWd1cmF0aW9uU2VydmljZUNvbnN0YW50cy5kZWZhdWx0SG9tZVVybCA/IHRoaXMubG9naW5SZWRpcmVjdFVybCA6IHRoaXMuaG9tZVVybDtcbiAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gbnVsbDtcblxuICAgICAgICBjb25zdCB1cmxQYXJhbXNBbmRGcmFnbWVudCA9IFV0aWxpdGllcy5zcGxpdEluVHdvKHJlZGlyZWN0LCAnIycpO1xuICAgICAgICBjb25zdCB1cmxBbmRQYXJhbXMgPSBVdGlsaXRpZXMuc3BsaXRJblR3byh1cmxQYXJhbXNBbmRGcmFnbWVudC5maXJzdFBhcnQsICc/Jyk7XG5cbiAgICAgICAgY29uc3QgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcbiAgICAgICAgICAgIGZyYWdtZW50OiB1cmxQYXJhbXNBbmRGcmFnbWVudC5zZWNvbmRQYXJ0LFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IFV0aWxpdGllcy5nZXRRdWVyeVBhcmFtc0Zyb21TdHJpbmcodXJsQW5kUGFyYW1zLnNlY29uZFBhcnQpLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXNIYW5kbGluZzogJ21lcmdlJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt1cmxBbmRQYXJhbXMuZmlyc3RQYXJ0XSwgbmF2aWdhdGlvbkV4dHJhcyk7XG4gICAgfVxuXG4gICAgcmVkaXJlY3RMb2dvdXRVc2VyKCkge1xuICAgICAgICBjb25zdCByZWRpcmVjdCA9IHRoaXMubG9nb3V0UmVkaXJlY3RVcmwgPyB0aGlzLmxvZ291dFJlZGlyZWN0VXJsIDogdGhpcy5sb2dpblVybDtcbiAgICAgICAgdGhpcy5sb2dvdXRSZWRpcmVjdFVybCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JlZGlyZWN0XSk7XG4gICAgfVxuXG4gICAgcmVkaXJlY3RGb3JMb2dpbihyZWRpcmVjdFVybD86IHN0cmluZykge1xuICAgICAgICBpZiAocmVkaXJlY3RVcmwpIHtcbiAgICAgICAgICAgIHRoaXMubG9naW5SZWRpcmVjdFVybCA9IHJlZGlyZWN0VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gdGhpcy5yb3V0ZXIudXJsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmxvZ2luVXJsXSk7XG4gICAgfVxuXG4gICAgcmVMb2dpbigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVMb2dpbkRlbGVnYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnJlTG9naW5EZWxlZ2F0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWRpcmVjdEZvckxvZ2luKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoTG9naW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLnJlZnJlc2hMb2dpbigpXG4gICAgICAgICAgICAucGlwZShtYXAocmVzcCA9PiB0aGlzLnByb2Nlc3NMb2dpblJlc3BvbnNlKHJlc3AsIHRoaXMucmVtZW1iZXJNZSkpKTtcbiAgICB9XG5cbiAgICBsb2dpbldpdGhQYXNzd29yZCh1c2VyTmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCByZW1lbWJlck1lPzogYm9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWUsIHBhc3N3b3JkKVxuICAgICAgICAgICAgLnBpcGUobWFwKHJlc3AgPT4gdGhpcy5wcm9jZXNzTG9naW5SZXNwb25zZShyZXNwLCByZW1lbWJlck1lKSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcG9uc2U6IExvZ2luUmVzcG9uc2UsIHJlbWVtYmVyTWU/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVzcG9uc2UuYWNjZXNzX3Rva2VuO1xuXG4gICAgICAgIGlmIChhY2Nlc3NUb2tlbiA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjY2Vzc1Rva2VuIGNhbm5vdCBiZSBudWxsJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1lbWJlck1lID0gcmVtZW1iZXJNZSB8fCB0aGlzLnJlbWVtYmVyTWU7XG5cbiAgICAgICAgY29uc3QgcmVmcmVzaFRva2VuID0gcmVzcG9uc2UucmVmcmVzaF90b2tlbiB8fCB0aGlzLnJlZnJlc2hUb2tlbjtcbiAgICAgICAgY29uc3QgZXhwaXJlc0luID0gcmVzcG9uc2UuZXhwaXJlc19pbjtcbiAgICAgICAgY29uc3QgdG9rZW5FeHBpcnlEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdG9rZW5FeHBpcnlEYXRlLnNldFNlY29uZHModG9rZW5FeHBpcnlEYXRlLmdldFNlY29uZHMoKSArIGV4cGlyZXNJbik7XG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuRXhwaXJ5ID0gdG9rZW5FeHBpcnlEYXRlO1xuICAgICAgICBjb25zdCBqd3RIZWxwZXIgPSBuZXcgSnd0SGVscGVyKCk7XG4gICAgICAgIGNvbnN0IGRlY29kZWRBY2Nlc3NUb2tlbiA9IGp3dEhlbHBlci5kZWNvZGVUb2tlbihhY2Nlc3NUb2tlbikgYXMgQWNjZXNzVG9rZW47XG5cbiAgICAgICAgY29uc3QgcGVybWlzc2lvbnM6IFBlcm1pc3Npb25WYWx1ZXNbXSA9IEFycmF5LmlzQXJyYXkoZGVjb2RlZEFjY2Vzc1Rva2VuLnBlcm1pc3Npb24pID8gZGVjb2RlZEFjY2Vzc1Rva2VuLnBlcm1pc3Npb24gOiBbZGVjb2RlZEFjY2Vzc1Rva2VuLnBlcm1pc3Npb25dO1xuXG4gICAgICAgIGlmICghdGhpcy5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25zLmltcG9ydChkZWNvZGVkQWNjZXNzVG9rZW4uY29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4uc3ViLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLm5hbWUsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4uZnVsbG5hbWUsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4uZW1haWwsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4uam9idGl0bGUsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4ucGhvbmVfbnVtYmVyLFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShkZWNvZGVkQWNjZXNzVG9rZW4ucm9sZSkgPyBkZWNvZGVkQWNjZXNzVG9rZW4ucm9sZSA6IFtkZWNvZGVkQWNjZXNzVG9rZW4ucm9sZV0pO1xuICAgICAgICB1c2VyLmlzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5zYXZlVXNlckRldGFpbHModXNlciwgcGVybWlzc2lvbnMsIGFjY2Vzc1Rva2VuLCByZWZyZXNoVG9rZW4sIGFjY2Vzc1Rva2VuRXhwaXJ5LCByZW1lbWJlck1lKTtcblxuICAgICAgICB0aGlzLnJlZXZhbHVhdGVMb2dpblN0YXR1cyh1c2VyKTtcblxuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmVVc2VyRGV0YWlscyh1c2VyOiBVc2VyLCBwZXJtaXNzaW9uczogUGVybWlzc2lvblZhbHVlc1tdLCBhY2Nlc3NUb2tlbjogc3RyaW5nLCByZWZyZXNoVG9rZW46IHN0cmluZywgZXhwaXJlc0luOiBEYXRlLCByZW1lbWJlck1lOiBib29sZWFuKSB7XG4gICAgICAgIGlmIChyZW1lbWJlck1lKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShhY2Nlc3NUb2tlbiwgREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShyZWZyZXNoVG9rZW4sIERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKGV4cGlyZXNJbiwgREJrZXlzLlRPS0VOX0VYUElSRVNfSU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEocGVybWlzc2lvbnMsIERCa2V5cy5VU0VSX1BFUk1JU1NJT05TKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHVzZXIsIERCa2V5cy5DVVJSRU5UX1VTRVIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKGFjY2Vzc1Rva2VuLCBEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShyZWZyZXNoVG9rZW4sIERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShleHBpcmVzSW4sIERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShwZXJtaXNzaW9ucywgREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKHVzZXIsIERCa2V5cy5DVVJSRU5UX1VTRVIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEocmVtZW1iZXJNZSwgREJrZXlzLlJFTUVNQkVSX01FKTtcbiAgICB9XG5cbiAgICBsb2dvdXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLkNVUlJFTlRfVVNFUik7XG5cbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucy5jbGVhckxvY2FsQ2hhbmdlcygpO1xuXG4gICAgICAgIHRoaXMucmVldmFsdWF0ZUxvZ2luU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWV2YWx1YXRlTG9naW5TdGF0dXMoY3VycmVudFVzZXI/OiBVc2VyKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBjdXJyZW50VXNlciB8fCB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PFVzZXI+KERCa2V5cy5DVVJSRU5UX1VTRVIsIGZhbHNlKTtcbiAgICAgICAgY29uc3QgaXNMb2dnZWRJbiA9IHVzZXIgIT0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5wcmV2aW91c0lzTG9nZ2VkSW5DaGVjayAhPSBpc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dpblN0YXR1cy5uZXh0KGlzTG9nZ2VkSW4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByZXZpb3VzSXNMb2dnZWRJbkNoZWNrID0gaXNMb2dnZWRJbjtcbiAgICB9XG5cbiAgICBnZXRMb2dpblN0YXR1c0V2ZW50KCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW5TdGF0dXMuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRVc2VyKCk6IFVzZXIge1xuXG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PFVzZXI+KERCa2V5cy5DVVJSRU5UX1VTRVIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5yZWV2YWx1YXRlTG9naW5TdGF0dXModXNlcik7XG5cbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfVxuXG4gICAgZ2V0IHVzZXJQZXJtaXNzaW9ucygpOiBQZXJtaXNzaW9uVmFsdWVzW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxQZXJtaXNzaW9uVmFsdWVzW10+KERCa2V5cy5VU0VSX1BFUk1JU1NJT05TLCBmYWxzZSkgfHwgW107XG4gICAgfVxuXG4gICAgZ2V0IGFjY2Vzc1Rva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmFjY2Vzc1Rva2VuO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbkV4cGlyeURhdGUoKTogRGF0ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZTtcbiAgICB9XG5cbiAgICBnZXQgcmVmcmVzaFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLnJlZnJlc2hUb2tlbjtcbiAgICB9XG5cbiAgICBnZXQgaXNTZXNzaW9uRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UuaXNTZXNzaW9uRXhwaXJlZDtcbiAgICB9XG5cbiAgICBnZXQgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFVzZXIgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgcmVtZW1iZXJNZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8Ym9vbGVhbj4oREJrZXlzLlJFTUVNQkVSX01FLCBmYWxzZSkgPT0gdHJ1ZTtcbiAgICB9XG59XG4iXX0=