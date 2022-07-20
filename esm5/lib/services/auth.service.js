import { Injectable } from '@angular/core';
import { DBkeys, Utilities } from '@polpware/ngx-appkit-contracts-alpha';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { JwtHelper } from './jwt-helper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "./oidc-helper.service";
import * as i3 from "@polpware/ngx-logger";
import * as i4 from "@polpware/ngx-appkit-contracts-alpha";
var AuthService = /** @class */ (function () {
    function AuthService(router, oidcHelperService, _logger, configurationServiceProvider, localStoreManagerProvider) {
        this.router = router;
        this.oidcHelperService = oidcHelperService;
        this._logger = _logger;
        this._loginStatus = new Subject();
        this.localStorage = localStoreManagerProvider.get();
        this.configurations = configurationServiceProvider.get();
        this.initializeLoginStatus();
    }
    Object.defineProperty(AuthService.prototype, "loginUrl", {
        get: function () { return this.configurations.loginUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "homeUrl", {
        get: function () { return this.configurations.homeUrl; },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.initializeLoginStatus = function () {
        var _this = this;
        this.localStorage.getInitEvent().subscribe(function () {
            _this.emitLoginStatus();
        });
    };
    AuthService.prototype.gotoPage = function (page, preserveParams) {
        if (preserveParams === void 0) { preserveParams = true; }
        var navigationExtras = {
            queryParamsHandling: preserveParams ? 'merge' : '', preserveFragment: preserveParams
        };
        this.router.navigate([page], navigationExtras);
    };
    AuthService.prototype.gotoHomePage = function () {
        this.router.navigate([this.homeUrl]);
    };
    AuthService.prototype.redirectLoginUser = function (ignoreQueryParams) {
        this._logger.debug("login redirect url is: " + this.loginRedirectUrl);
        this._logger.debug("home url is: " + this.homeUrl);
        var redirect = (this.loginRedirectUrl &&
            (this.loginRedirectUrl != '/') &&
            (this.loginRedirectUrl != this.loginUrl)) ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
        this._logger.debug("final redirect url is: " + redirect);
        var urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        var urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');
        var navigationExtras = {
            fragment: urlParamsAndFragment.secondPart
        };
        if (!ignoreQueryParams) {
            Object.assign(navigationExtras, {
                queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
                queryParamsHandling: 'merge'
            });
        }
        this._logger.debug("Redirection url is: " + urlAndParams.firstPart);
        this._logger.debug('Extra parameters: ');
        this._logger.debug(navigationExtras);
        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    };
    AuthService.prototype.redirectLogoutUser = function () {
        var redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;
        this.router.navigate([redirect]);
    };
    AuthService.prototype.redirectForLogin = function (redirectUrl) {
        if (redirectUrl) {
            this.loginRedirectUrl = redirectUrl;
        }
        else {
            this.loginRedirectUrl = this.router.url;
        }
        this.router.navigate([this.loginUrl]);
    };
    // todo: Is this useful????
    /**
     * Prepare the login URL,
     * including setting up the right redirect url.
     * @param redirectUrl Redirect url.
     */
    AuthService.prototype.prepareLoginUrl = function (redirectUrl) {
        if (redirectUrl) {
            this.loginRedirectUrl = redirectUrl;
        }
        else {
            this.loginRedirectUrl = this.router.url;
        }
        return this.router.parseUrl(this.loginUrl);
    };
    AuthService.prototype.reLogin = function () {
        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    };
    // Will not change the status that we have 
    AuthService.prototype.refreshLogin = function () {
        var _this = this;
        return this.oidcHelperService.refreshLogin()
            .pipe(map(function (resp) { return _this.processLoginResponse(resp, _this.rememberMe, true); }));
    };
    AuthService.prototype.loginWithPassword = function (userName, password, rememberMe) {
        var _this = this;
        // Clean what we have before, without emitting any event. 
        this.logout(true);
        return this.oidcHelperService.loginWithPassword(userName, password)
            .pipe(map(function (resp) { return _this.processLoginResponse(resp, rememberMe); }));
    };
    AuthService.prototype.loginWithToken = function (accessToken, refreshToken, expiresIn) {
        refreshToken = refreshToken || '';
        expiresIn = 24 * 60 * 60 * 1000;
        var tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
        var accessTokenExpiry = tokenExpiryDate;
        var jwtHelper = new JwtHelper();
        var decodedAccessToken = jwtHelper.decodeToken(accessToken);
        var permissions = Array.isArray(decodedAccessToken.permission) ? decodedAccessToken.permission : [decodedAccessToken.permission];
        if (!this.isLoggedIn) {
            this.configurations.import(decodedAccessToken.configuration);
        }
        var user = new User(decodedAccessToken.sub, decodedAccessToken.name, decodedAccessToken.fullname, decodedAccessToken.email, decodedAccessToken.jobtitle, decodedAccessToken.phone_number, Array.isArray(decodedAccessToken.role) ? decodedAccessToken.role : [decodedAccessToken.role]);
        user.isEnabled = true;
        this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, false);
        // todo: Do we need to emit events?
        return user;
    };
    // Silent event in case.
    AuthService.prototype.processLoginResponse = function (response, rememberMe, silentEvent) {
        var accessToken = response.access_token;
        if (accessToken == null) {
            throw new Error('accessToken cannot be null');
        }
        rememberMe = rememberMe || this.rememberMe;
        var refreshToken = response.refresh_token || this.refreshToken;
        var expiresIn = response.expires_in;
        var tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
        var accessTokenExpiry = tokenExpiryDate;
        var jwtHelper = new JwtHelper();
        var decodedAccessToken = jwtHelper.decodeToken(accessToken);
        var permissions = Array.isArray(decodedAccessToken.permission) ? decodedAccessToken.permission : [decodedAccessToken.permission];
        if (!this.isLoggedIn) {
            this.configurations.import(decodedAccessToken.configuration);
        }
        var user = new User(decodedAccessToken.sub, decodedAccessToken.name, decodedAccessToken.fullname, decodedAccessToken.email, decodedAccessToken.jobtitle, decodedAccessToken.phone_number, Array.isArray(decodedAccessToken.role) ? decodedAccessToken.role : [decodedAccessToken.role]);
        user.isEnabled = true;
        this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, rememberMe);
        if (silentEvent !== true) {
            this.emitLoginStatus(user);
        }
        return user;
    };
    AuthService.prototype.saveUserDetails = function (user, permissions, accessToken, refreshToken, expiresIn, rememberMe) {
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
    // Silient event in case.
    AuthService.prototype.logout = function (silentEvent) {
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);
        this.configurations.clearLocalChanges();
        if (silentEvent !== true) {
            this.emitLoginStatus();
        }
    };
    AuthService.prototype.emitLoginStatus = function (currentUser) {
        var user = currentUser || this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
        var isLoggedIn = user != null;
        this._loginStatus.next(isLoggedIn);
    };
    AuthService.prototype.getLoginStatusEvent = function () {
        return this._loginStatus.asObservable();
    };
    Object.defineProperty(AuthService.prototype, "currentUser", {
        get: function () {
            var user = this.localStorage.getDataObject(DBkeys.CURRENT_USER, false);
            return user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "userPermissions", {
        get: function () {
            return this.localStorage.getDataObject(DBkeys.USER_PERMISSIONS, false) || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "accessToken", {
        get: function () {
            return this.oidcHelperService.accessToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "accessTokenExpiryDate", {
        get: function () {
            return this.oidcHelperService.accessTokenExpiryDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "refreshToken", {
        get: function () {
            return this.oidcHelperService.refreshToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "isSessionExpired", {
        get: function () {
            return this.oidcHelperService.isSessionExpired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "isLoggedIn", {
        get: function () {
            return this.currentUser != null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "rememberMe", {
        get: function () {
            return this.localStorage.getDataObject(DBkeys.REMEMBER_ME, false) == true;
        },
        enumerable: true,
        configurable: true
    });
    /** @nocollapse */ AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i2.OidcHelperService), i0.ɵɵinject(i3.NgxLoggerImpl), i0.ɵɵinject(i4.ConfigurationServiceAbstractProvider), i0.ɵɵinject(i4.LocalStoreManagerServiceAbstractProvider)); };
    /** @nocollapse */ AuthService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });
    return AuthService;
}());
export { AuthService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.Router }, { type: i2.OidcHelperService }, { type: i3.NgxLoggerImpl }, { type: i4.ConfigurationServiceAbstractProvider }, { type: i4.LocalStoreManagerServiceAbstractProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUVILE1BQU0sRUFJTixTQUFTLEVBQ1osTUFBTSxzQ0FBc0MsQ0FBQztBQUU5QyxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUdyQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7Ozs7O0FBR3pDO0lBc0JJLHFCQUNZLE1BQWMsRUFDZCxpQkFBb0MsRUFDM0IsT0FBc0IsRUFDdkMsNEJBQWtFLEVBQ2xFLHlCQUFtRTtRQUozRCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUMzQixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBUm5DLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQVkxQyxJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsNEJBQTRCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFekQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQTdCRCxzQkFBVyxpQ0FBUTthQUFuQixjQUF3QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDOUQsc0JBQVcsZ0NBQU87YUFBbEIsY0FBdUIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FB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Q0F1VEMsQUFwU0QsSUFvU0M7U0FqU1ksV0FBVztrREFBWCxXQUFXO2NBSHZCLFVBQVU7ZUFBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5hdmlnYXRpb25FeHRyYXMsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1xuICAgIENvbmZpZ3VyYXRpb25TZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICBEQmtleXMsXG4gICAgSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3QsXG4gICAgSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3QsXG4gICAgTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICBVdGlsaXRpZXNcbn0gZnJvbSAnQHBvbHB3YXJlL25neC1hcHBraXQtY29udHJhY3RzLWFscGhhJztcbmltcG9ydCB7IE5neExvZ2dlckltcGwgfSBmcm9tICdAcG9scHdhcmUvbmd4LWxvZ2dlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBBY2Nlc3NUb2tlbiwgTG9naW5SZXNwb25zZSB9IGZyb20gJy4uL21vZGVscy9sb2dpbi1yZXNwb25zZS5tb2RlbCc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uVmFsdWVzIH0gZnJvbSAnLi4vbW9kZWxzL3Blcm1pc3Npb24ubW9kZWwnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL21vZGVscy91c2VyLm1vZGVsJztcbmltcG9ydCB7IEp3dEhlbHBlciB9IGZyb20gJy4vand0LWhlbHBlcic7XG5pbXBvcnQgeyBPaWRjSGVscGVyU2VydmljZSB9IGZyb20gJy4vb2lkYy1oZWxwZXIuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuICAgIHB1YmxpYyBnZXQgbG9naW5VcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmxvZ2luVXJsOyB9XG4gICAgcHVibGljIGdldCBob21lVXJsKCkgeyByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9ucy5ob21lVXJsOyB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFja3MgdGhlIHRoZSB1cmwgYSB1c2VyIGF0dGVtcHRzIHRvIGFjY2VzcyBidXQgXG4gICAgICogY2Fubm90IGJlIGF1dGhlbnRpY2F0ZWQuIFxuICAgICAqL1xuICAgIHB1YmxpYyBsb2dpblJlZGlyZWN0VXJsOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgbG9nb3V0UmVkaXJlY3RVcmw6IHN0cmluZztcblxuICAgIHB1YmxpYyByZUxvZ2luRGVsZWdhdGU6ICgpID0+IHZvaWQ7XG5cbiAgICBwcml2YXRlIF9sb2dpblN0YXR1cyA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgICBwcml2YXRlIGxvY2FsU3RvcmFnZTogSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3Q7XG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uczogSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBvaWRjSGVscGVyU2VydmljZTogT2lkY0hlbHBlclNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvZ2dlcjogTmd4TG9nZ2VySW1wbCxcbiAgICAgICAgY29uZmlndXJhdGlvblNlcnZpY2VQcm92aWRlcjogQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgICAgICBsb2NhbFN0b3JlTWFuYWdlclByb3ZpZGVyOiBMb2NhbFN0b3JlTWFuYWdlclNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyKSB7XG5cbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JlTWFuYWdlclByb3ZpZGVyLmdldCgpO1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25zID0gY29uZmlndXJhdGlvblNlcnZpY2VQcm92aWRlci5nZXQoKTtcblxuICAgICAgICB0aGlzLmluaXRpYWxpemVMb2dpblN0YXR1cygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZUxvZ2luU3RhdHVzKCkge1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5nZXRJbml0RXZlbnQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0TG9naW5TdGF0dXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ290b1BhZ2UocGFnZTogc3RyaW5nLCBwcmVzZXJ2ZVBhcmFtcyA9IHRydWUpIHtcblxuICAgICAgICBjb25zdCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuICAgICAgICAgICAgcXVlcnlQYXJhbXNIYW5kbGluZzogcHJlc2VydmVQYXJhbXMgPyAnbWVyZ2UnIDogJycsIHByZXNlcnZlRnJhZ21lbnQ6IHByZXNlcnZlUGFyYW1zXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3BhZ2VdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9XG5cbiAgICBnb3RvSG9tZVBhZ2UoKSB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmhvbWVVcmxdKTtcbiAgICB9XG5cbiAgICByZWRpcmVjdExvZ2luVXNlcihpZ25vcmVRdWVyeVBhcmFtcz86IGJvb2xlYW4pIHtcblxuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoYGxvZ2luIHJlZGlyZWN0IHVybCBpczogJHt0aGlzLmxvZ2luUmVkaXJlY3RVcmx9YCk7XG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhgaG9tZSB1cmwgaXM6ICR7dGhpcy5ob21lVXJsfWApO1xuXG4gICAgICAgIGNvbnN0IHJlZGlyZWN0ID0gKHRoaXMubG9naW5SZWRpcmVjdFVybCAmJlxuICAgICAgICAgICAgKHRoaXMubG9naW5SZWRpcmVjdFVybCAhPSAnLycpICYmXG4gICAgICAgICAgICAodGhpcy5sb2dpblJlZGlyZWN0VXJsICE9IHRoaXMubG9naW5VcmwpKSA/IHRoaXMubG9naW5SZWRpcmVjdFVybCA6IHRoaXMuaG9tZVVybDtcbiAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoYGZpbmFsIHJlZGlyZWN0IHVybCBpczogJHtyZWRpcmVjdH1gKTtcblxuICAgICAgICBjb25zdCB1cmxQYXJhbXNBbmRGcmFnbWVudCA9IFV0aWxpdGllcy5zcGxpdEluVHdvKHJlZGlyZWN0LCAnIycpO1xuICAgICAgICBjb25zdCB1cmxBbmRQYXJhbXMgPSBVdGlsaXRpZXMuc3BsaXRJblR3byh1cmxQYXJhbXNBbmRGcmFnbWVudC5maXJzdFBhcnQsICc/Jyk7XG5cbiAgICAgICAgY29uc3QgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcbiAgICAgICAgICAgIGZyYWdtZW50OiB1cmxQYXJhbXNBbmRGcmFnbWVudC5zZWNvbmRQYXJ0XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCFpZ25vcmVRdWVyeVBhcmFtcykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihuYXZpZ2F0aW9uRXh0cmFzLCB7XG4gICAgICAgICAgICAgICAgcXVlcnlQYXJhbXM6IFV0aWxpdGllcy5nZXRRdWVyeVBhcmFtc0Zyb21TdHJpbmcodXJsQW5kUGFyYW1zLnNlY29uZFBhcnQpLFxuICAgICAgICAgICAgICAgIHF1ZXJ5UGFyYW1zSGFuZGxpbmc6ICdtZXJnZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKGBSZWRpcmVjdGlvbiB1cmwgaXM6ICR7dXJsQW5kUGFyYW1zLmZpcnN0UGFydH1gKTtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKCdFeHRyYSBwYXJhbWV0ZXJzOiAnKTtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKG5hdmlnYXRpb25FeHRyYXMpO1xuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt1cmxBbmRQYXJhbXMuZmlyc3RQYXJ0XSwgbmF2aWdhdGlvbkV4dHJhcyk7XG4gICAgfVxuXG4gICAgcmVkaXJlY3RMb2dvdXRVc2VyKCkge1xuICAgICAgICBjb25zdCByZWRpcmVjdCA9IHRoaXMubG9nb3V0UmVkaXJlY3RVcmwgPyB0aGlzLmxvZ291dFJlZGlyZWN0VXJsIDogdGhpcy5sb2dpblVybDtcbiAgICAgICAgdGhpcy5sb2dvdXRSZWRpcmVjdFVybCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JlZGlyZWN0XSk7XG4gICAgfVxuXG4gICAgcmVkaXJlY3RGb3JMb2dpbihyZWRpcmVjdFVybD86IHN0cmluZykge1xuICAgICAgICBpZiAocmVkaXJlY3RVcmwpIHtcbiAgICAgICAgICAgIHRoaXMubG9naW5SZWRpcmVjdFVybCA9IHJlZGlyZWN0VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gdGhpcy5yb3V0ZXIudXJsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmxvZ2luVXJsXSk7XG4gICAgfVxuXG4gICAgLy8gdG9kbzogSXMgdGhpcyB1c2VmdWw/Pz8/XG4gICAgLyoqXG4gICAgICogUHJlcGFyZSB0aGUgbG9naW4gVVJMLFxuICAgICAqIGluY2x1ZGluZyBzZXR0aW5nIHVwIHRoZSByaWdodCByZWRpcmVjdCB1cmwuXG4gICAgICogQHBhcmFtIHJlZGlyZWN0VXJsIFJlZGlyZWN0IHVybC5cbiAgICAgKi9cbiAgICBwcmVwYXJlTG9naW5VcmwocmVkaXJlY3RVcmw/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHJlZGlyZWN0VXJsKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgPSByZWRpcmVjdFVybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9naW5SZWRpcmVjdFVybCA9IHRoaXMucm91dGVyLnVybDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlci5wYXJzZVVybCh0aGlzLmxvZ2luVXJsKTtcbiAgICB9XG5cbiAgICByZUxvZ2luKCkge1xuXG4gICAgICAgIGlmICh0aGlzLnJlTG9naW5EZWxlZ2F0ZSkge1xuICAgICAgICAgICAgdGhpcy5yZUxvZ2luRGVsZWdhdGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVkaXJlY3RGb3JMb2dpbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2lsbCBub3QgY2hhbmdlIHRoZSBzdGF0dXMgdGhhdCB3ZSBoYXZlIFxuICAgIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UucmVmcmVzaExvZ2luKClcbiAgICAgICAgICAgIC5waXBlKG1hcChyZXNwID0+IHRoaXMucHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcCwgdGhpcy5yZW1lbWJlck1lLCB0cnVlKSkpO1xuICAgIH1cblxuICAgIGxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHJlbWVtYmVyTWU/OiBib29sZWFuKSB7XG4gICAgICAgIC8vIENsZWFuIHdoYXQgd2UgaGF2ZSBiZWZvcmUsIHdpdGhvdXQgZW1pdHRpbmcgYW55IGV2ZW50LiBcbiAgICAgICAgdGhpcy5sb2dvdXQodHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWUsIHBhc3N3b3JkKVxuICAgICAgICAgICAgLnBpcGUobWFwKHJlc3AgPT4gdGhpcy5wcm9jZXNzTG9naW5SZXNwb25zZShyZXNwLCByZW1lbWJlck1lKSkpO1xuICAgIH1cblxuXG4gICAgbG9naW5XaXRoVG9rZW4oYWNjZXNzVG9rZW46IHN0cmluZywgcmVmcmVzaFRva2VuPzogc3RyaW5nLCBleHBpcmVzSW4/OiBudW1iZXIpIHtcbiAgICAgICAgcmVmcmVzaFRva2VuID0gcmVmcmVzaFRva2VuIHx8ICcnO1xuICAgICAgICBleHBpcmVzSW4gPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgICBjb25zdCB0b2tlbkV4cGlyeURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0b2tlbkV4cGlyeURhdGUuc2V0U2Vjb25kcyh0b2tlbkV4cGlyeURhdGUuZ2V0U2Vjb25kcygpICsgZXhwaXJlc0luKTtcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW5FeHBpcnkgPSB0b2tlbkV4cGlyeURhdGU7XG4gICAgICAgIGNvbnN0IGp3dEhlbHBlciA9IG5ldyBKd3RIZWxwZXIoKTtcbiAgICAgICAgY29uc3QgZGVjb2RlZEFjY2Vzc1Rva2VuID0gand0SGVscGVyLmRlY29kZVRva2VuKGFjY2Vzc1Rva2VuKSBhcyBBY2Nlc3NUb2tlbjtcblxuICAgICAgICBjb25zdCBwZXJtaXNzaW9uczogUGVybWlzc2lvblZhbHVlc1tdID0gQXJyYXkuaXNBcnJheShkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbikgPyBkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbiA6IFtkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbl07XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMuaW1wb3J0KGRlY29kZWRBY2Nlc3NUb2tlbi5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcihcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5zdWIsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4ubmFtZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5mdWxsbmFtZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5lbWFpbCxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5qb2J0aXRsZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5waG9uZV9udW1iZXIsXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KGRlY29kZWRBY2Nlc3NUb2tlbi5yb2xlKSA/IGRlY29kZWRBY2Nlc3NUb2tlbi5yb2xlIDogW2RlY29kZWRBY2Nlc3NUb2tlbi5yb2xlXSk7XG4gICAgICAgIHVzZXIuaXNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNhdmVVc2VyRGV0YWlscyh1c2VyLCBwZXJtaXNzaW9ucywgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbiwgYWNjZXNzVG9rZW5FeHBpcnksIGZhbHNlKTtcbiAgICAgICAgLy8gdG9kbzogRG8gd2UgbmVlZCB0byBlbWl0IGV2ZW50cz9cblxuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9XG5cbiAgICAvLyBTaWxlbnQgZXZlbnQgaW4gY2FzZS5cbiAgICBwcml2YXRlIHByb2Nlc3NMb2dpblJlc3BvbnNlKHJlc3BvbnNlOiBMb2dpblJlc3BvbnNlLCByZW1lbWJlck1lOiBib29sZWFuLCBzaWxlbnRFdmVudD86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXNwb25zZS5hY2Nlc3NfdG9rZW47XG5cbiAgICAgICAgaWYgKGFjY2Vzc1Rva2VuID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYWNjZXNzVG9rZW4gY2Fubm90IGJlIG51bGwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbWVtYmVyTWUgPSByZW1lbWJlck1lIHx8IHRoaXMucmVtZW1iZXJNZTtcblxuICAgICAgICBjb25zdCByZWZyZXNoVG9rZW4gPSByZXNwb25zZS5yZWZyZXNoX3Rva2VuIHx8IHRoaXMucmVmcmVzaFRva2VuO1xuICAgICAgICBjb25zdCBleHBpcmVzSW4gPSByZXNwb25zZS5leHBpcmVzX2luO1xuICAgICAgICBjb25zdCB0b2tlbkV4cGlyeURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0b2tlbkV4cGlyeURhdGUuc2V0U2Vjb25kcyh0b2tlbkV4cGlyeURhdGUuZ2V0U2Vjb25kcygpICsgZXhwaXJlc0luKTtcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW5FeHBpcnkgPSB0b2tlbkV4cGlyeURhdGU7XG4gICAgICAgIGNvbnN0IGp3dEhlbHBlciA9IG5ldyBKd3RIZWxwZXIoKTtcbiAgICAgICAgY29uc3QgZGVjb2RlZEFjY2Vzc1Rva2VuID0gand0SGVscGVyLmRlY29kZVRva2VuKGFjY2Vzc1Rva2VuKSBhcyBBY2Nlc3NUb2tlbjtcblxuICAgICAgICBjb25zdCBwZXJtaXNzaW9uczogUGVybWlzc2lvblZhbHVlc1tdID0gQXJyYXkuaXNBcnJheShkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbikgPyBkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbiA6IFtkZWNvZGVkQWNjZXNzVG9rZW4ucGVybWlzc2lvbl07XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMuaW1wb3J0KGRlY29kZWRBY2Nlc3NUb2tlbi5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcihcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5zdWIsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4ubmFtZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5mdWxsbmFtZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5lbWFpbCxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5qb2J0aXRsZSxcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5waG9uZV9udW1iZXIsXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KGRlY29kZWRBY2Nlc3NUb2tlbi5yb2xlKSA/IGRlY29kZWRBY2Nlc3NUb2tlbi5yb2xlIDogW2RlY29kZWRBY2Nlc3NUb2tlbi5yb2xlXSk7XG4gICAgICAgIHVzZXIuaXNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNhdmVVc2VyRGV0YWlscyh1c2VyLCBwZXJtaXNzaW9ucywgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbiwgYWNjZXNzVG9rZW5FeHBpcnksIHJlbWVtYmVyTWUpO1xuXG4gICAgICAgIGlmIChzaWxlbnRFdmVudCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0TG9naW5TdGF0dXModXNlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmVVc2VyRGV0YWlscyh1c2VyOiBVc2VyLCBwZXJtaXNzaW9uczogUGVybWlzc2lvblZhbHVlc1tdLCBhY2Nlc3NUb2tlbjogc3RyaW5nLCByZWZyZXNoVG9rZW46IHN0cmluZywgZXhwaXJlc0luOiBEYXRlLCByZW1lbWJlck1lOiBib29sZWFuKSB7XG4gICAgICAgIGlmIChyZW1lbWJlck1lKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShhY2Nlc3NUb2tlbiwgREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShyZWZyZXNoVG9rZW4sIERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKGV4cGlyZXNJbiwgREJrZXlzLlRPS0VOX0VYUElSRVNfSU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEocGVybWlzc2lvbnMsIERCa2V5cy5VU0VSX1BFUk1JU1NJT05TKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHVzZXIsIERCa2V5cy5DVVJSRU5UX1VTRVIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKGFjY2Vzc1Rva2VuLCBEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShyZWZyZXNoVG9rZW4sIERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShleHBpcmVzSW4sIERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShwZXJtaXNzaW9ucywgREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKHVzZXIsIERCa2V5cy5DVVJSRU5UX1VTRVIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEocmVtZW1iZXJNZSwgREJrZXlzLlJFTUVNQkVSX01FKTtcbiAgICB9XG5cbiAgICAvLyBTaWxpZW50IGV2ZW50IGluIGNhc2UuXG4gICAgbG9nb3V0KHNpbGVudEV2ZW50PzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMpO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5DVVJSRU5UX1VTRVIpO1xuXG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMuY2xlYXJMb2NhbENoYW5nZXMoKTtcblxuICAgICAgICBpZiAoc2lsZW50RXZlbnQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdExvZ2luU3RhdHVzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGVtaXRMb2dpblN0YXR1cyhjdXJyZW50VXNlcj86IFVzZXIpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IGN1cnJlbnRVc2VyIHx8IHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8VXNlcj4oREJrZXlzLkNVUlJFTlRfVVNFUiwgZmFsc2UpO1xuICAgICAgICBjb25zdCBpc0xvZ2dlZEluID0gdXNlciAhPSBudWxsO1xuICAgICAgICB0aGlzLl9sb2dpblN0YXR1cy5uZXh0KGlzTG9nZ2VkSW4pO1xuICAgIH1cblxuICAgIGdldExvZ2luU3RhdHVzRXZlbnQoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpblN0YXR1cy5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBnZXQgY3VycmVudFVzZXIoKTogVXNlciB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PFVzZXI+KERCa2V5cy5DVVJSRU5UX1VTRVIsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfVxuXG4gICAgZ2V0IHVzZXJQZXJtaXNzaW9ucygpOiBQZXJtaXNzaW9uVmFsdWVzW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxQZXJtaXNzaW9uVmFsdWVzW10+KERCa2V5cy5VU0VSX1BFUk1JU1NJT05TLCBmYWxzZSkgfHwgW107XG4gICAgfVxuXG4gICAgZ2V0IGFjY2Vzc1Rva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmFjY2Vzc1Rva2VuO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbkV4cGlyeURhdGUoKTogRGF0ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZTtcbiAgICB9XG5cbiAgICBnZXQgcmVmcmVzaFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLnJlZnJlc2hUb2tlbjtcbiAgICB9XG5cbiAgICBnZXQgaXNTZXNzaW9uRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UuaXNTZXNzaW9uRXhwaXJlZDtcbiAgICB9XG5cbiAgICBnZXQgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFVzZXIgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgcmVtZW1iZXJNZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8Ym9vbGVhbj4oREJrZXlzLlJFTUVNQkVSX01FLCBmYWxzZSkgPT0gdHJ1ZTtcbiAgICB9XG59XG4iXX0=