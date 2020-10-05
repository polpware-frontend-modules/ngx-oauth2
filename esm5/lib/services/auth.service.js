// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utilities, DBkeys } from '@polpware/ngx-appkit-contracts-alpha';
import { JwtHelper } from './jwt-helper';
import { User } from '../models/user.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "./oidc-helper.service";
import * as i3 from "@polpware/ngx-appkit-contracts-alpha";
var AuthService = /** @class */ (function () {
    function AuthService(router, oidcHelperService, configurationServiceProvider, localStoreManagerProvider) {
        this.router = router;
        this.oidcHelperService = oidcHelperService;
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
    AuthService.prototype.redirectLoginUser = function () {
        var redirect = (this.loginRedirectUrl &&
            (this.loginRedirectUrl != '/') &&
            (this.loginRedirectUrl != this.loginUrl)) ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
        var urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        var urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');
        var navigationExtras = {
            fragment: urlParamsAndFragment.secondPart,
            queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
            queryParamsHandling: 'merge'
        };
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
    /** @nocollapse */ AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i2.OidcHelperService), i0.ɵɵinject(i3.ConfigurationServiceAbstractProvider), i0.ɵɵinject(i3.LocalStoreManagerServiceAbstractProvider)); };
    /** @nocollapse */ AuthService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac });
    return AuthService;
}());
export { AuthService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable
    }], function () { return [{ type: i1.Router }, { type: i2.OidcHelperService }, { type: i3.ConfigurationServiceAbstractProvider }, { type: i3.LocalStoreManagerServiceAbstractProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQUNoQyw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLGdDQUFnQztBQUVoQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJDLE9BQU8sRUFLSCxTQUFTLEVBQ1QsTUFBTSxFQUVULE1BQU0sc0NBQXNDLENBQUM7QUFHOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBRzVDO0lBZUkscUJBQ1ksTUFBYyxFQUNkLGlCQUFvQyxFQUM1Qyw0QkFBa0UsRUFDbEUseUJBQW1FO1FBSDNELFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBUHhDLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQVcxQyxJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsNEJBQTRCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFekQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQXZCRCxzQkFBVyxpQ0FBUTthQUFuQixjQUF3QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDOUQsc0JBQVcsZ0NBQU87YUFBbEIsY0FBdUIsT0FBTyxJQUFJLENBQUMsY0FBYyxD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QUFXO2NBRHZCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRW1haWw6IGluZm9AZWJlbm1vbm5leS5jb21cbi8vIHd3dy5lYmVubW9ubmV5LmNvbS90ZW1wbGF0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gICAgSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3QsXG4gICAgTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdCxcbiAgICBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgVXRpbGl0aWVzLFxuICAgIERCa2V5cyxcbiAgICBDb25maWd1cmF0aW9uU2VydmljZUNvbnN0YW50c1xufSBmcm9tICdAcG9scHdhcmUvbmd4LWFwcGtpdC1jb250cmFjdHMtYWxwaGEnO1xuXG5pbXBvcnQgeyBPaWRjSGVscGVyU2VydmljZSB9IGZyb20gJy4vb2lkYy1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBKd3RIZWxwZXIgfSBmcm9tICcuL2p3dC1oZWxwZXInO1xuaW1wb3J0IHsgQWNjZXNzVG9rZW4sIExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvbG9naW4tcmVzcG9uc2UubW9kZWwnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL21vZGVscy91c2VyLm1vZGVsJztcbmltcG9ydCB7IFBlcm1pc3Npb25WYWx1ZXMgfSBmcm9tICcuLi9tb2RlbHMvcGVybWlzc2lvbi5tb2RlbCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG4gICAgcHVibGljIGdldCBsb2dpblVybCgpIHsgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbnMubG9naW5Vcmw7IH1cbiAgICBwdWJsaWMgZ2V0IGhvbWVVcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmhvbWVVcmw7IH1cblxuICAgIHB1YmxpYyBsb2dpblJlZGlyZWN0VXJsOiBzdHJpbmc7XG4gICAgcHVibGljIGxvZ291dFJlZGlyZWN0VXJsOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgcmVMb2dpbkRlbGVnYXRlOiAoKSA9PiB2b2lkO1xuXG4gICAgcHJpdmF0ZSBfbG9naW5TdGF0dXMgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgcHJpdmF0ZSBsb2NhbFN0b3JhZ2U6IElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0O1xuICAgIHByaXZhdGUgY29uZmlndXJhdGlvbnM6IElDb25maWd1cmF0aW9uU2VydmljZUNvbnRyYWN0O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgb2lkY0hlbHBlclNlcnZpY2U6IE9pZGNIZWxwZXJTZXJ2aWNlLFxuICAgICAgICBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyOiBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgICAgIGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXI6IExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXIuZ2V0KCk7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMgPSBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyLmdldCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxvZ2luU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplTG9naW5TdGF0dXMoKSB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmdldEluaXRFdmVudCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXRMb2dpblN0YXR1cygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnb3RvUGFnZShwYWdlOiBzdHJpbmcsIHByZXNlcnZlUGFyYW1zID0gdHJ1ZSkge1xuXG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBxdWVyeVBhcmFtc0hhbmRsaW5nOiBwcmVzZXJ2ZVBhcmFtcyA/ICdtZXJnZScgOiAnJywgcHJlc2VydmVGcmFnbWVudDogcHJlc2VydmVQYXJhbXNcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcGFnZV0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICAgIGdvdG9Ib21lUGFnZSgpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuaG9tZVVybF0pO1xuICAgIH1cblxuICAgIHJlZGlyZWN0TG9naW5Vc2VyKCkge1xuXG4gICAgICAgIGNvbnN0IHJlZGlyZWN0ID0gKHRoaXMubG9naW5SZWRpcmVjdFVybCAmJlxuICAgICAgICAgICAgKHRoaXMubG9naW5SZWRpcmVjdFVybCAhPSAnLycpICYmXG4gICAgICAgICAgICAodGhpcy5sb2dpblJlZGlyZWN0VXJsICE9IHRoaXMubG9naW5VcmwpKSA/IHRoaXMubG9naW5SZWRpcmVjdFVybCA6IHRoaXMuaG9tZVVybDtcbiAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gbnVsbDtcblxuICAgICAgICBjb25zdCB1cmxQYXJhbXNBbmRGcmFnbWVudCA9IFV0aWxpdGllcy5zcGxpdEluVHdvKHJlZGlyZWN0LCAnIycpO1xuICAgICAgICBjb25zdCB1cmxBbmRQYXJhbXMgPSBVdGlsaXRpZXMuc3BsaXRJblR3byh1cmxQYXJhbXNBbmRGcmFnbWVudC5maXJzdFBhcnQsICc/Jyk7XG5cbiAgICAgICAgY29uc3QgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcbiAgICAgICAgICAgIGZyYWdtZW50OiB1cmxQYXJhbXNBbmRGcmFnbWVudC5zZWNvbmRQYXJ0LFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IFV0aWxpdGllcy5nZXRRdWVyeVBhcmFtc0Zyb21TdHJpbmcodXJsQW5kUGFyYW1zLnNlY29uZFBhcnQpLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXNIYW5kbGluZzogJ21lcmdlJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt1cmxBbmRQYXJhbXMuZmlyc3RQYXJ0XSwgbmF2aWdhdGlvbkV4dHJhcyk7XG4gICAgfVxuXG4gICAgcmVkaXJlY3RMb2dvdXRVc2VyKCkge1xuICAgICAgICBjb25zdCByZWRpcmVjdCA9IHRoaXMubG9nb3V0UmVkaXJlY3RVcmwgPyB0aGlzLmxvZ291dFJlZGlyZWN0VXJsIDogdGhpcy5sb2dpblVybDtcbiAgICAgICAgdGhpcy5sb2dvdXRSZWRpcmVjdFVybCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JlZGlyZWN0XSk7XG4gICAgfVxuXG4gICAgcmVkaXJlY3RGb3JMb2dpbihyZWRpcmVjdFVybD86IHN0cmluZykge1xuICAgICAgICBpZiAocmVkaXJlY3RVcmwpIHtcbiAgICAgICAgICAgIHRoaXMubG9naW5SZWRpcmVjdFVybCA9IHJlZGlyZWN0VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gdGhpcy5yb3V0ZXIudXJsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmxvZ2luVXJsXSk7XG4gICAgfVxuXG4gICAgcmVMb2dpbigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVMb2dpbkRlbGVnYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnJlTG9naW5EZWxlZ2F0ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWRpcmVjdEZvckxvZ2luKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXaWxsIG5vdCBjaGFuZ2UgdGhlIHN0YXR1cyB0aGF0IHdlIGhhdmUgXG4gICAgcmVmcmVzaExvZ2luKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5yZWZyZXNoTG9naW4oKVxuICAgICAgICAgICAgLnBpcGUobWFwKHJlc3AgPT4gdGhpcy5wcm9jZXNzTG9naW5SZXNwb25zZShyZXNwLCB0aGlzLnJlbWVtYmVyTWUsIHRydWUpKSk7XG4gICAgfVxuXG4gICAgbG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgcmVtZW1iZXJNZT86IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gQ2xlYW4gd2hhdCB3ZSBoYXZlIGJlZm9yZSwgd2l0aG91dCBlbWl0dGluZyBhbnkgZXZlbnQuIFxuICAgICAgICB0aGlzLmxvZ291dCh0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5sb2dpbldpdGhQYXNzd29yZCh1c2VyTmFtZSwgcGFzc3dvcmQpXG4gICAgICAgICAgICAucGlwZShtYXAocmVzcCA9PiB0aGlzLnByb2Nlc3NMb2dpblJlc3BvbnNlKHJlc3AsIHJlbWVtYmVyTWUpKSk7XG4gICAgfVxuXG4gICAgLy8gU2lsZW50IGV2ZW50IGluIGNhc2UuXG4gICAgcHJpdmF0ZSBwcm9jZXNzTG9naW5SZXNwb25zZShyZXNwb25zZTogTG9naW5SZXNwb25zZSwgcmVtZW1iZXJNZTogYm9vbGVhbiwgc2lsZW50RXZlbnQ/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVzcG9uc2UuYWNjZXNzX3Rva2VuO1xuXG4gICAgICAgIGlmIChhY2Nlc3NUb2tlbiA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjY2Vzc1Rva2VuIGNhbm5vdCBiZSBudWxsJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1lbWJlck1lID0gcmVtZW1iZXJNZSB8fCB0aGlzLnJlbWVtYmVyTWU7XG5cbiAgICAgICAgY29uc3QgcmVmcmVzaFRva2VuID0gcmVzcG9uc2UucmVmcmVzaF90b2tlbiB8fCB0aGlzLnJlZnJlc2hUb2tlbjtcbiAgICAgICAgY29uc3QgZXhwaXJlc0luID0gcmVzcG9uc2UuZXhwaXJlc19pbjtcbiAgICAgICAgY29uc3QgdG9rZW5FeHBpcnlEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdG9rZW5FeHBpcnlEYXRlLnNldFNlY29uZHModG9rZW5FeHBpcnlEYXRlLmdldFNlY29uZHMoKSArIGV4cGlyZXNJbik7XG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuRXhwaXJ5ID0gdG9rZW5FeHBpcnlEYXRlO1xuICAgICAgICBjb25zdCBqd3RIZWxwZXIgPSBuZXcgSnd0SGVscGVyKCk7XG4gICAgICAgIGNvbnN0IGRlY29kZWRBY2Nlc3NUb2tlbiA9IGp3dEhlbHBlci5kZWNvZGVUb2tlbihhY2Nlc3NUb2tlbikgYXMgQWNjZXNzVG9rZW47XG5cbiAgICAgICAgY29uc3QgcGVybWlzc2lvbnM6IFBlcm1pc3Npb25WYWx1ZXNbXSA9IEFycmF5LmlzQXJyYXkoZGVjb2RlZEFjY2Vzc1Rva2VuLnBlcm1pc3Npb24pID8gZGVjb2RlZEFjY2Vzc1Rva2VuLnBlcm1pc3Npb24gOiBbZGVjb2RlZEFjY2Vzc1Rva2VuLnBlcm1pc3Npb25dO1xuXG4gICAgICAgIGlmICghdGhpcy5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25zLmltcG9ydChkZWNvZGVkQWNjZXNzVG9rZW4uY29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4uc3ViLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLm5hbWUsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4uZnVsbG5hbWUsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4uZW1haWwsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4uam9idGl0bGUsXG4gICAgICAgICAgICBkZWNvZGVkQWNjZXNzVG9rZW4ucGhvbmVfbnVtYmVyLFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShkZWNvZGVkQWNjZXNzVG9rZW4ucm9sZSkgPyBkZWNvZGVkQWNjZXNzVG9rZW4ucm9sZSA6IFtkZWNvZGVkQWNjZXNzVG9rZW4ucm9sZV0pO1xuICAgICAgICB1c2VyLmlzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5zYXZlVXNlckRldGFpbHModXNlciwgcGVybWlzc2lvbnMsIGFjY2Vzc1Rva2VuLCByZWZyZXNoVG9rZW4sIGFjY2Vzc1Rva2VuRXhwaXJ5LCByZW1lbWJlck1lKTtcblxuICAgICAgICBpZiAoc2lsZW50RXZlbnQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdExvZ2luU3RhdHVzKHVzZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlVXNlckRldGFpbHModXNlcjogVXNlciwgcGVybWlzc2lvbnM6IFBlcm1pc3Npb25WYWx1ZXNbXSwgYWNjZXNzVG9rZW46IHN0cmluZywgcmVmcmVzaFRva2VuOiBzdHJpbmcsIGV4cGlyZXNJbjogRGF0ZSwgcmVtZW1iZXJNZTogYm9vbGVhbikge1xuICAgICAgICBpZiAocmVtZW1iZXJNZSkge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEoYWNjZXNzVG9rZW4sIERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEocmVmcmVzaFRva2VuLCBEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShleHBpcmVzSW4sIERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHBlcm1pc3Npb25zLCBEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YSh1c2VyLCBEQmtleXMuQ1VSUkVOVF9VU0VSKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YShhY2Nlc3NUb2tlbiwgREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEocmVmcmVzaFRva2VuLCBEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEoZXhwaXJlc0luLCBEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEocGVybWlzc2lvbnMsIERCa2V5cy5VU0VSX1BFUk1JU1NJT05TKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVTeW5jZWRTZXNzaW9uRGF0YSh1c2VyLCBEQmtleXMuQ1VSUkVOVF9VU0VSKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHJlbWVtYmVyTWUsIERCa2V5cy5SRU1FTUJFUl9NRSk7XG4gICAgfVxuXG4gICAgLy8gU2lsaWVudCBldmVudCBpbiBjYXNlLlxuICAgIGxvZ291dChzaWxlbnRFdmVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLlRPS0VOX0VYUElSRVNfSU4pO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5VU0VSX1BFUk1JU1NJT05TKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuQ1VSUkVOVF9VU0VSKTtcblxuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25zLmNsZWFyTG9jYWxDaGFuZ2VzKCk7XG5cbiAgICAgICAgaWYgKHNpbGVudEV2ZW50ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRMb2dpblN0YXR1cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbWl0TG9naW5TdGF0dXMoY3VycmVudFVzZXI/OiBVc2VyKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBjdXJyZW50VXNlciB8fCB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PFVzZXI+KERCa2V5cy5DVVJSRU5UX1VTRVIsIGZhbHNlKTtcbiAgICAgICAgY29uc3QgaXNMb2dnZWRJbiA9IHVzZXIgIT0gbnVsbDtcbiAgICAgICAgdGhpcy5fbG9naW5TdGF0dXMubmV4dChpc0xvZ2dlZEluKTtcbiAgICB9XG5cbiAgICBnZXRMb2dpblN0YXR1c0V2ZW50KCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW5TdGF0dXMuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRVc2VyKCk6IFVzZXIge1xuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxVc2VyPihEQmtleXMuQ1VSUkVOVF9VU0VSLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgIH1cblxuICAgIGdldCB1c2VyUGVybWlzc2lvbnMoKTogUGVybWlzc2lvblZhbHVlc1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8UGVybWlzc2lvblZhbHVlc1tdPihEQmtleXMuVVNFUl9QRVJNSVNTSU9OUywgZmFsc2UpIHx8IFtdO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5hY2Nlc3NUb2tlbjtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW5FeHBpcnlEYXRlKCk6IERhdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5hY2Nlc3NUb2tlbkV4cGlyeURhdGU7XG4gICAgfVxuXG4gICAgZ2V0IHJlZnJlc2hUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5yZWZyZXNoVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0IGlzU2Vzc2lvbkV4cGlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNIZWxwZXJTZXJ2aWNlLmlzU2Vzc2lvbkV4cGlyZWQ7XG4gICAgfVxuXG4gICAgZ2V0IGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVc2VyICE9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IHJlbWVtYmVyTWUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PGJvb2xlYW4+KERCa2V5cy5SRU1FTUJFUl9NRSwgZmFsc2UpID09IHRydWU7XG4gICAgfVxufVxuIl19