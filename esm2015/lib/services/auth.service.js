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
export class AuthService {
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
/** @nocollapse */ AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i2.OidcHelperService), i0.ɵɵinject(i3.NgxLoggerImpl), i0.ɵɵinject(i4.ConfigurationServiceAbstractProvider), i0.ɵɵinject(i4.LocalStoreManagerServiceAbstractProvider)); };
/** @nocollapse */ AuthService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.Router }, { type: i2.OidcHelperService }, { type: i3.NgxLoggerImpl }, { type: i4.ConfigurationServiceAbstractProvider }, { type: i4.LocalStoreManagerServiceAbstractProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUVILE1BQU0sRUFJTixTQUFTLEVBQ1osTUFBTSxzQ0FBc0MsQ0FBQztBQUU5QyxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUdyQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7Ozs7O0FBTXpDLE1BQU0sT0FBTyxXQUFXO0lBbUJwQixZQUNZLE1BQWMsRUFDZCxpQkFBb0MsRUFDM0IsT0FBc0IsRUFDdkMsNEJBQWtFLEVBQ2xFLHlCQUFtRTtRQUozRCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2Qsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUMzQixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBUm5DLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQVkxQyxJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsNEJBQTRCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFekQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQTdCRCxJQUFXLFFBQVEsS0FBSyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM5RCxJQUFXLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FB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QUNwQyxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBVSxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQztJQUN2RixDQUFDOzt5RkFoUFEsV0FBVztzRUFBWCxXQUFXLFdBQVgsV0FBVyxtQkFGUixNQUFNO2tEQUVULFdBQVc7Y0FIdkIsVUFBVTtlQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmF2aWdhdGlvbkV4dHJhcywgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIERCa2V5cyxcbiAgICBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdCxcbiAgICBJTG9jYWxTdG9yZU1hbmFnZXJDb250cmFjdCxcbiAgICBMb2NhbFN0b3JlTWFuYWdlclNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIFV0aWxpdGllc1xufSBmcm9tICdAcG9scHdhcmUvbmd4LWFwcGtpdC1jb250cmFjdHMtYWxwaGEnO1xuaW1wb3J0IHsgTmd4TG9nZ2VySW1wbCB9IGZyb20gJ0Bwb2xwd2FyZS9uZ3gtbG9nZ2VyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEFjY2Vzc1Rva2VuLCBMb2dpblJlc3BvbnNlIH0gZnJvbSAnLi4vbW9kZWxzL2xvZ2luLXJlc3BvbnNlLm1vZGVsJztcbmltcG9ydCB7IFBlcm1pc3Npb25WYWx1ZXMgfSBmcm9tICcuLi9tb2RlbHMvcGVybWlzc2lvbi5tb2RlbCc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vbW9kZWxzL3VzZXIubW9kZWwnO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyJztcbmltcG9ydCB7IE9pZGNIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLWhlbHBlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG4gICAgcHVibGljIGdldCBsb2dpblVybCgpIHsgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbnMubG9naW5Vcmw7IH1cbiAgICBwdWJsaWMgZ2V0IGhvbWVVcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmhvbWVVcmw7IH1cblxuICAgIC8qKlxuICAgICAqIFRyYWNrcyB0aGUgdGhlIHVybCBhIHVzZXIgYXR0ZW1wdHMgdG8gYWNjZXNzIGJ1dCBcbiAgICAgKiBjYW5ub3QgYmUgYXV0aGVudGljYXRlZC4gXG4gICAgICovXG4gICAgcHVibGljIGxvZ2luUmVkaXJlY3RVcmw6IHN0cmluZztcblxuICAgIHB1YmxpYyBsb2dvdXRSZWRpcmVjdFVybDogc3RyaW5nO1xuXG4gICAgcHVibGljIHJlTG9naW5EZWxlZ2F0ZTogKCkgPT4gdm9pZDtcblxuICAgIHByaXZhdGUgX2xvZ2luU3RhdHVzID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIHByaXZhdGUgbG9jYWxTdG9yYWdlOiBJTG9jYWxTdG9yZU1hbmFnZXJDb250cmFjdDtcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25zOiBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIG9pZGNIZWxwZXJTZXJ2aWNlOiBPaWRjSGVscGVyU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBfbG9nZ2VyOiBOZ3hMb2dnZXJJbXBsLFxuICAgICAgICBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyOiBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgICAgIGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXI6IExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXIuZ2V0KCk7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMgPSBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyLmdldCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUxvZ2luU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplTG9naW5TdGF0dXMoKSB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmdldEluaXRFdmVudCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXRMb2dpblN0YXR1cygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnb3RvUGFnZShwYWdlOiBzdHJpbmcsIHByZXNlcnZlUGFyYW1zID0gdHJ1ZSkge1xuXG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb25FeHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7XG4gICAgICAgICAgICBxdWVyeVBhcmFtc0hhbmRsaW5nOiBwcmVzZXJ2ZVBhcmFtcyA/ICdtZXJnZScgOiAnJywgcHJlc2VydmVGcmFnbWVudDogcHJlc2VydmVQYXJhbXNcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcGFnZV0sIG5hdmlnYXRpb25FeHRyYXMpO1xuICAgIH1cblxuICAgIGdvdG9Ib21lUGFnZSgpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuaG9tZVVybF0pO1xuICAgIH1cblxuICAgIHJlZGlyZWN0TG9naW5Vc2VyKGlnbm9yZVF1ZXJ5UGFyYW1zPzogYm9vbGVhbikge1xuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhgbG9naW4gcmVkaXJlY3QgdXJsIGlzOiAke3RoaXMubG9naW5SZWRpcmVjdFVybH1gKTtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKGBob21lIHVybCBpczogJHt0aGlzLmhvbWVVcmx9YCk7XG5cbiAgICAgICAgY29uc3QgcmVkaXJlY3QgPSAodGhpcy5sb2dpblJlZGlyZWN0VXJsICYmXG4gICAgICAgICAgICAodGhpcy5sb2dpblJlZGlyZWN0VXJsICE9ICcvJykgJiZcbiAgICAgICAgICAgICh0aGlzLmxvZ2luUmVkaXJlY3RVcmwgIT0gdGhpcy5sb2dpblVybCkpID8gdGhpcy5sb2dpblJlZGlyZWN0VXJsIDogdGhpcy5ob21lVXJsO1xuICAgICAgICB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhgZmluYWwgcmVkaXJlY3QgdXJsIGlzOiAke3JlZGlyZWN0fWApO1xuXG4gICAgICAgIGNvbnN0IHVybFBhcmFtc0FuZEZyYWdtZW50ID0gVXRpbGl0aWVzLnNwbGl0SW5Ud28ocmVkaXJlY3QsICcjJyk7XG4gICAgICAgIGNvbnN0IHVybEFuZFBhcmFtcyA9IFV0aWxpdGllcy5zcGxpdEluVHdvKHVybFBhcmFtc0FuZEZyYWdtZW50LmZpcnN0UGFydCwgJz8nKTtcblxuICAgICAgICBjb25zdCBuYXZpZ2F0aW9uRXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge1xuICAgICAgICAgICAgZnJhZ21lbnQ6IHVybFBhcmFtc0FuZEZyYWdtZW50LnNlY29uZFBhcnRcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWlnbm9yZVF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKG5hdmlnYXRpb25FeHRyYXMsIHtcbiAgICAgICAgICAgICAgICBxdWVyeVBhcmFtczogVXRpbGl0aWVzLmdldFF1ZXJ5UGFyYW1zRnJvbVN0cmluZyh1cmxBbmRQYXJhbXMuc2Vjb25kUGFydCksXG4gICAgICAgICAgICAgICAgcXVlcnlQYXJhbXNIYW5kbGluZzogJ21lcmdlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoYFJlZGlyZWN0aW9uIHVybCBpczogJHt1cmxBbmRQYXJhbXMuZmlyc3RQYXJ0fWApO1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoJ0V4dHJhIHBhcmFtZXRlcnM6ICcpO1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcobmF2aWdhdGlvbkV4dHJhcyk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3VybEFuZFBhcmFtcy5maXJzdFBhcnRdLCBuYXZpZ2F0aW9uRXh0cmFzKTtcbiAgICB9XG5cbiAgICByZWRpcmVjdExvZ291dFVzZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlZGlyZWN0ID0gdGhpcy5sb2dvdXRSZWRpcmVjdFVybCA/IHRoaXMubG9nb3V0UmVkaXJlY3RVcmwgOiB0aGlzLmxvZ2luVXJsO1xuICAgICAgICB0aGlzLmxvZ291dFJlZGlyZWN0VXJsID0gbnVsbDtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcmVkaXJlY3RdKTtcbiAgICB9XG5cbiAgICByZWRpcmVjdEZvckxvZ2luKHJlZGlyZWN0VXJsPzogc3RyaW5nKSB7XG4gICAgICAgIGlmIChyZWRpcmVjdFVybCkge1xuICAgICAgICAgICAgdGhpcy5sb2dpblJlZGlyZWN0VXJsID0gcmVkaXJlY3RVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2luUmVkaXJlY3RVcmwgPSB0aGlzLnJvdXRlci51cmw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMubG9naW5VcmxdKTtcbiAgICB9XG5cbiAgICByZUxvZ2luKCkge1xuXG4gICAgICAgIGlmICh0aGlzLnJlTG9naW5EZWxlZ2F0ZSkge1xuICAgICAgICAgICAgdGhpcy5yZUxvZ2luRGVsZWdhdGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVkaXJlY3RGb3JMb2dpbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2lsbCBub3QgY2hhbmdlIHRoZSBzdGF0dXMgdGhhdCB3ZSBoYXZlIFxuICAgIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UucmVmcmVzaExvZ2luKClcbiAgICAgICAgICAgIC5waXBlKG1hcChyZXNwID0+IHRoaXMucHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcCwgdGhpcy5yZW1lbWJlck1lLCB0cnVlKSkpO1xuICAgIH1cblxuICAgIGxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHJlbWVtYmVyTWU/OiBib29sZWFuKSB7XG4gICAgICAgIC8vIENsZWFuIHdoYXQgd2UgaGF2ZSBiZWZvcmUsIHdpdGhvdXQgZW1pdHRpbmcgYW55IGV2ZW50LiBcbiAgICAgICAgdGhpcy5sb2dvdXQodHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWUsIHBhc3N3b3JkKVxuICAgICAgICAgICAgLnBpcGUobWFwKHJlc3AgPT4gdGhpcy5wcm9jZXNzTG9naW5SZXNwb25zZShyZXNwLCByZW1lbWJlck1lKSkpO1xuICAgIH1cblxuICAgIC8vIFNpbGVudCBldmVudCBpbiBjYXNlLlxuICAgIHByaXZhdGUgcHJvY2Vzc0xvZ2luUmVzcG9uc2UocmVzcG9uc2U6IExvZ2luUmVzcG9uc2UsIHJlbWVtYmVyTWU6IGJvb2xlYW4sIHNpbGVudEV2ZW50PzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmFjY2Vzc190b2tlbjtcblxuICAgICAgICBpZiAoYWNjZXNzVG9rZW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhY2Nlc3NUb2tlbiBjYW5ub3QgYmUgbnVsbCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtZW1iZXJNZSA9IHJlbWVtYmVyTWUgfHwgdGhpcy5yZW1lbWJlck1lO1xuXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4gfHwgdGhpcy5yZWZyZXNoVG9rZW47XG4gICAgICAgIGNvbnN0IGV4cGlyZXNJbiA9IHJlc3BvbnNlLmV4cGlyZXNfaW47XG4gICAgICAgIGNvbnN0IHRva2VuRXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRva2VuRXhwaXJ5RGF0ZS5zZXRTZWNvbmRzKHRva2VuRXhwaXJ5RGF0ZS5nZXRTZWNvbmRzKCkgKyBleHBpcmVzSW4pO1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbkV4cGlyeSA9IHRva2VuRXhwaXJ5RGF0ZTtcbiAgICAgICAgY29uc3Qgand0SGVscGVyID0gbmV3IEp3dEhlbHBlcigpO1xuICAgICAgICBjb25zdCBkZWNvZGVkQWNjZXNzVG9rZW4gPSBqd3RIZWxwZXIuZGVjb2RlVG9rZW4oYWNjZXNzVG9rZW4pIGFzIEFjY2Vzc1Rva2VuO1xuXG4gICAgICAgIGNvbnN0IHBlcm1pc3Npb25zOiBQZXJtaXNzaW9uVmFsdWVzW10gPSBBcnJheS5pc0FycmF5KGRlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uKSA/IGRlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uIDogW2RlY29kZWRBY2Nlc3NUb2tlbi5wZXJtaXNzaW9uXTtcblxuICAgICAgICBpZiAoIXRoaXMuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucy5pbXBvcnQoZGVjb2RlZEFjY2Vzc1Rva2VuLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLnN1YixcbiAgICAgICAgICAgIGRlY29kZWRBY2Nlc3NUb2tlbi5uYW1lLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmZ1bGxuYW1lLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmVtYWlsLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLmpvYnRpdGxlLFxuICAgICAgICAgICAgZGVjb2RlZEFjY2Vzc1Rva2VuLnBob25lX251bWJlcixcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGUpID8gZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGUgOiBbZGVjb2RlZEFjY2Vzc1Rva2VuLnJvbGVdKTtcbiAgICAgICAgdXNlci5pc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc2F2ZVVzZXJEZXRhaWxzKHVzZXIsIHBlcm1pc3Npb25zLCBhY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuLCBhY2Nlc3NUb2tlbkV4cGlyeSwgcmVtZW1iZXJNZSk7XG5cbiAgICAgICAgaWYgKHNpbGVudEV2ZW50ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRMb2dpblN0YXR1cyh1c2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2F2ZVVzZXJEZXRhaWxzKHVzZXI6IFVzZXIsIHBlcm1pc3Npb25zOiBQZXJtaXNzaW9uVmFsdWVzW10sIGFjY2Vzc1Rva2VuOiBzdHJpbmcsIHJlZnJlc2hUb2tlbjogc3RyaW5nLCBleHBpcmVzSW46IERhdGUsIHJlbWVtYmVyTWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHJlbWVtYmVyTWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKGFjY2Vzc1Rva2VuLCBEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLnNhdmVQZXJtYW5lbnREYXRhKHJlZnJlc2hUb2tlbiwgREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEoZXhwaXJlc0luLCBEQmtleXMuVE9LRU5fRVhQSVJFU19JTik7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShwZXJtaXNzaW9ucywgREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVBlcm1hbmVudERhdGEodXNlciwgREJrZXlzLkNVUlJFTlRfVVNFUik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEoYWNjZXNzVG9rZW4sIERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKHJlZnJlc2hUb2tlbiwgREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKGV4cGlyZXNJbiwgREJrZXlzLlRPS0VOX0VYUElSRVNfSU4pO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2F2ZVN5bmNlZFNlc3Npb25EYXRhKHBlcm1pc3Npb25zLCBEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlU3luY2VkU2Vzc2lvbkRhdGEodXNlciwgREJrZXlzLkNVUlJFTlRfVVNFUik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zYXZlUGVybWFuZW50RGF0YShyZW1lbWJlck1lLCBEQmtleXMuUkVNRU1CRVJfTUUpO1xuICAgIH1cblxuICAgIC8vIFNpbGllbnQgZXZlbnQgaW4gY2FzZS5cbiAgICBsb2dvdXQoc2lsZW50RXZlbnQ/OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5kZWxldGVEYXRhKERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVsZXRlRGF0YShEQmtleXMuVVNFUl9QRVJNSVNTSU9OUyk7XG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlLmRlbGV0ZURhdGEoREJrZXlzLkNVUlJFTlRfVVNFUik7XG5cbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucy5jbGVhckxvY2FsQ2hhbmdlcygpO1xuXG4gICAgICAgIGlmIChzaWxlbnRFdmVudCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0TG9naW5TdGF0dXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZW1pdExvZ2luU3RhdHVzKGN1cnJlbnRVc2VyPzogVXNlcikge1xuICAgICAgICBjb25zdCB1c2VyID0gY3VycmVudFVzZXIgfHwgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxVc2VyPihEQmtleXMuQ1VSUkVOVF9VU0VSLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IGlzTG9nZ2VkSW4gPSB1c2VyICE9IG51bGw7XG4gICAgICAgIHRoaXMuX2xvZ2luU3RhdHVzLm5leHQoaXNMb2dnZWRJbik7XG4gICAgfVxuXG4gICAgZ2V0TG9naW5TdGF0dXNFdmVudCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luU3RhdHVzLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50VXNlcigpOiBVc2VyIHtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8VXNlcj4oREJrZXlzLkNVUlJFTlRfVVNFUiwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9XG5cbiAgICBnZXQgdXNlclBlcm1pc3Npb25zKCk6IFBlcm1pc3Npb25WYWx1ZXNbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PFBlcm1pc3Npb25WYWx1ZXNbXT4oREJrZXlzLlVTRVJfUEVSTUlTU0lPTlMsIGZhbHNlKSB8fCBbXTtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UuYWNjZXNzVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0IGFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZSgpOiBEYXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UuYWNjZXNzVG9rZW5FeHBpcnlEYXRlO1xuICAgIH1cblxuICAgIGdldCByZWZyZXNoVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0hlbHBlclNlcnZpY2UucmVmcmVzaFRva2VuO1xuICAgIH1cblxuICAgIGdldCBpc1Nlc3Npb25FeHBpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vaWRjSGVscGVyU2VydmljZS5pc1Nlc3Npb25FeHBpcmVkO1xuICAgIH1cblxuICAgIGdldCBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VXNlciAhPSBudWxsO1xuICAgIH1cblxuICAgIGdldCByZW1lbWJlck1lKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxib29sZWFuPihEQmtleXMuUkVNRU1CRVJfTUUsIGZhbHNlKSA9PSB0cnVlO1xuICAgIH1cbn1cbiJdfQ==