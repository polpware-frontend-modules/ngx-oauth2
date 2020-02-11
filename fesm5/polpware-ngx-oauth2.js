import { Injectable, NgModule } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { from, BehaviorSubject } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';
import { DBkeys, ConfigurationServiceAbstractProvider, LocalStoreManagerServiceAbstractProvider, ConfigurationServiceConstants, Utilities } from '@polpware/ngx-appkit-contracts-alpha';
import { Router } from '@angular/router';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/user.model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
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
if (false) {
    /** @type {?} */
    User.prototype.id;
    /** @type {?} */
    User.prototype.userName;
    /** @type {?} */
    User.prototype.fullName;
    /** @type {?} */
    User.prototype.email;
    /** @type {?} */
    User.prototype.jobTitle;
    /** @type {?} */
    User.prototype.phoneNumber;
    /** @type {?} */
    User.prototype.isEnabled;
    /** @type {?} */
    User.prototype.isLockedOut;
    /** @type {?} */
    User.prototype.roles;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/login-response.model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
/**
 * @record
 */
function LoginResponse() { }
if (false) {
    /** @type {?} */
    LoginResponse.prototype.access_token;
    /** @type {?} */
    LoginResponse.prototype.refresh_token;
    /** @type {?} */
    LoginResponse.prototype.expires_in;
    /** @type {?} */
    LoginResponse.prototype.token_type;
}
/**
 * @record
 */
function AccessToken() { }
if (false) {
    /** @type {?} */
    AccessToken.prototype.nbf;
    /** @type {?} */
    AccessToken.prototype.exp;
    /** @type {?} */
    AccessToken.prototype.iss;
    /** @type {?} */
    AccessToken.prototype.aud;
    /** @type {?} */
    AccessToken.prototype.client_id;
    /** @type {?} */
    AccessToken.prototype.sub;
    /** @type {?} */
    AccessToken.prototype.auth_time;
    /** @type {?} */
    AccessToken.prototype.idp;
    /** @type {?} */
    AccessToken.prototype.role;
    /** @type {?} */
    AccessToken.prototype.permission;
    /** @type {?} */
    AccessToken.prototype.name;
    /** @type {?} */
    AccessToken.prototype.email;
    /** @type {?} */
    AccessToken.prototype.phone_number;
    /** @type {?} */
    AccessToken.prototype.fullname;
    /** @type {?} */
    AccessToken.prototype.jobtitle;
    /** @type {?} */
    AccessToken.prototype.configuration;
    /** @type {?} */
    AccessToken.prototype.scope;
    /** @type {?} */
    AccessToken.prototype.amr;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/permission.model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
if (false) {
    /** @type {?} */
    Permission.viewUsersPermission;
    /** @type {?} */
    Permission.manageUsersPermission;
    /** @type {?} */
    Permission.viewRolesPermission;
    /** @type {?} */
    Permission.manageRolesPermission;
    /** @type {?} */
    Permission.assignRolesPermission;
    /** @type {?} */
    Permission.prototype.name;
    /** @type {?} */
    Permission.prototype.value;
    /** @type {?} */
    Permission.prototype.groupName;
    /** @type {?} */
    Permission.prototype.description;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/oidc-helper.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        get: /**
         * @private
         * @return {?}
         */
        function () { return this.configurations.baseUrl; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} userName
     * @param {?} password
     * @return {?}
     */
    OidcHelperService.prototype.loginWithPassword = /**
     * @param {?} userName
     * @param {?} password
     * @return {?}
     */
    function (userName, password) {
        var _this = this;
        /** @type {?} */
        var header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        /** @type {?} */
        var params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('client_id', this.clientId)
            .append('grant_type', 'password')
            .append('scope', this.scope);
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap((/**
         * @return {?}
         */
        function () {
            return _this.http.post(_this.oauthService.tokenEndpoint, params, { headers: header });
        })));
    };
    /**
     * @return {?}
     */
    OidcHelperService.prototype.refreshLogin = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        /** @type {?} */
        var params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('client_id', this.clientId)
            .append('grant_type', 'refresh_token');
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap((/**
         * @return {?}
         */
        function () {
            return _this.http.post(_this.oauthService.tokenEndpoint, params, { headers: header });
        })));
    };
    Object.defineProperty(OidcHelperService.prototype, "accessToken", {
        get: /**
         * @return {?}
         */
        function () {
            return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcHelperService.prototype, "accessTokenExpiryDate", {
        get: /**
         * @return {?}
         */
        function () {
            return this.localStorage.getDataObject(DBkeys.TOKEN_EXPIRES_IN, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcHelperService.prototype, "refreshToken", {
        get: /**
         * @return {?}
         */
        function () {
            return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcHelperService.prototype, "isSessionExpired", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.accessTokenExpiryDate == null) {
                return true;
            }
            return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
        },
        enumerable: true,
        configurable: true
    });
    OidcHelperService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcHelperService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: OAuthService },
        { type: ConfigurationServiceAbstractProvider },
        { type: LocalStoreManagerServiceAbstractProvider }
    ]; };
    return OidcHelperService;
}());
if (false) {
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.clientId;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.scope;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.localStorage;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.configurations;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.http;
    /**
     * @type {?}
     * @private
     */
    OidcHelperService.prototype.oauthService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/jwt-helper.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var JwtHelper = /** @class */ (function () {
    function JwtHelper() {
    }
    /**
     * @param {?} str
     * @return {?}
     */
    JwtHelper.prototype.urlBase64Decode = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        /** @type {?} */
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
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    JwtHelper.prototype.b64DecodeUnicode = 
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (/**
         * @param {?} c
         * @return {?}
         */
        function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })).join(''));
    };
    /**
     * @param {?} token
     * @return {?}
     */
    JwtHelper.prototype.decodeToken = /**
     * @param {?} token
     * @return {?}
     */
    function (token) {
        /** @type {?} */
        var parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        /** @type {?} */
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    };
    /**
     * @param {?} token
     * @return {?}
     */
    JwtHelper.prototype.getTokenExpirationDate = /**
     * @param {?} token
     * @return {?}
     */
    function (token) {
        /** @type {?} */
        var decoded;
        decoded = this.decodeToken(token);
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        /** @type {?} */
        var date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    };
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    JwtHelper.prototype.isTokenExpired = /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    function (token, offsetSeconds) {
        /** @type {?} */
        var date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
    JwtHelper.decorators = [
        { type: Injectable }
    ];
    return JwtHelper;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/auth.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/auth-guard.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    AuthGuard.prototype.canActivate = /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    function (route, state) {
        /** @type {?} */
        var url = state.url;
        return this.checkLogin(url);
    };
    /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    AuthGuard.prototype.canActivateChild = /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    function (route, state) {
        return this.canActivate(route, state);
    };
    /**
     * @param {?} route
     * @return {?}
     */
    AuthGuard.prototype.canLoad = /**
     * @param {?} route
     * @return {?}
     */
    function (route) {
        /** @type {?} */
        var url = "/" + route.path;
        return this.checkLogin(url);
    };
    /**
     * @param {?} url
     * @return {?}
     */
    AuthGuard.prototype.checkLogin = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        if (this.authService.isLoggedIn) {
            return true;
        }
        this.authService.loginRedirectUrl = url;
        this.router.navigate(['/login']);
        return false;
    };
    AuthGuard.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    AuthGuard.ctorParameters = function () { return [
        { type: AuthService },
        { type: Router }
    ]; };
    return AuthGuard;
}());
if (false) {
    /**
     * @type {?}
     * @private
     */
    AuthGuard.prototype.authService;
    /**
     * @type {?}
     * @private
     */
    AuthGuard.prototype.router;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/ngx-oauth2.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgxOauth2Module = /** @class */ (function () {
    function NgxOauth2Module() {
    }
    NgxOauth2Module.decorators = [
        { type: NgModule, args: [{
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
                },] }
    ];
    return NgxOauth2Module;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: polpware-ngx-oauth2.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { AuthGuard, AuthService, JwtHelper, NgxOauth2Module, OidcHelperService, Permission, User };
//# sourceMappingURL=polpware-ngx-oauth2.js.map
