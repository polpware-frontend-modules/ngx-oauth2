(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs'), require('rxjs/operators'), require('angular-oauth2-oidc'), require('@polpware/ngx-appkit-contracts-alpha'), require('@angular/router')) :
    typeof define === 'function' && define.amd ? define('@polpware/ngx-oauth2', ['exports', '@angular/core', '@angular/common/http', 'rxjs', 'rxjs/operators', 'angular-oauth2-oidc', '@polpware/ngx-appkit-contracts-alpha', '@angular/router'], factory) :
    (global = global || self, factory((global.polpware = global.polpware || {}, global.polpware['ngx-oauth2'] = {}), global.ng.core, global.ng.common.http, global.rxjs, global.rxjs.operators, global.angularOauth2Oidc, global.ngxAppkitContractsAlpha, global.ng.router));
}(this, (function (exports, core, http, rxjs, operators, angularOauth2Oidc, ngxAppkitContractsAlpha, router) { 'use strict';

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
            var header = new http.HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
            /** @type {?} */
            var params = new http.HttpParams()
                .append('username', userName)
                .append('password', password)
                .append('client_id', this.clientId)
                .append('grant_type', 'password')
                .append('scope', this.scope);
            this.oauthService.issuer = this.baseUrl;
            return rxjs.from(this.oauthService.loadDiscoveryDocument())
                .pipe(operators.mergeMap((/**
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
            var header = new http.HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
            /** @type {?} */
            var params = new http.HttpParams()
                .append('refresh_token', this.refreshToken)
                .append('client_id', this.clientId)
                .append('grant_type', 'refresh_token');
            this.oauthService.issuer = this.baseUrl;
            return rxjs.from(this.oauthService.loadDiscoveryDocument())
                .pipe(operators.mergeMap((/**
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
                return this.localStorage.getData(ngxAppkitContractsAlpha.DBkeys.ACCESS_TOKEN);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcHelperService.prototype, "accessTokenExpiryDate", {
            get: /**
             * @return {?}
             */
            function () {
                return this.localStorage.getDataObject(ngxAppkitContractsAlpha.DBkeys.TOKEN_EXPIRES_IN, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcHelperService.prototype, "refreshToken", {
            get: /**
             * @return {?}
             */
            function () {
                return this.localStorage.getData(ngxAppkitContractsAlpha.DBkeys.REFRESH_TOKEN);
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        OidcHelperService.ctorParameters = function () { return [
            { type: http.HttpClient },
            { type: angularOauth2Oidc.OAuthService },
            { type: ngxAppkitContractsAlpha.ConfigurationServiceAbstractProvider },
            { type: ngxAppkitContractsAlpha.LocalStoreManagerServiceAbstractProvider }
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
            { type: core.Injectable }
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
            this._loginStatus = new rxjs.Subject();
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
                _this.emitLoginStatus();
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
            var redirect = (this.loginRedirectUrl &&
                (this.loginRedirectUrl != '/') &&
                (this.loginRedirectUrl != this.loginUrl)) ? this.loginRedirectUrl : this.homeUrl;
            this.loginRedirectUrl = null;
            /** @type {?} */
            var urlParamsAndFragment = ngxAppkitContractsAlpha.Utilities.splitInTwo(redirect, '#');
            /** @type {?} */
            var urlAndParams = ngxAppkitContractsAlpha.Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');
            /** @type {?} */
            var navigationExtras = {
                fragment: urlParamsAndFragment.secondPart,
                queryParams: ngxAppkitContractsAlpha.Utilities.getQueryParamsFromString(urlAndParams.secondPart),
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
        // Will not change the status that we have 
        // Will not change the status that we have 
        /**
         * @return {?}
         */
        AuthService.prototype.refreshLogin = 
        // Will not change the status that we have 
        /**
         * @return {?}
         */
        function () {
            var _this = this;
            return this.oidcHelperService.refreshLogin()
                .pipe(operators.map((/**
             * @param {?} resp
             * @return {?}
             */
            function (resp) { return _this.processLoginResponse(resp, _this.rememberMe, true); })));
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
            // Clean what we have before, without emitting any event. 
            this.logout(true);
            return this.oidcHelperService.loginWithPassword(userName, password)
                .pipe(operators.map((/**
             * @param {?} resp
             * @return {?}
             */
            function (resp) { return _this.processLoginResponse(resp, rememberMe); })));
        };
        // Silent event in case.
        // Silent event in case.
        /**
         * @private
         * @param {?} response
         * @param {?} rememberMe
         * @param {?=} silentEvent
         * @return {?}
         */
        AuthService.prototype.processLoginResponse = 
        // Silent event in case.
        /**
         * @private
         * @param {?} response
         * @param {?} rememberMe
         * @param {?=} silentEvent
         * @return {?}
         */
        function (response, rememberMe, silentEvent) {
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
            if (silentEvent !== true) {
                this.emitLoginStatus(user);
            }
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
                this.localStorage.savePermanentData(accessToken, ngxAppkitContractsAlpha.DBkeys.ACCESS_TOKEN);
                this.localStorage.savePermanentData(refreshToken, ngxAppkitContractsAlpha.DBkeys.REFRESH_TOKEN);
                this.localStorage.savePermanentData(expiresIn, ngxAppkitContractsAlpha.DBkeys.TOKEN_EXPIRES_IN);
                this.localStorage.savePermanentData(permissions, ngxAppkitContractsAlpha.DBkeys.USER_PERMISSIONS);
                this.localStorage.savePermanentData(user, ngxAppkitContractsAlpha.DBkeys.CURRENT_USER);
            }
            else {
                this.localStorage.saveSyncedSessionData(accessToken, ngxAppkitContractsAlpha.DBkeys.ACCESS_TOKEN);
                this.localStorage.saveSyncedSessionData(refreshToken, ngxAppkitContractsAlpha.DBkeys.REFRESH_TOKEN);
                this.localStorage.saveSyncedSessionData(expiresIn, ngxAppkitContractsAlpha.DBkeys.TOKEN_EXPIRES_IN);
                this.localStorage.saveSyncedSessionData(permissions, ngxAppkitContractsAlpha.DBkeys.USER_PERMISSIONS);
                this.localStorage.saveSyncedSessionData(user, ngxAppkitContractsAlpha.DBkeys.CURRENT_USER);
            }
            this.localStorage.savePermanentData(rememberMe, ngxAppkitContractsAlpha.DBkeys.REMEMBER_ME);
        };
        // Silient event in case.
        // Silient event in case.
        /**
         * @param {?=} silentEvent
         * @return {?}
         */
        AuthService.prototype.logout = 
        // Silient event in case.
        /**
         * @param {?=} silentEvent
         * @return {?}
         */
        function (silentEvent) {
            this.localStorage.deleteData(ngxAppkitContractsAlpha.DBkeys.ACCESS_TOKEN);
            this.localStorage.deleteData(ngxAppkitContractsAlpha.DBkeys.REFRESH_TOKEN);
            this.localStorage.deleteData(ngxAppkitContractsAlpha.DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.deleteData(ngxAppkitContractsAlpha.DBkeys.USER_PERMISSIONS);
            this.localStorage.deleteData(ngxAppkitContractsAlpha.DBkeys.CURRENT_USER);
            this.configurations.clearLocalChanges();
            if (silentEvent !== true) {
                this.emitLoginStatus();
            }
        };
        /**
         * @private
         * @param {?=} currentUser
         * @return {?}
         */
        AuthService.prototype.emitLoginStatus = /**
         * @private
         * @param {?=} currentUser
         * @return {?}
         */
        function (currentUser) {
            /** @type {?} */
            var user = currentUser || this.localStorage.getDataObject(ngxAppkitContractsAlpha.DBkeys.CURRENT_USER, false);
            /** @type {?} */
            var isLoggedIn = user != null;
            this._loginStatus.next(isLoggedIn);
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
                var user = this.localStorage.getDataObject(ngxAppkitContractsAlpha.DBkeys.CURRENT_USER, false);
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
                return this.localStorage.getDataObject(ngxAppkitContractsAlpha.DBkeys.USER_PERMISSIONS, false) || [];
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
                return this.localStorage.getDataObject(ngxAppkitContractsAlpha.DBkeys.REMEMBER_ME, false) == true;
            },
            enumerable: true,
            configurable: true
        });
        AuthService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        AuthService.ctorParameters = function () { return [
            { type: router.Router },
            { type: OidcHelperService },
            { type: ngxAppkitContractsAlpha.ConfigurationServiceAbstractProvider },
            { type: ngxAppkitContractsAlpha.LocalStoreManagerServiceAbstractProvider }
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        AuthGuard.ctorParameters = function () { return [
            { type: AuthService },
            { type: router.Router }
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
     * Generated from: lib/services/endpoint-base.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var EndpointBase = /** @class */ (function () {
        function EndpointBase(http, authService) {
            this.http = http;
            this.authService = authService;
        }
        Object.defineProperty(EndpointBase.prototype, "requestHeaders", {
            get: /**
             * @protected
             * @return {?}
             */
            function () {
                /** @type {?} */
                var headers = new http.HttpHeaders({
                    Authorization: 'Bearer ' + this.authService.accessToken,
                    'Content-Type': 'application/json',
                    Accept: 'application/json, text/plain, */*'
                });
                return { headers: headers };
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        EndpointBase.prototype.refreshLogin = /**
         * @return {?}
         */
        function () {
            var _this = this;
            return this.authService.refreshLogin().pipe(operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
                return _this.handleError(error, (/**
                 * @return {?}
                 */
                function () { return _this.refreshLogin(); }));
            })));
        };
        /**
         * @protected
         * @param {?} error
         * @param {?} continuation
         * @return {?}
         */
        EndpointBase.prototype.handleError = /**
         * @protected
         * @param {?} error
         * @param {?} continuation
         * @return {?}
         */
        function (error, continuation) {
            var _this = this;
            if (error.status == 401) {
                if (this.isRefreshingLogin) {
                    return this.pauseTask(continuation);
                }
                this.isRefreshingLogin = true;
                return rxjs.from(this.authService.refreshLogin()).pipe(operators.mergeMap((/**
                 * @return {?}
                 */
                function () {
                    _this.isRefreshingLogin = false;
                    _this.resumeTasks(true);
                    return continuation();
                })), operators.catchError((/**
                 * @param {?} refreshLoginError
                 * @return {?}
                 */
                function (refreshLoginError) {
                    _this.isRefreshingLogin = false;
                    _this.resumeTasks(false);
                    _this.authService.reLogin();
                    if (refreshLoginError.status == 401 || (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
                        return rxjs.throwError('session expired');
                    }
                    else {
                        return rxjs.throwError("unknown refresh error (" + (refreshLoginError || 'server error') + ")");
                    }
                })));
            }
            if (error.error && error.error.error == 'invalid_grant') {
                this.authService.reLogin();
                return rxjs.throwError((error.error && error.error.error_description) ? "session expired (" + error.error.error_description + ")" : 'session expired');
            }
            else {
                return rxjs.throwError(error);
            }
        };
        /**
         * @private
         * @param {?} continuation
         * @return {?}
         */
        EndpointBase.prototype.pauseTask = /**
         * @private
         * @param {?} continuation
         * @return {?}
         */
        function (continuation) {
            if (!this.taskPauser) {
                this.taskPauser = new rxjs.Subject();
            }
            return this.taskPauser.pipe(operators.switchMap((/**
             * @param {?} continueOp
             * @return {?}
             */
            function (continueOp) {
                return continueOp ? continuation() : rxjs.throwError('session expired');
            })));
        };
        /**
         * @private
         * @param {?} continueOp
         * @return {?}
         */
        EndpointBase.prototype.resumeTasks = /**
         * @private
         * @param {?} continueOp
         * @return {?}
         */
        function (continueOp) {
            var _this = this;
            setTimeout((/**
             * @return {?}
             */
            function () {
                if (_this.taskPauser) {
                    _this.taskPauser.next(continueOp);
                    _this.taskPauser.complete();
                    _this.taskPauser = null;
                }
            }));
        };
        return EndpointBase;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        EndpointBase.prototype.taskPauser;
        /**
         * @type {?}
         * @private
         */
        EndpointBase.prototype.isRefreshingLogin;
        /**
         * @type {?}
         * @protected
         */
        EndpointBase.prototype.http;
        /**
         * @type {?}
         * @private
         */
        EndpointBase.prototype.authService;
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
            { type: core.NgModule, args: [{
                        declarations: [],
                        imports: [
                            angularOauth2Oidc.OAuthModule,
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

    exports.AuthGuard = AuthGuard;
    exports.AuthService = AuthService;
    exports.EndpointBase = EndpointBase;
    exports.JwtHelper = JwtHelper;
    exports.NgxOauth2Module = NgxOauth2Module;
    exports.OidcHelperService = OidcHelperService;
    exports.Permission = Permission;
    exports.User = User;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=polpware-ngx-oauth2.umd.js.map
