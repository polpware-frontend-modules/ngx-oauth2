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
    AuthService.prototype.redirectLoginUser = function (ignoreQueryParams) {
        var redirect = (this.loginRedirectUrl &&
            (this.loginRedirectUrl != '/') &&
            (this.loginRedirectUrl != this.loginUrl)) ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQUNoQyw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLGdDQUFnQztBQUVoQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJDLE9BQU8sRUFLSCxTQUFTLEVBQ1QsTUFBTSxFQUVULE1BQU0sc0NBQXNDLENBQUM7QUFHOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBRzVDO0lBb0JJLHFCQUNZLE1BQWMsRUFDZCxpQkFBb0MsRUFDNUMsNEJBQWtFLEVBQ2xFLHlCQUFtRTtRQUgzRCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQVB4QyxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFXMUMsSUFBSSxDQUFDLFlBQVksR0FBRyx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXpELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUE1QkQsc0JBQVcsaUNBQVE7YUFBbkIsY0FBd0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzlELHNCQUFXLGdDQUFPO2FBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLGNBQWMs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QUksQ0FBQztRQUN2RixDQUFDOzs7T0FBQTs2RkFyT1EsV0FBVzswRUFBWCxXQUFXLFdBQVgsV0FBVztzQkEzQnhCO0NBaVFDLEFBdk9ELElBdU9DO1NBdE9ZLFdBQVc7a0RBQVgsV0FBVztjQUR2QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVtYWlsOiBpbmZvQGViZW5tb25uZXkuY29tXG4vLyB3d3cuZWJlbm1vbm5leS5jb20vdGVtcGxhdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25FeHRyYXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICAgIElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0LFxuICAgIExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3QsXG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIFV0aWxpdGllcyxcbiAgICBEQmtleXMsXG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VDb25zdGFudHNcbn0gZnJvbSAnQHBvbHB3YXJlL25neC1hcHBraXQtY29udHJhY3RzLWFscGhhJztcblxuaW1wb3J0IHsgT2lkY0hlbHBlclNlcnZpY2UgfSBmcm9tICcuL29pZGMtaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyJztcbmltcG9ydCB7IEFjY2Vzc1Rva2VuLCBMb2dpblJlc3BvbnNlIH0gZnJvbSAnLi4vbW9kZWxzL2xvZ2luLXJlc3BvbnNlLm1vZGVsJztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi9tb2RlbHMvdXNlci5tb2RlbCc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uVmFsdWVzIH0gZnJvbSAnLi4vbW9kZWxzL3Blcm1pc3Npb24ubW9kZWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuICAgIHB1YmxpYyBnZXQgbG9naW5VcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmxvZ2luVXJsOyB9XG4gICAgcHVibGljIGdldCBob21lVXJsKCkgeyByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9ucy5ob21lVXJsOyB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFja3MgdGhlIHRoZSB1cmwgYSB1c2VyIGF0dGVtcHRzIHRvIGFjY2VzcyBidXQgXG4gICAgICogY2Fubm90IGJlIGF1dGhlbnRpY2F0ZWQuIFxuICAgICAqL1xuICAgIHB1YmxpYyBsb2dpblJlZGlyZWN0VXJsOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgbG9nb3V0UmVkaXJlY3RVcmw6IHN0cmluZztcblxuICAgIHB1YmxpYyByZUxvZ2luRGVsZWdhdGU6ICgpID0+IHZvaWQ7XG5cbiAgICBwcml2YXRlIF9sb2dpblN0YXR1cyA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgICBwcml2YXRlIGxvY2FsU3RvcmFnZTogSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3Q7XG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uczogSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBvaWRjSGVscGVyU2VydmljZTogT2lkY0hlbHBlclNlcnZpY2UsXG4gICAgICAgIGNvbmZpZ3VyYXRpb25TZXJ2aWNlUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25TZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICAgICAgbG9jYWxTdG9yZU1hbmFnZXJQcm92aWRlcjogTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlcikge1xuXG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yZU1hbmFnZXJQcm92aWRlci5nZXQoKTtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucyA9IGNvbmZpZ3VyYXRpb25TZXJ2aWNlUHJvdmlkZXIuZ2V0KCk7XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplTG9naW5TdGF0dXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemVMb2dpblN0YXR1cygpIHtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SW5pdEV2ZW50KCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdExvZ2luU3RhdHVzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdvdG9QYWdlKHBhZ2U6IHN0cmluZywgcHJlc2VydmVQYXJhbXMgPSB0cnVlKSB7XG5cbiAgICAgICAgY29uc3QgbmF2aWdhdGlvbkV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHtcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zSGFuZGxpbmc6IHByZXNlcnZlUGFyYW1zID8gJ21lcmdlJyA6ICcnLCBwcmVzZXJ2ZUZyYWdtZW50OiBwcmVzZXJ2ZVBhcmFtc1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtwYWdlXSwgbmF2aWdhdGlvbkV4dHJhcyk7XG4gICAgfVxuXG4gICAgZ290b0hvbWVQYWdlKCkge1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5ob21lVXJsXSk7XG4gICAgfVxuXG4gICAgcmVkaXJlY3RMb2dpblVzZXIoaWdub3JlUXVlcnlQYXJhbXM/OiBib29sZWFuKSB7XG5cbiAgICAgICAgY29uc3QgcmVkaXJlY3QgPSAodGhpcy5sb2dpblJlZGlyZWN0VXJsICYmXG4gICAgICAgICAgICAodGhpcy5sb2dpblJlZGlyZWN0VXJsICE9ICcvJykgJiZcbiAgICAgICAgICAgICh0aGlzLmxvZ2luUmVkaXJlY3RVcmwgIT0gdGhpcy5sb2dpblVybCkpID8gdGhpcy5sb2dpblJlZGlyZWN0VXJsIDogdGhpcy5ob21lVXJsO1xuICAgICAgICB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0IHVybFBhcmFtc0FuZEZyYWdtZW50ID0gVXRpbGl0aWVzLnNwbGl0SW5Ud28ocmVkaXJlY3QsICcjJyk7XG4gICAgICAgIGNvbnN0IHVybEFuZFBhcmFtcyA9IFV0aWxpdGllcy5zcGxpdEluVHdvKHVybFBhcmFtc0FuZEZyYWdtZW50LmZpcnN0UGFydCwgJz8nKTtcblxuICAgICAgICBjb25zdCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuICAgICAgICAgICAgZnJhZ21lbnQ6IHVybFBhcmFtc0FuZEZyYWdtZW50LnNlY29uZFBhcnRcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWlnbm9yZVF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKG5hdmlnYXRpb25FeHRyYXMsIHtcbiAgICAgICAgICAgICAgICBxdWVyeVBhcmFtczogVXRpbGl0aWVzLmdldFF1ZXJ5UGFyYW1zRnJvbVN0cmluZyh1cmxBbmRQYXJhbXMuc2Vjb25kUGFydCksXG4gICAgICAgICAgICAgICAgcXVlcnlQYXJhbXNIYW5kbGluZzogJ21lcmdlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdXJsQW5kUGFyYW1zLmZpcnN0UGFydF0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICAgIHJlZGlyZWN0TG9nb3V0VXNlcigpIHtcbiAgICAgICAgY29uc3QgcmVkaXJlY3QgPSB0aGlzLmxvZ291dFJlZGlyZWN0VXJsID8gdGhpcy5sb2dvdXRSZWRpcmVjdFVybCA6IHRoaXMubG9naW5Vcmw7XG4gICAgICAgIHRoaXMubG9nb3V0UmVkaXJlY3RVcmwgPSBudWxsO1xuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtyZWRpcmVjdF0pO1xuICAgIH1cblxuICAgIHJlZGlyZWN0Rm9yTG9naW4ocmVkaXJlY3RVcmw/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHJlZGlyZWN0VXJsKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgPSByZWRpcmVjdFVybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9naW5SZWRpcmVjdFVybCA9IHRoaXMucm91dGVyLnVybDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5sb2dpblVybF0pO1xuICAgIH1cblxuICAgIHJlTG9naW4oKSB7XG4gICAgICAgIGlmICh0aGlzLnJlTG9naW5EZWxlZ2F0ZSkge1xuICAgICAgICAgICAgdGhpcy5yZUxvZ2luRGVsZWdhdGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVkaXJlY3RGb3JMb2dpbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2lsbCBub3QgY2hhbmdlIHRoZSBzdGF0dXMgdGhhdCB3ZSBoYXZlIFxuICAgIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UucmVmcmVzaExvZ2luKClcbiAgICAgICAgICAgIC5waXBlKG1hcChyZXNwID0+IHRoaXMucHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcCwgdGhpcy5yZW1lbWJlck1lLCB0cnVlKSkpO1xuICAgIH1cblxuICAgIGxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHJlbWVtYmVyTWU/OiBib29sZWFuKSB7XG4gICAgICAgIC8vIENsZWFuIHdoYXQgd2UgaGF2ZSBiZWZvcmUsIHdpdGhvdXQgZW1pdHRpbmcgYW55IGV2ZW50LiBcbiAgICAgICAgdGhpcy5sb2dvdXQodHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWUsIHBhc3N3b3JkKVxuICAgICAgICAgICAgLnBpcGUobWFwKHJlc3AgPT4gdGhpcy5wcm9jZXNzTG9naW5SZXNwb25zZShyZXNwLCByZW1lbWJlck1lKSkpO1xuICAgIH1cblxuICAgIC8vIFNpbGVudCBldmVudCBpbiBjYXNlLlxuICAgIHByaXZhdGUgcHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcG9uc2U6IExvZ2luUmVzcG9uc2UsIHJlbWVtYmVyTWU6IGJvb2xlYW4sIHNpbGVudEV2ZW50PzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmFjY2Vzc190b2tlbjtcblxuICAgICAgICBpZiAoYWNjZXNzVG9rZW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhY2Nlc3NUb2tlbiBjYW5ub3QgYmUgbnVsbCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtZW1iZXJNZSA9IHJlbWVtYmVyTWUgfHwgdGhpcy5yZW1lbWJlck1lO1xuXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4gfHwgdGhpcy5yZWZyZXNoVG9rZW47XG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHJlc3BvbnNlLmV4cGlyZXNfaW47XG4gICAgICAgIGNvbnN0IHRva2VuRXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRva2VuRXhwaXJ5RGF0ZS5zZXRTZWNvbmRzKHRva2VuRXhwaXJ5RGF0ZS5nZXRTZWNvbmRzKCkgKyBleHBpcmVzSW4pO1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbkV4cGlyeSA9IHRva2VuRXhwaXJ5RGF0ZTtcbiAgICAgICAgY29uc3Qgand0SGVscGVyID0gbmV3IEp3dEhlbHBlcigpO1xuICAgICAgICBjb25zdCBkZWNvZGVkQWNjZXNzVG9rZW4gPSBqd3RIZWxwZXIuZGVjb2RlVG9rZW4oYWNjZXNzVG9rZW4pIGFzIEFjY2Vzc1Rva2VuO1xuXG4gICAgICAgIGNvbnN0IHBlcm1pc3Npb25zOiBQZXJtaXNzaW9uVmFsdWVzW10gPSBBcnJheS5pc0FycmF5KGRlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uKSA/IGRlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uIDogW2RlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uXTtcblxuICAgICAgICBpZiAoIXRoaXMuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucy5pbXBvcnQoZGVjb2RlZEFjY2Vzc1Rva2VuLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLnN1YixcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5uYW1lLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmZ1bGxuYW1lLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmVtYWlsLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmpvYnRpdGxlLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLnBob25lX251bWJlcixcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGUpID8gZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGUgOiBbZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGVdKTtcbiAgICAgICAgdXNlci5pc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc2F2ZVVzZXJEZXRhaWxzKHVzZXIsIHBlcm1pc3Npb25zLCBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuLCBhY2Nlc3NUb2tlbkV4cGlyeSwgcmVtZW1iZXJNZSk7XG5cbiAgICAgICAgaWYgKHNpbGVudEV2ZW50ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRMb2dpblN0YXR1cyh1c2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2F2ZVVzZXJEZXRhaWxzKHVzZXI6IFVzZXIsIHBlcm1pc3Npb25zOiBQZXJtaXNzaW9uVmFsdWVzW10sIGFjY2Vzc1Rva2VuOiBzdHJpbmcsIHJlZnJlc2hUb2tlbjogc3RyaW5nLCBleHBpcmVzSW46IERhdGUsIHJlbWVtYmVyTWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHJlbWVtYmVyTWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKGFjY2Vzc1Rva2VuLCBEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHJlZnJlc2hUb2tlbiwgREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEoZXhwaXJlc0luLCBEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShwZXJtaXNzaW9ucywgREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEodXNlciwgREJrZXlzLkNVUlJFTlRfVVNFUik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEoYWNjZXNzVG9rZW4sIERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKHJlZnJlc2hUb2tlbiwgREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKGV4cGlyZXNJbiwgREJrZXlzLlRPS0VOX0VYUElSRVNfSU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKHBlcm1pc3Npb25zLCBEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEodXNlciwgREJrZXlzLkNVUlJFTlRfVVNFUik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShyZW1lbWJlck1lLCBEQmtleXMuUkVNRU1CRVJfTUUpO1xuICAgIH1cblxuICAgIC8vIFNpbGllbnQgZXZlbnQgaW4gY2FzZS5cbiAgICBsb2dvdXQoc2lsZW50RXZlbnQ/OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLkNVUlJFTlRfVVNFUik7XG5cbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucy5jbGVhckxvY2FsQ2hhbmdlcygpO1xuXG4gICAgICAgIGlmIChzaWxlbnRFdmVudCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0TG9naW5TdGF0dXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZW1pdExvZ2luU3RhdHVzKGN1cnJlbnRVc2VyPzogVXNlcikge1xuICAgICAgICBjb25zdCB1c2VyID0gY3VycmVudFVzZXIgfHwgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxVc2VyPihEQmtleXMuQ1VSUkVOVF9VU0VSLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IGlzTG9nZ2VkSW4gPSB1c2VyICE9IG51bGw7XG4gICAgICAgIHRoaXMuX2xvZ2luU3RhdHVzLm5leHQoaXNMb2dnZWRJbik7XG4gICAgfVxuXG4gICAgZ2V0TG9naW5TdGF0dXNFdmVudCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luU3RhdHVzLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50VXNlcigpOiBVc2VyIHtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8VXNlcj4oREJrZXlzLkNVUlJFTlRfVVNFUiwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9XG5cbiAgICBnZXQgdXNlclBlcm1pc3Npb25zKCk6IFBlcm1pc3Npb25WYWx1ZXNbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PFBlcm1pc3Npb25WYWx1ZXNbXT4oREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMsIGZhbHNlKSB8fCBbXTtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UuYWNjZXNzVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0IGFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZSgpOiBEYXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UuYWNjZXNzVG9rZW5FeHBpcnlEYXRlO1xuICAgIH1cblxuICAgIGdldCByZWZyZXNoVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UucmVmcmVzaFRva2VuO1xuICAgIH1cblxuICAgIGdldCBpc1Nlc3Npb25FeHBpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5pc1Nlc3Npb25FeHBpcmVkO1xuICAgIH1cblxuICAgIGdldCBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VXNlciAhPSBudWxsO1xuICAgIH1cblxuICAgIGdldCByZW1lbWJlck1lKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxib29sZWFuPihEQmtleXMuUkVNRU1CRVJfTUUsIGZhbHNlKSA9PSB0cnVlO1xuICAgIH1cbn1cbiJdfQ==