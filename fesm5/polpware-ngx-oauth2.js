import { ɵɵinject, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { from, Subject, throwError } from 'rxjs';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { DBkeys, ConfigurationServiceAbstractProvider, LocalStoreManagerServiceAbstractProvider, Utilities } from '@polpware/ngx-appkit-contracts-alpha';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
var User = /** @class */ (function () {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    function User(id, userName, fullName, email, jobTitle, phoneNumber, roles) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }
    Object.defineProperty(User.prototype, "friendlyName", {
        get: function () {
            var name = this.fullName || this.userName;
            if (this.jobTitle) {
                name = this.jobTitle + ' ' + name;
            }
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());

// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
var Permission = /** @class */ (function () {
    function Permission(name, value, groupName, description) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }
    Permission.viewUsersPermission = 'users.view';
    Permission.manageUsersPermission = 'users.manage';
    Permission.viewRolesPermission = 'roles.view';
    Permission.manageRolesPermission = 'roles.manage';
    Permission.assignRolesPermission = 'roles.assign';
    return Permission;
}());

// =============================
var OidcHelperService = /** @class */ (function () {
    function OidcHelperService(http, oauthService, configurationServiceProvider, localStoreManagerProvider) {
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
    Object.defineProperty(OidcHelperService.prototype, "baseUrl", {
        get: function () { return this.configurations.baseUrl; },
        enumerable: true,
        configurable: true
    });
    OidcHelperService.prototype.loginWithPassword = function (userName, password) {
        var _this = this;
        var header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('client_id', this.clientId)
            .append('grant_type', 'password')
            .append('scope', this.scope);
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap(function () {
            return _this.http.post(_this.oauthService.tokenEndpoint, params, { headers: header });
        }));
    };
    OidcHelperService.prototype.refreshLogin = function () {
        var _this = this;
        var header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('client_id', this.clientId)
            .append('grant_type', 'refresh_token');
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap(function () {
            return _this.http.post(_this.oauthService.tokenEndpoint, params, { headers: header });
        }));
    };
    Object.defineProperty(OidcHelperService.prototype, "accessToken", {
        get: function () {
            return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcHelperService.prototype, "accessTokenExpiryDate", {
        get: function () {
            return this.localStorage.getDataObject(DBkeys.TOKEN_EXPIRES_IN, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcHelperService.prototype, "refreshToken", {
        get: function () {
            return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcHelperService.prototype, "isSessionExpired", {
        get: function () {
            if (this.accessTokenExpiryDate == null) {
                return true;
            }
            return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
        },
        enumerable: true,
        configurable: true
    });
    /** @nocollapse */ OidcHelperService.ɵfac = function OidcHelperService_Factory(t) { return new (t || OidcHelperService)(ɵɵinject(HttpClient), ɵɵinject(OAuthService), ɵɵinject(ConfigurationServiceAbstractProvider), ɵɵinject(LocalStoreManagerServiceAbstractProvider)); };
    /** @nocollapse */ OidcHelperService.ɵprov = ɵɵdefineInjectable({ token: OidcHelperService, factory: OidcHelperService.ɵfac });
    return OidcHelperService;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(OidcHelperService, [{
        type: Injectable
    }], function () { return [{ type: HttpClient }, { type: OAuthService }, { type: ConfigurationServiceAbstractProvider }, { type: LocalStoreManagerServiceAbstractProvider }]; }, null); })();

// =============================
var JwtHelper = /** @class */ (function () {
    function JwtHelper() {
    }
    JwtHelper.prototype.urlBase64Decode = function (str) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
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
    };
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    JwtHelper.prototype.b64DecodeUnicode = function (str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };
    JwtHelper.prototype.decodeToken = function (token) {
        var parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    };
    JwtHelper.prototype.getTokenExpirationDate = function (token) {
        var decoded;
        decoded = this.decodeToken(token);
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        var date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.exp);
        return date;
    };
    JwtHelper.prototype.isTokenExpired = function (token, offsetSeconds) {
        var date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
    /** @nocollapse */ JwtHelper.ɵfac = function JwtHelper_Factory(t) { return new (t || JwtHelper)(); };
    /** @nocollapse */ JwtHelper.ɵprov = ɵɵdefineInjectable({ token: JwtHelper, factory: JwtHelper.ɵfac });
    return JwtHelper;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(JwtHelper, [{
        type: Injectable
    }], null, null); })();

// =============================
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
    /** @nocollapse */ AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(ɵɵinject(Router), ɵɵinject(OidcHelperService), ɵɵinject(ConfigurationServiceAbstractProvider), ɵɵinject(LocalStoreManagerServiceAbstractProvider)); };
    /** @nocollapse */ AuthService.ɵprov = ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac });
    return AuthService;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(AuthService, [{
        type: Injectable
    }], function () { return [{ type: Router }, { type: OidcHelperService }, { type: ConfigurationServiceAbstractProvider }, { type: LocalStoreManagerServiceAbstractProvider }]; }, null); })();

var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    AuthGuard.prototype.canLoad = function (route) {
        var url = "/" + route.path;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        if (this.authService.isLoggedIn) {
            return true;
        }
        this.authService.loginRedirectUrl = url;
        this.router.navigate(['/login']);
        return false;
    };
    /** @nocollapse */ AuthGuard.ɵfac = function AuthGuard_Factory(t) { return new (t || AuthGuard)(ɵɵinject(AuthService), ɵɵinject(Router)); };
    /** @nocollapse */ AuthGuard.ɵprov = ɵɵdefineInjectable({ token: AuthGuard, factory: AuthGuard.ɵfac });
    return AuthGuard;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(AuthGuard, [{
        type: Injectable
    }], function () { return [{ type: AuthService }, { type: Router }]; }, null); })();

// =============================
var EndpointBase = /** @class */ (function () {
    function EndpointBase(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    Object.defineProperty(EndpointBase.prototype, "requestHeaders", {
        get: function () {
            var headers = new HttpHeaders({
                Authorization: 'Bearer ' + this.authService.accessToken,
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*'
            });
            return { headers: headers };
        },
        enumerable: true,
        configurable: true
    });
    EndpointBase.prototype.refreshLogin = function () {
        var _this = this;
        return this.authService.refreshLogin().pipe(catchError(function (error) {
            return _this.handleError(error, function () { return _this.refreshLogin(); });
        }));
    };
    EndpointBase.prototype.handleError = function (error, continuation) {
        var _this = this;
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            this.isRefreshingLogin = true;
            return from(this.authService.refreshLogin()).pipe(mergeMap(function () {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(true);
                return continuation();
            }), catchError(function (refreshLoginError) {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(false);
                _this.authService.reLogin();
                if (refreshLoginError.status == 401 || (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
                    return throwError('session expired');
                }
                else {
                    return throwError("unknown refresh error (" + (refreshLoginError || 'server error') + ")");
                }
            }));
        }
        if (error.error && error.error.error == 'invalid_grant') {
            this.authService.reLogin();
            return throwError((error.error && error.error.error_description) ? "session expired (" + error.error.error_description + ")" : 'session expired');
        }
        else {
            return throwError(error);
        }
    };
    EndpointBase.prototype.pauseTask = function (continuation) {
        if (!this.taskPauser) {
            this.taskPauser = new Subject();
        }
        return this.taskPauser.pipe(switchMap(function (continueOp) {
            return continueOp ? continuation() : throwError('session expired');
        }));
    };
    EndpointBase.prototype.resumeTasks = function (continueOp) {
        var _this = this;
        setTimeout(function () {
            if (_this.taskPauser) {
                _this.taskPauser.next(continueOp);
                _this.taskPauser.complete();
                _this.taskPauser = null;
            }
        });
    };
    return EndpointBase;
}());

var NgxOauth2Module = /** @class */ (function () {
    function NgxOauth2Module() {
    }
    /** @nocollapse */ NgxOauth2Module.ɵmod = ɵɵdefineNgModule({ type: NgxOauth2Module });
    /** @nocollapse */ NgxOauth2Module.ɵinj = ɵɵdefineInjector({ factory: function NgxOauth2Module_Factory(t) { return new (t || NgxOauth2Module)(); }, providers: [
            OidcHelperService,
            AuthService,
            JwtHelper,
            AuthGuard
        ], imports: [[
                OAuthModule,
            ]] });
    return NgxOauth2Module;
}());
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(NgxOauth2Module, { imports: [OAuthModule] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgxOauth2Module, [{
        type: NgModule,
        args: [{
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
            }]
    }], null, null); })();

/*
 * Public API Surface of ngx-oauth2
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AuthGuard, AuthService, EndpointBase, JwtHelper, NgxOauth2Module, OidcHelperService, Permission, User };
//# sourceMappingURL=polpware-ngx-oauth2.js.map
