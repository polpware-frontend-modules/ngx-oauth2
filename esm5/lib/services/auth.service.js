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
var AuthService = /** @class */ (function () {
    function AuthService(router, oidcHelperService, configurationServiceProvider, localStoreManagerProvider) {
        this.router = router;
        this.oidcHelperService = oidcHelperService;
        this.previousIsLoggedInCheck = false;
        this._loginStatus = new BehaviorSubject(false);
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
        console.log('loginRedirectUrl 2' + this.loginRedirectUrl);
        console.log(this.homeUrl);
        /** @type {?} */
        var redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationServiceConstants.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
        console.log('directurl=' + redirect);
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
     * @return {?}
     */
    AuthService.prototype.redirectForLogin = /**
     * @return {?}
     */
    function () {
        console.log('redirect for login');
        this.loginRedirectUrl = this.router.url;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBb0IsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRCxPQUFPLEVBQWMsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBRUgsd0NBQXdDLEVBRXhDLG9DQUFvQyxFQUNwQyxTQUFTLEVBQ1QsTUFBTSxFQUNOLDZCQUE2QixFQUNoQyxNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRzVDO0lBZ0JJLHFCQUNZLE1BQWMsRUFDZCxpQkFBb0MsRUFDNUMsNEJBQWtFLEVBQ2xFLHlCQUFtRTtRQUgzRCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQVJ4Qyw0QkFBdUIsR0FBRyxLQUFLLENBQUM7UUFDaEMsaUJBQVksR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQVd2RCxJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsNEJBQTRCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFekQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQXhCRCxzQkFBVyxp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Q0ksT0FBTyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztRQUNwQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLG1DQUFVOzs7O1FBQWQ7WUFDSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFVLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3ZGLENBQUM7OztPQUFBOztnQkFqT0osVUFBVTs7OztnQkFwQkYsTUFBTTtnQkFjTixpQkFBaUI7Z0JBTnRCLG9DQUFvQztnQkFGcEMsd0NBQXdDOztJQWdQNUMsa0JBQUM7Q0FBQSxBQWxPRCxJQWtPQztTQWpPWSxXQUFXOzs7SUFJcEIsdUNBQWdDOztJQUNoQyx3Q0FBaUM7O0lBRWpDLHNDQUFtQzs7Ozs7SUFFbkMsOENBQXdDOzs7OztJQUN4QyxtQ0FBMkQ7Ozs7O0lBRTNELG1DQUFpRDs7Ozs7SUFDakQscUNBQXNEOzs7OztJQUdsRCw2QkFBc0I7Ozs7O0lBQ3RCLHdDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFbWFpbDogaW5mb0BlYmVubW9ubmV5LmNvbVxuLy8gd3d3LmViZW5tb25uZXkuY29tL3RlbXBsYXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICAgIElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0LFxuICAgIExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3QsXG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIFV0aWxpdGllcyxcbiAgICBEQmtleXMsXG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VDb25zdGFudHNcbn0gZnJvbSAnQHBvbHB3YXJlL25neC1hcHBraXQtY29udHJhY3RzLWFscGhhJztcblxuaW1wb3J0IHsgT2lkY0hlbHBlclNlcnZpY2UgfSBmcm9tICcuL29pZGMtaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyJztcbmltcG9ydCB7IEFjY2Vzc1Rva2VuLCBMb2dpblJlc3BvbnNlIH0gZnJvbSAnLi4vbW9kZWxzL2xvZ2luLXJlc3BvbnNlLm1vZGVsJztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi9tb2RlbHMvdXNlci5tb2RlbCc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uVmFsdWVzIH0gZnJvbSAnLi4vbW9kZWxzL3Blcm1pc3Npb24ubW9kZWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuICAgIHB1YmxpYyBnZXQgbG9naW5VcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmxvZ2luVXJsOyB9XG4gICAgcHVibGljIGdldCBob21lVXJsKCkgeyByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9ucy5ob21lVXJsOyB9XG5cbiAgICBwdWJsaWMgbG9naW5SZWRpcmVjdFVybDogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2dvdXRSZWRpcmVjdFVybDogc3RyaW5nO1xuXG4gICAgcHVibGljIHJlTG9naW5EZWxlZ2F0ZTogKCkgPT4gdm9pZDtcblxuICAgIHByaXZhdGUgcHJldmlvdXNJc0xvZ2dlZEluQ2hlY2sgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9sb2dpblN0YXR1cyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gICAgcHJpdmF0ZSBsb2NhbFN0b3JhZ2U6IElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0O1xuICAgIHByaXZhdGUgY29uZmlndXJhdGlvbnM6IElDb25maWd1cmF0aW9uU2VydmljZUNvbnRyYWN0O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgb2lkY0hlbHBlclNlcnZpY2U6IE9pZGNIZWxwZXJTZXJ2aWNlLFxuICAgICAgICBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyOiBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgICAgIGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXI6IExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXIuZ2V0KCk7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMgPSBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyLmdldCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxvZ2luU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplTG9naW5TdGF0dXMoKSB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmdldEluaXRFdmVudCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlZXZhbHVhdGVMb2dpblN0YXR1cygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnb3RvUGFnZShwYWdlOiBzdHJpbmcsIHByZXNlcnZlUGFyYW1zID0gdHJ1ZSkge1xuXG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBxdWVyeVBhcmFtc0hhbmRsaW5nOiBwcmVzZXJ2ZVBhcmFtcyA/ICdtZXJnZScgOiAnJywgcHJlc2VydmVGcmFnbWVudDogcHJlc2VydmVQYXJhbXNcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcGFnZV0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICAgIGdvdG9Ib21lUGFnZSgpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuaG9tZVVybF0pO1xuICAgIH1cblxuICAgIHJlZGlyZWN0TG9naW5Vc2VyKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2dpblJlZGlyZWN0VXJsIDInICsgdGhpcy5sb2dpblJlZGlyZWN0VXJsKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5ob21lVXJsKTtcblxuICAgICAgICBjb25zdCByZWRpcmVjdCA9IHRoaXMubG9naW5SZWRpcmVjdFVybCAmJiB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgIT0gJy8nICYmIHRoaXMubG9naW5SZWRpcmVjdFVybCAhPSBDb25maWd1cmF0aW9uU2VydmljZUNvbnN0YW50cy5kZWZhdWx0SG9tZVVybCA/IHRoaXMubG9naW5SZWRpcmVjdFVybCA6IHRoaXMuaG9tZVVybDtcbiAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gbnVsbDtcblxuICAgICAgICBjb25zb2xlLmxvZygnZGlyZWN0dXJsPScgKyByZWRpcmVjdCk7XG5cbiAgICAgICAgY29uc3QgdXJsUGFyYW1zQW5kRnJhZ21lbnQgPSBVdGlsaXRpZXMuc3BsaXRJblR3byhyZWRpcmVjdCwgJyMnKTtcbiAgICAgICAgY29uc3QgdXJsQW5kUGFyYW1zID0gVXRpbGl0aWVzLnNwbGl0SW5Ud28odXJsUGFyYW1zQW5kRnJhZ21lbnQuZmlyc3RQYXJ0LCAnPycpO1xuXG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBmcmFnbWVudDogdXJsUGFyYW1zQW5kRnJhZ21lbnQuc2Vjb25kUGFydCxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiBVdGlsaXRpZXMuZ2V0UXVlcnlQYXJhbXNGcm9tU3RyaW5nKHVybEFuZFBhcmFtcy5zZWNvbmRQYXJ0KSxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zSGFuZGxpbmc6ICdtZXJnZSdcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsQW5kUGFyYW1zLmZpcnN0UGFydF0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICAgIHJlZGlyZWN0TG9nb3V0VXNlcigpIHtcbiAgICAgICAgY29uc3QgcmVkaXJlY3QgPSB0aGlzLmxvZ291dFJlZGlyZWN0VXJsID8gdGhpcy5sb2dvdXRSZWRpcmVjdFVybCA6IHRoaXMubG9naW5Vcmw7XG4gICAgICAgIHRoaXMubG9nb3V0UmVkaXJlY3RVcmwgPSBudWxsO1xuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtyZWRpcmVjdF0pO1xuICAgIH1cblxuICAgIHJlZGlyZWN0Rm9yTG9naW4oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWRpcmVjdCBmb3IgbG9naW4nKTtcbiAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gdGhpcy5yb3V0ZXIudXJsO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5sb2dpblVybF0pO1xuICAgIH1cblxuICAgIHJlTG9naW4oKSB7XG4gICAgICAgIGlmICh0aGlzLnJlTG9naW5EZWxlZ2F0ZSkge1xuICAgICAgICAgICAgdGhpcy5yZUxvZ2luRGVsZWdhdGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVkaXJlY3RGb3JMb2dpbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVmcmVzaExvZ2luKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5yZWZyZXNoTG9naW4oKVxuICAgICAgICAgICAgLnBpcGUobWFwKHJlc3AgPT4gdGhpcy5wcm9jZXNzTG9naW5SZXNwb25zZShyZXNwLCB0aGlzLnJlbWVtYmVyTWUpKSk7XG4gICAgfVxuXG4gICAgbG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgcmVtZW1iZXJNZT86IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lLCBwYXNzd29yZClcbiAgICAgICAgICAgIC5waXBlKG1hcChyZXNwID0+IHRoaXMucHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcCwgcmVtZW1iZXJNZSkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NMb2dpblJlc3BvbnNlKHJlc3BvbnNlOiBMb2dpblJlc3BvbnNlLCByZW1lbWJlck1lPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmFjY2Vzc190b2tlbjtcblxuICAgICAgICBpZiAoYWNjZXNzVG9rZW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhY2Nlc3NUb2tlbiBjYW5ub3QgYmUgbnVsbCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtZW1iZXJNZSA9IHJlbWVtYmVyTWUgfHwgdGhpcy5yZW1lbWJlck1lO1xuXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4gfHwgdGhpcy5yZWZyZXNoVG9rZW47XG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHJlc3BvbnNlLmV4cGlyZXNfaW47XG4gICAgICAgIGNvbnN0IHRva2VuRXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRva2VuRXhwaXJ5RGF0ZS5zZXRTZWNvbmRzKHRva2VuRXhwaXJ5RGF0ZS5nZXRTZWNvbmRzKCkgKyBleHBpcmVzSW4pO1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbkV4cGlyeSA9IHRva2VuRXhwaXJ5RGF0ZTtcbiAgICAgICAgY29uc3Qgand0SGVscGVyID0gbmV3IEp3dEhlbHBlcigpO1xuICAgICAgICBjb25zdCBkZWNvZGVkQWNjZXNzVG9rZW4gPSBqd3RIZWxwZXIuZGVjb2RlVG9rZW4oYWNjZXNzVG9rZW4pIGFzIEFjY2Vzc1Rva2VuO1xuXG4gICAgICAgIGNvbnN0IHBlcm1pc3Npb25zOiBQZXJtaXNzaW9uVmFsdWVzW10gPSBBcnJheS5pc0FycmF5KGRlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uKSA/IGRlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uIDogW2RlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uXTtcblxuICAgICAgICBpZiAoIXRoaXMuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucy5pbXBvcnQoZGVjb2RlZEFjY2Vzc1Rva2VuLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLnN1YixcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5uYW1lLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmZ1bGxuYW1lLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmVtYWlsLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmpvYnRpdGxlLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLnBob25lX251bWJlcixcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGUpID8gZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGUgOiBbZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGVdKTtcbiAgICAgICAgdXNlci5pc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc2F2ZVVzZXJEZXRhaWxzKHVzZXIsIHBlcm1pc3Npb25zLCBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuLCBhY2Nlc3NUb2tlbkV4cGlyeSwgcmVtZW1iZXJNZSk7XG5cbiAgICAgICAgdGhpcy5yZWV2YWx1YXRlTG9naW5TdGF0dXModXNlcik7XG5cbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlVXNlckRldGFpbHModXNlcjogVXNlciwgcGVybWlzc2lvbnM6IFBlcm1pc3Npb25WYWx1ZXNbXSwgYWNjZXNzVG9rZW46IHN0cmluZywgcmVmcmVzaFRva2VuOiBzdHJpbmcsIGV4cGlyZXNJbjogRGF0ZSwgcmVtZW1iZXJNZTogYm9vbGVhbikge1xuICAgICAgICBpZiAocmVtZW1iZXJNZSkge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEoYWNjZXNzVG9rZW4sIERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEocmVmcmVzaFRva2VuLCBEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShleHBpcmVzSW4sIERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHBlcm1pc3Npb25zLCBEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YSh1c2VyLCBEQmtleXMuQ1VSUkVOVF9VU0VSKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShhY2Nlc3NUb2tlbiwgREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEocmVmcmVzaFRva2VuLCBEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEoZXhwaXJlc0luLCBEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEocGVybWlzc2lvbnMsIERCa2V5cy5VU0VSX1BFUk1JU1NJT05TKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YSh1c2VyLCBEQmtleXMuQ1VSUkVOVF9VU0VSKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHJlbWVtYmVyTWUsIERCa2V5cy5SRU1FTUJFUl9NRSk7XG4gICAgfVxuXG4gICAgbG9nb3V0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMpO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5DVVJSRU5UX1VTRVIpO1xuXG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMuY2xlYXJMb2NhbENoYW5nZXMoKTtcblxuICAgICAgICB0aGlzLnJlZXZhbHVhdGVMb2dpblN0YXR1cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVldmFsdWF0ZUxvZ2luU3RhdHVzKGN1cnJlbnRVc2VyPzogVXNlcikge1xuICAgICAgICBjb25zdCB1c2VyID0gY3VycmVudFVzZXIgfHwgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxVc2VyPihEQmtleXMuQ1VSUkVOVF9VU0VSLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IGlzTG9nZ2VkSW4gPSB1c2VyICE9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmlvdXNJc0xvZ2dlZEluQ2hlY2sgIT0gaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9naW5TdGF0dXMubmV4dChpc0xvZ2dlZEluKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmV2aW91c0lzTG9nZ2VkSW5DaGVjayA9IGlzTG9nZ2VkSW47XG4gICAgfVxuXG4gICAgZ2V0TG9naW5TdGF0dXNFdmVudCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luU3RhdHVzLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50VXNlcigpOiBVc2VyIHtcblxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxVc2VyPihEQmtleXMuQ1VSUkVOVF9VU0VSLCBmYWxzZSk7XG4gICAgICAgIHRoaXMucmVldmFsdWF0ZUxvZ2luU3RhdHVzKHVzZXIpO1xuXG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgIH1cblxuICAgIGdldCB1c2VyUGVybWlzc2lvbnMoKTogUGVybWlzc2lvblZhbHVlc1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8UGVybWlzc2lvblZhbHVlc1tdPihEQmtleXMuVVNFUl9QRVJNSVNTSU9OUywgZmFsc2UpIHx8IFtdO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5hY2Nlc3NUb2tlbjtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW5FeHBpcnlEYXRlKCk6IERhdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5hY2Nlc3NUb2tlbkV4cGlyeURhdGU7XG4gICAgfVxuXG4gICAgZ2V0IHJlZnJlc2hUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5yZWZyZXNoVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0IGlzU2Vzc2lvbkV4cGlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmlzU2Vzc2lvbkV4cGlyZWQ7XG4gICAgfVxuXG4gICAgZ2V0IGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVc2VyICE9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IHJlbWVtYmVyTWUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PGJvb2xlYW4+KERCa2V5cy5SRU1FTUJFUl9NRSwgZmFsc2UpID09IHRydWU7XG4gICAgfVxufVxuIl19