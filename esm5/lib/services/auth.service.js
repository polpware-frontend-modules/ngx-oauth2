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
var AuthService = /** @class */ (function () {
    function AuthService(router, oidcHelperService, configurationServiceProvider, localStoreManagerProvider) {
        this.router = router;
        this.oidcHelperService = oidcHelperService;
        this.previousIsLoggedInCheck = false;
        this._loginStatus = new Subject();
        this.localStorage = localStoreManagerProvider.get();
        this.configurations = configurationServiceProvider.get();
        this.initializeLoginStatus();
    }
    Object.defineProperty(AuthService.prototype, "loginUrl", {
        get: /**
         * @return {?}
         */
        function () { return this.configurations.loginUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "homeUrl", {
        get: /**
         * @return {?}
         */
        function () { return this.configurations.homeUrl; },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @return {?}
     */
    AuthService.prototype.initializeLoginStatus = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.localStorage.getInitEvent().subscribe((/**
         * @return {?}
         */
        function () {
            _this.reevaluateLoginStatus();
        }));
    };
    /**
     * @param {?} page
     * @param {?=} preserveParams
     * @return {?}
     */
    AuthService.prototype.gotoPage = /**
     * @param {?} page
     * @param {?=} preserveParams
     * @return {?}
     */
    function (page, preserveParams) {
        if (preserveParams === void 0) { preserveParams = true; }
        /** @type {?} */
        var navigationExtras = {
            queryParamsHandling: preserveParams ? 'merge' : '', preserveFragment: preserveParams
        };
        this.router.navigate([page], navigationExtras);
    };
    /**
     * @return {?}
     */
    AuthService.prototype.gotoHomePage = /**
     * @return {?}
     */
    function () {
        this.router.navigate([this.homeUrl]);
    };
    /**
     * @return {?}
     */
    AuthService.prototype.redirectLoginUser = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationServiceConstants.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
        /** @type {?} */
        var urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        /** @type {?} */
        var urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');
        /** @type {?} */
        var navigationExtras = {
            fragment: urlParamsAndFragment.secondPart,
            queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
            queryParamsHandling: 'merge'
        };
        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    };
    /**
     * @return {?}
     */
    AuthService.prototype.redirectLogoutUser = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;
        this.router.navigate([redirect]);
    };
    /**
     * @param {?=} redirectUrl
     * @return {?}
     */
    AuthService.prototype.redirectForLogin = /**
     * @param {?=} redirectUrl
     * @return {?}
     */
    function (redirectUrl) {
        if (redirectUrl) {
            this.loginRedirectUrl = redirectUrl;
        }
        else {
            this.loginRedirectUrl = this.router.url;
        }
        this.router.navigate([this.loginUrl]);
    };
    /**
     * @return {?}
     */
    AuthService.prototype.reLogin = /**
     * @return {?}
     */
    function () {
        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    };
    /**
     * @return {?}
     */
    AuthService.prototype.refreshLogin = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.oidcHelperService.refreshLogin()
            .pipe(map((/**
         * @param {?} resp
         * @return {?}
         */
        function (resp) { return _this.processLoginResponse(resp, _this.rememberMe); })));
    };
    /**
     * @param {?} userName
     * @param {?} password
     * @param {?=} rememberMe
     * @return {?}
     */
    AuthService.prototype.loginWithPassword = /**
     * @param {?} userName
     * @param {?} password
     * @param {?=} rememberMe
     * @return {?}
     */
    function (userName, password, rememberMe) {
        var _this = this;
        if (this.isLoggedIn) {
            this.logout();
        }
        return this.oidcHelperService.loginWithPassword(userName, password)
            .pipe(map((/**
         * @param {?} resp
         * @return {?}
         */
        function (resp) { return _this.processLoginResponse(resp, rememberMe); })));
    };
    /**
     * @private
     * @param {?} response
     * @param {?=} rememberMe
     * @return {?}
     */
    AuthService.prototype.processLoginResponse = /**
     * @private
     * @param {?} response
     * @param {?=} rememberMe
     * @return {?}
     */
    function (response, rememberMe) {
        /** @type {?} */
        var accessToken = response.access_token;
        if (accessToken == null) {
            throw new Error('accessToken cannot be null');
        }
        rememberMe = rememberMe || this.rememberMe;
        /** @type {?} */
        var refreshToken = response.refresh_token || this.refreshToken;
        /** @type {?} */
        var expiresIn = response.expires_in;
        /** @type {?} */
        var tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
        /** @type {?} */
        var accessTokenExpiry = tokenExpiryDate;
        /** @type {?} */
        var jwtHelper = new JwtHelper();
        /** @type {?} */
        var decodedAccessToken = (/** @type {?} */ (jwtHelper.decodeToken(accessToken)));
        /** @type {?} */
        var permissions = Array.isArray(decodedAccessToken.permission) ? decodedAccessToken.permission : [decodedAccessToken.permission];
        if (!this.isLoggedIn) {
            this.configurations.import(decodedAccessToken.configuration);
        }
        /** @type {?} */
        var user = new User(decodedAccessToken.sub, decodedAccessToken.name, decodedAccessToken.fullname, decodedAccessToken.email, decodedAccessToken.jobtitle, decodedAccessToken.phone_number, Array.isArray(decodedAccessToken.role) ? decodedAccessToken.role : [decodedAccessToken.role]);
        user.isEnabled = true;
        this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, rememberMe);
        this.reevaluateLoginStatus(user);
        return user;
    };
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
    AuthService.prototype.saveUserDetails = /**
     * @private
     * @param {?} user
     * @param {?} permissions
     * @param {?} accessToken
     * @param {?} refreshToken
     * @param {?} expiresIn
     * @param {?} rememberMe
     * @return {?}
     */
    function (user, permissions, accessToken, refreshToken, expiresIn, rememberMe) {
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
    };
    /**
     * @return {?}
     */
    AuthService.prototype.logout = /**
     * @return {?}
     */
    function () {
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);
        this.configurations.clearLocalChanges();
        this.reevaluateLoginStatus();
    };
    /**
     * @private
     * @param {?=} currentUser
     * @return {?}
     */
    AuthService.prototype.reevaluateLoginStatus = /**
     * @private
     * @param {?=} currentUser
     * @return {?}
     */
    function (currentUser) {
        var _this = this;
        /** @type {?} */
        var user = currentUser || this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
        /** @type {?} */
        var isLoggedIn = user != null;
        if (this.previousIsLoggedInCheck != isLoggedIn) {
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this._loginStatus.next(isLoggedIn);
            }));
        }
        this.previousIsLoggedInCheck = isLoggedIn;
    };
    /**
     * @return {?}
     */
    AuthService.prototype.getLoginStatusEvent = /**
     * @return {?}
     */
    function () {
        return this._loginStatus.asObservable();
    };
    Object.defineProperty(AuthService.prototype, "currentUser", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var user = this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
            this.reevaluateLoginStatus(user);
            return user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "userPermissions", {
        get: /**
         * @return {?}
         */
        function () {
            return this.localStorage.getDataObject(DBkeys.USER_PERMISSIONS, false) || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "accessToken", {
        get: /**
         * @return {?}
         */
        function () {
            return this.oidcHelperService.accessToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "accessTokenExpiryDate", {
        get: /**
         * @return {?}
         */
        function () {
            return this.oidcHelperService.accessTokenExpiryDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "refreshToken", {
        get: /**
         * @return {?}
         */
        function () {
            return this.oidcHelperService.refreshToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "isSessionExpired", {
        get: /**
         * @return {?}
         */
        function () {
            return this.oidcHelperService.isSessionExpired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "isLoggedIn", {
        get: /**
         * @return {?}
         */
        function () {
            return this.currentUser != null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "rememberMe", {
        get: /**
         * @return {?}
         */
        function () {
            return this.localStorage.getDataObject(DBkeys.REMEMBER_ME, false) == true;
        },
        enumerable: true,
        configurable: true
    });
    AuthService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    AuthService.ctorParameters = function () { return [
        { type: Router },
        { type: OidcHelperService },
        { type: ConfigurationServiceAbstractProvider },
        { type: LocalStoreManagerServiceAbstractProvider }
    ]; };
    return AuthService;
}());
export { AuthService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBb0IsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRCxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBRUgsd0NBQXdDLEVBRXhDLG9DQUFvQyxFQUNwQyxTQUFTLEVBQ1QsTUFBTSxFQUNOLDZCQUE2QixFQUNoQyxNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRzVDO0lBZ0JJLHFCQUNZLE1BQWMsRUFDZCxpQkFBb0MsRUFDNUMsNEJBQWtFLEVBQ2xFLHlCQUFtRTtRQUgzRCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQVJ4Qyw0QkFBdUIsR0FBRyxLQUFLLENBQUM7UUFDaEMsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBVzFDLElBQUksQ0FBQyxZQUFZLEdBQUcseUJBQXlCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGNBQWMsR0FBRyw0QkFBNEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUV6RCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBeEJELHNCQUFXLGlDQUFROzs7O1FB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QUFXLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3ZGLENBQUM7OztPQUFBOztnQkEvTkosVUFBVTs7OztnQkFwQkYsTUFBTTtnQkFjTixpQkFBaUI7Z0JBTnRCLG9DQUFvQztnQkFGcEMsd0NBQXdDOztJQThPNUMsa0JBQUM7Q0FBQSxBQWhPRCxJQWdPQztTQS9OWSxXQUFXOzs7SUFJcEIsdUNBQWdDOztJQUNoQyx3Q0FBaUM7O0lBRWpDLHNDQUFtQzs7Ozs7SUFFbkMsOENBQXdDOzs7OztJQUN4QyxtQ0FBOEM7Ozs7O0lBRTlDLG1DQUFpRDs7Ozs7SUFDakQscUNBQXNEOzs7OztJQUdsRCw2QkFBc0I7Ozs7O0lBQ3RCLHdDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFbWFpbDogaW5mb0BlYmVubW9ubmV5LmNvbVxuLy8gd3d3LmViZW5tb25uZXkuY29tL3RlbXBsYXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgICBJTG9jYWxTdG9yZU1hbmFnZXJDb250cmFjdCxcbiAgICBMb2NhbFN0b3JlTWFuYWdlclNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIElDb25maWd1cmF0aW9uU2VydmljZUNvbnRyYWN0LFxuICAgIENvbmZpZ3VyYXRpb25TZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICBVdGlsaXRpZXMsXG4gICAgREJrZXlzLFxuICAgIENvbmZpZ3VyYXRpb25TZXJ2aWNlQ29uc3RhbnRzXG59IGZyb20gJ0Bwb2xwd2FyZS9uZ3gtYXBwa2l0LWNvbnRyYWN0cy1hbHBoYSc7XG5cbmltcG9ydCB7IE9pZGNIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IEp3dEhlbHBlciB9IGZyb20gJy4vand0LWhlbHBlcic7XG5pbXBvcnQgeyBBY2Nlc3NUb2tlbiwgTG9naW5SZXNwb25zZSB9IGZyb20gJy4uL21vZGVscy9sb2dpbi1yZXNwb25zZS5tb2RlbCc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vbW9kZWxzL3VzZXIubW9kZWwnO1xuaW1wb3J0IHsgUGVybWlzc2lvblZhbHVlcyB9IGZyb20gJy4uL21vZGVscy9wZXJtaXNzaW9uLm1vZGVsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcbiAgICBwdWJsaWMgZ2V0IGxvZ2luVXJsKCkgeyByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9ucy5sb2dpblVybDsgfVxuICAgIHB1YmxpYyBnZXQgaG9tZVVybCgpIHsgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbnMuaG9tZVVybDsgfVxuXG4gICAgcHVibGljIGxvZ2luUmVkaXJlY3RVcmw6IHN0cmluZztcbiAgICBwdWJsaWMgbG9nb3V0UmVkaXJlY3RVcmw6IHN0cmluZztcblxuICAgIHB1YmxpYyByZUxvZ2luRGVsZWdhdGU6ICgpID0+IHZvaWQ7XG5cbiAgICBwcml2YXRlIHByZXZpb3VzSXNMb2dnZWRJbkNoZWNrID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfbG9naW5TdGF0dXMgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgcHJpdmF0ZSBsb2NhbFN0b3JhZ2U6IElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0O1xuICAgIHByaXZhdGUgY29uZmlndXJhdGlvbnM6IElDb25maWd1cmF0aW9uU2VydmljZUNvbnRyYWN0O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgb2lkY0hlbHBlclNlcnZpY2U6IE9pZGNIZWxwZXJTZXJ2aWNlLFxuICAgICAgICBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyOiBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgICAgIGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXI6IExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXIuZ2V0KCk7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMgPSBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyLmdldCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxvZ2luU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplTG9naW5TdGF0dXMoKSB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmdldEluaXRFdmVudCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlZXZhbHVhdGVMb2dpblN0YXR1cygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnb3RvUGFnZShwYWdlOiBzdHJpbmcsIHByZXNlcnZlUGFyYW1zID0gdHJ1ZSkge1xuXG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBxdWVyeVBhcmFtc0hhbmRsaW5nOiBwcmVzZXJ2ZVBhcmFtcyA/ICdtZXJnZScgOiAnJywgcHJlc2VydmVGcmFnbWVudDogcHJlc2VydmVQYXJhbXNcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcGFnZV0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICAgIGdvdG9Ib21lUGFnZSgpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuaG9tZVVybF0pO1xuICAgIH1cblxuICAgIHJlZGlyZWN0TG9naW5Vc2VyKCkge1xuXG4gICAgICAgIGNvbnN0IHJlZGlyZWN0ID0gdGhpcy5sb2dpblJlZGlyZWN0VXJsICYmIHRoaXMubG9naW5SZWRpcmVjdFVybCAhPSAnLycgJiYgdGhpcy5sb2dpblJlZGlyZWN0VXJsICE9IENvbmZpZ3VyYXRpb25TZXJ2aWNlQ29uc3RhbnRzLmRlZmF1bHRIb21lVXJsID8gdGhpcy5sb2dpblJlZGlyZWN0VXJsIDogdGhpcy5ob21lVXJsO1xuICAgICAgICB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0IHVybFBhcmFtc0FuZEZyYWdtZW50ID0gVXRpbGl0aWVzLnNwbGl0SW5Ud28ocmVkaXJlY3QsICcjJyk7XG4gICAgICAgIGNvbnN0IHVybEFuZFBhcmFtcyA9IFV0aWxpdGllcy5zcGxpdEluVHdvKHVybFBhcmFtc0FuZEZyYWdtZW50LmZpcnN0UGFydCwgJz8nKTtcblxuICAgICAgICBjb25zdCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuICAgICAgICAgICAgZnJhZ21lbnQ6IHVybFBhcmFtc0FuZEZyYWdtZW50LnNlY29uZFBhcnQsXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogVXRpbGl0aWVzLmdldFF1ZXJ5UGFyYW1zRnJvbVN0cmluZyh1cmxBbmRQYXJhbXMuc2Vjb25kUGFydCksXG4gICAgICAgICAgICBxdWVyeVBhcmFtc0hhbmRsaW5nOiAnbWVyZ2UnXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3VybEFuZFBhcmFtcy5maXJzdFBhcnRdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9XG5cbiAgICByZWRpcmVjdExvZ291dFVzZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlZGlyZWN0ID0gdGhpcy5sb2dvdXRSZWRpcmVjdFVybCA/IHRoaXMubG9nb3V0UmVkaXJlY3RVcmwgOiB0aGlzLmxvZ2luVXJsO1xuICAgICAgICB0aGlzLmxvZ291dFJlZGlyZWN0VXJsID0gbnVsbDtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcmVkaXJlY3RdKTtcbiAgICB9XG5cbiAgICByZWRpcmVjdEZvckxvZ2luKHJlZGlyZWN0VXJsPzogc3RyaW5nKSB7XG4gICAgICAgIGlmIChyZWRpcmVjdFVybCkge1xuICAgICAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gcmVkaXJlY3RVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgPSB0aGlzLnJvdXRlci51cmw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMubG9naW5VcmxdKTtcbiAgICB9XG5cbiAgICByZUxvZ2luKCkge1xuICAgICAgICBpZiAodGhpcy5yZUxvZ2luRGVsZWdhdGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVMb2dpbkRlbGVnYXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlZGlyZWN0Rm9yTG9naW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UucmVmcmVzaExvZ2luKClcbiAgICAgICAgICAgIC5waXBlKG1hcChyZXNwID0+IHRoaXMucHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcCwgdGhpcy5yZW1lbWJlck1lKSkpO1xuICAgIH1cblxuICAgIGxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHJlbWVtYmVyTWU/OiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIHRoaXMubG9nb3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5sb2dpbldpdGhQYXNzd29yZCh1c2VyTmFtZSwgcGFzc3dvcmQpXG4gICAgICAgICAgICAucGlwZShtYXAocmVzcCA9PiB0aGlzLnByb2Nlc3NMb2dpblJlc3BvbnNlKHJlc3AsIHJlbWVtYmVyTWUpKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzTG9naW5SZXNwb25zZShyZXNwb25zZTogTG9naW5SZXNwb25zZSwgcmVtZW1iZXJNZT86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXNwb25zZS5hY2Nlc3NfdG9rZW47XG5cbiAgICAgICAgaWYgKGFjY2Vzc1Rva2VuID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYWNjZXNzVG9rZW4gY2Fubm90IGJlIG51bGwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbWVtYmVyTWUgPSByZW1lbWJlck1lIHx8IHRoaXMucmVtZW1iZXJNZTtcblxuICAgICAgICBjb25zdCByZWZyZXNoVG9rZW4gPSByZXNwb25zZS5yZWZyZXNoX3Rva2VuIHx8IHRoaXMucmVmcmVzaFRva2VuO1xuICAgICAgICBjb25zdCBleHBpcmVzSW4gPSByZXNwb25zZS5leHBpcmVzX2luO1xuICAgICAgICBjb25zdCB0b2tlbkV4cGlyeURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0b2tlbkV4cGlyeURhdGUuc2V0U2Vjb25kcyh0b2tlbkV4cGlyeURhdGUuZ2V0U2Vjb25kcygpICsgZXhwaXJlc0luKTtcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW5FeHBpcnkgPSB0b2tlbkV4cGlyeURhdGU7XG4gICAgICAgIGNvbnN0IGp3dEhlbHBlciA9IG5ldyBKd3RIZWxwZXIoKTtcbiAgICAgICAgY29uc3QgZGVjb2RlZEFjY2Vzc1Rva2VuID0gand0SGVscGVyLmRlY29kZVRva2VuKGFjY2Vzc1Rva2VuKSBhcyBBY2Nlc3NUb2tlbjtcblxuICAgICAgICBjb25zdCBwZXJtaXNzaW9uczogUGVybWlzc2lvblZhbHVlc1tdID0gQXJyYXkuaXNBcnJheShkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbikgPyBkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbiA6IFtkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbl07XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMuaW1wb3J0KGRlY29kZWRBY2Nlc3NUb2tlbi5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcihcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5zdWIsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4ubmFtZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5mdWxsbmFtZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5lbWFpbCxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5qb2J0aXRsZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5waG9uZV9udW1iZXIsXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KGRlY29kZWRBY2Nlc3NUb2tlbi5yb2xlKSA/IGRlY29kZWRBY2Nlc3NUb2tlbi5yb2xlIDogW2RlY29kZWRBY2Nlc3NUb2tlbi5yb2xlXSk7XG4gICAgICAgIHVzZXIuaXNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNhdmVVc2VyRGV0YWlscyh1c2VyLCBwZXJtaXNzaW9ucywgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbiwgYWNjZXNzVG9rZW5FeHBpcnksIHJlbWVtYmVyTWUpO1xuXG4gICAgICAgIHRoaXMucmVldmFsdWF0ZUxvZ2luU3RhdHVzKHVzZXIpO1xuXG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2F2ZVVzZXJEZXRhaWxzKHVzZXI6IFVzZXIsIHBlcm1pc3Npb25zOiBQZXJtaXNzaW9uVmFsdWVzW10sIGFjY2Vzc1Rva2VuOiBzdHJpbmcsIHJlZnJlc2hUb2tlbjogc3RyaW5nLCBleHBpcmVzSW46IERhdGUsIHJlbWVtYmVyTWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHJlbWVtYmVyTWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKGFjY2Vzc1Rva2VuLCBEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHJlZnJlc2hUb2tlbiwgREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEoZXhwaXJlc0luLCBEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShwZXJtaXNzaW9ucywgREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEodXNlciwgREJrZXlzLkNVUlJFTlRfVVNFUik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEoYWNjZXNzVG9rZW4sIERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKHJlZnJlc2hUb2tlbiwgREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKGV4cGlyZXNJbiwgREJrZXlzLlRPS0VOX0VYUElSRVNfSU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKHBlcm1pc3Npb25zLCBEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEodXNlciwgREJrZXlzLkNVUlJFTlRfVVNFUik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShyZW1lbWJlck1lLCBEQmtleXMuUkVNRU1CRVJfTUUpO1xuICAgIH1cblxuICAgIGxvZ291dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLlRPS0VOX0VYUElSRVNfSU4pO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5VU0VSX1BFUk1JU1NJT05TKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuQ1VSUkVOVF9VU0VSKTtcblxuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25zLmNsZWFyTG9jYWxDaGFuZ2VzKCk7XG5cbiAgICAgICAgdGhpcy5yZWV2YWx1YXRlTG9naW5TdGF0dXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZXZhbHVhdGVMb2dpblN0YXR1cyhjdXJyZW50VXNlcj86IFVzZXIpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IGN1cnJlbnRVc2VyIHx8IHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8VXNlcj4oREJrZXlzLkNVUlJFTlRfVVNFUiwgZmFsc2UpO1xuICAgICAgICBjb25zdCBpc0xvZ2dlZEluID0gdXNlciAhPSBudWxsO1xuXG4gICAgICAgIGlmICh0aGlzLnByZXZpb3VzSXNMb2dnZWRJbkNoZWNrICE9IGlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2luU3RhdHVzLm5leHQoaXNMb2dnZWRJbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJldmlvdXNJc0xvZ2dlZEluQ2hlY2sgPSBpc0xvZ2dlZEluO1xuICAgIH1cblxuICAgIGdldExvZ2luU3RhdHVzRXZlbnQoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpblN0YXR1cy5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBnZXQgY3VycmVudFVzZXIoKTogVXNlciB7XG5cbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8VXNlcj4oREJrZXlzLkNVUlJFTlRfVVNFUiwgZmFsc2UpO1xuICAgICAgICB0aGlzLnJlZXZhbHVhdGVMb2dpblN0YXR1cyh1c2VyKTtcblxuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9XG5cbiAgICBnZXQgdXNlclBlcm1pc3Npb25zKCk6IFBlcm1pc3Npb25WYWx1ZXNbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PFBlcm1pc3Npb25WYWx1ZXNbXT4oREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMsIGZhbHNlKSB8fCBbXTtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UuYWNjZXNzVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0IGFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZSgpOiBEYXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UuYWNjZXNzVG9rZW5FeHBpcnlEYXRlO1xuICAgIH1cblxuICAgIGdldCByZWZyZXNoVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UucmVmcmVzaFRva2VuO1xuICAgIH1cblxuICAgIGdldCBpc1Nlc3Npb25FeHBpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5pc1Nlc3Npb25FeHBpcmVkO1xuICAgIH1cblxuICAgIGdldCBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VXNlciAhPSBudWxsO1xuICAgIH1cblxuICAgIGdldCByZW1lbWJlck1lKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxib29sZWFuPihEQmtleXMuUkVNRU1CRVJfTUUsIGZhbHNlKSA9PSB0cnVlO1xuICAgIH1cbn1cbiJdfQ==