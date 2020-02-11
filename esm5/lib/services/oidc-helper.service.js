/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/oidc-helper.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { LocalStoreManagerServiceAbstractProvider, ConfigurationServiceAbstractProvider, DBkeys } from '@polpware/ngx-appkit-contracts-alpha';
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
export { OidcHelperService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMtaGVscGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFbkQsT0FBTyxFQUVILHdDQUF3QyxFQUV4QyxvQ0FBb0MsRUFFcEMsTUFBTSxFQUNULE1BQU0sc0NBQXNDLENBQUM7QUFLOUM7SUFVSSwyQkFDWSxJQUFnQixFQUNoQixZQUEwQixFQUNsQyw0QkFBa0UsRUFDbEUseUJBQW1FO1FBSDNELFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFSOUIsYUFBUSxHQUFHLGNBQWMsQ0FBQztRQUMxQixVQUFLLEdBQUcsOERBQThELENBQUM7UUFXM0UsSUFBSSxDQUFDLFlBQVksR0FBRyx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXpEOzs7OztZQUtJO0lBRVIsQ0FBQztJQXZCRCxzQkFBWSxzQ0FBTzs7Ozs7UUFBbkIsY0FBd0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7OztPQUFBOzs7Ozs7SUEwQjdELDZDQUFpQjs7Ozs7SUFBakIsVUFBa0IsUUFBZ0IsRUFBRSxR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Ozs7Ozs7SUFHMUIscUNBQWtDOzs7OztJQUNsQyxrQ0FBK0U7Ozs7O0lBRS9FLHlDQUFpRDs7Ozs7SUFDakQsMkNBQXNEOzs7OztJQUdsRCxpQ0FBd0I7Ozs7O0lBQ3hCLHlDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFbWFpbDogaW5mb0BlYmVubW9ubmV5LmNvbVxuLy8gd3d3LmViZW5tb25uZXkuY29tL3RlbXBsYXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE9BdXRoU2VydmljZSB9IGZyb20gJ2FuZ3VsYXItb2F1dGgyLW9pZGMnO1xuXG5pbXBvcnQge1xuICAgIElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0LFxuICAgIExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3QsXG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIGVudmlyb25tZW50LFxuICAgIERCa2V5c1xufSBmcm9tICdAcG9scHdhcmUvbmd4LWFwcGtpdC1jb250cmFjdHMtYWxwaGEnO1xuXG5pbXBvcnQgeyBMb2dpblJlc3BvbnNlIH0gZnJvbSAnLi4vbW9kZWxzL2xvZ2luLXJlc3BvbnNlLm1vZGVsJztcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT2lkY0hlbHBlclNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBnZXQgYmFzZVVybCgpIHsgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbnMuYmFzZVVybDsgfVxuICAgIHByaXZhdGUgY2xpZW50SWQgPSAncXVpY2thcHBfc3BhJztcbiAgICBwcml2YXRlIHNjb3BlID0gJ29wZW5pZCBlbWFpbCBwaG9uZSBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIHJvbGVzIHF1aWNrYXBwX2FwaSc7XG5cbiAgICBwcml2YXRlIGxvY2FsU3RvcmFnZTogSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3Q7XG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uczogSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgICAgICBwcml2YXRlIG9hdXRoU2VydmljZTogT0F1dGhTZXJ2aWNlLFxuICAgICAgICBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyOiBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgICAgIGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXI6IExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXIuZ2V0KCk7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMgPSBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyLmdldCgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5yZXF1aXJlSHR0cHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5vYXV0aFNlcnZpY2UuY29uZmlndXJlKHtcbiAgICAgICAgICAgICAgICByZXF1aXJlSHR0cHM6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSAqL1xuXG4gICAgfVxuXG5cbiAgICBsb2dpbldpdGhQYXNzd29yZCh1c2VyTmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IG5ldyBIdHRwSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9KTtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoKVxuICAgICAgICAgICAgLmFwcGVuZCgndXNlcm5hbWUnLCB1c2VyTmFtZSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3Bhc3N3b3JkJywgcGFzc3dvcmQpXG4gICAgICAgICAgICAuYXBwZW5kKCdjbGllbnRfaWQnLCB0aGlzLmNsaWVudElkKVxuICAgICAgICAgICAgLmFwcGVuZCgnZ3JhbnRfdHlwZScsICdwYXNzd29yZCcpXG4gICAgICAgICAgICAuYXBwZW5kKCdzY29wZScsIHRoaXMuc2NvcGUpO1xuXG4gICAgICAgIHRoaXMub2F1dGhTZXJ2aWNlLmlzc3VlciA9IHRoaXMuYmFzZVVybDtcblxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLm9hdXRoU2VydmljZS5sb2FkRGlzY292ZXJ5RG9jdW1lbnQoKSlcbiAgICAgICAgICAgIC5waXBlKG1lcmdlTWFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8TG9naW5SZXNwb25zZT4odGhpcy5vYXV0aFNlcnZpY2UudG9rZW5FbmRwb2ludCwgcGFyYW1zLCB7IGhlYWRlcnM6IGhlYWRlciB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZWZyZXNoTG9naW4oKSB7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IG5ldyBIdHRwSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9KTtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoKVxuICAgICAgICAgICAgLmFwcGVuZCgncmVmcmVzaF90b2tlbicsIHRoaXMucmVmcmVzaFRva2VuKVxuICAgICAgICAgICAgLmFwcGVuZCgnY2xpZW50X2lkJywgdGhpcy5jbGllbnRJZClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2dyYW50X3R5cGUnLCAncmVmcmVzaF90b2tlbicpO1xuXG4gICAgICAgIHRoaXMub2F1dGhTZXJ2aWNlLmlzc3VlciA9IHRoaXMuYmFzZVVybDtcblxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLm9hdXRoU2VydmljZS5sb2FkRGlzY292ZXJ5RG9jdW1lbnQoKSlcbiAgICAgICAgICAgIC5waXBlKG1lcmdlTWFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8TG9naW5SZXNwb25zZT4odGhpcy5vYXV0aFNlcnZpY2UudG9rZW5FbmRwb2ludCwgcGFyYW1zLCB7IGhlYWRlcnM6IGhlYWRlciB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGEoREJrZXlzLkFDQ0VTU19UT0tFTik7XG4gICAgfVxuXG4gICAgZ2V0IGFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZSgpOiBEYXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGFPYmplY3Q8RGF0ZT4oREJrZXlzLlRPS0VOX0VYUElSRVNfSU4sIHRydWUpO1xuICAgIH1cblxuICAgIGdldCByZWZyZXNoVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlLmdldERhdGEoREJrZXlzLlJFRlJFU0hfVE9LRU4pO1xuICAgIH1cblxuICAgIGdldCBpc1Nlc3Npb25FeHBpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbkV4cGlyeURhdGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbkV4cGlyeURhdGUudmFsdWVPZigpIDw9IG5ldyBEYXRlKCkudmFsdWVPZigpO1xuICAgIH1cbn1cbiJdfQ==