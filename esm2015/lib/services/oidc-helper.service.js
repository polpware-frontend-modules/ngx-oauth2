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
export class OidcHelperService {
    /**
     * @param {?} http
     * @param {?} oauthService
     * @param {?} configurationServiceProvider
     * @param {?} localStoreManagerProvider
     */
    constructor(http, oauthService, configurationServiceProvider, localStoreManagerProvider) {
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
    /**
     * @private
     * @return {?}
     */
    get baseUrl() { return this.configurations.baseUrl; }
    /**
     * @param {?} userName
     * @param {?} password
     * @return {?}
     */
    loginWithPassword(userName, password) {
        /** @type {?} */
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        /** @type {?} */
        const params = new HttpParams()
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
        () => {
            return this.http.post(this.oauthService.tokenEndpoint, params, { headers: header });
        })));
    }
    /**
     * @return {?}
     */
    refreshLogin() {
        /** @type {?} */
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        /** @type {?} */
        const params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('client_id', this.clientId)
            .append('grant_type', 'refresh_token');
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap((/**
         * @return {?}
         */
        () => {
            return this.http.post(this.oauthService.tokenEndpoint, params, { headers: header });
        })));
    }
    /**
     * @return {?}
     */
    get accessToken() {
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }
    /**
     * @return {?}
     */
    get accessTokenExpiryDate() {
        return this.localStorage.getDataObject(DBkeys.TOKEN_EXPIRES_IN, true);
    }
    /**
     * @return {?}
     */
    get refreshToken() {
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }
    /**
     * @return {?}
     */
    get isSessionExpired() {
        if (this.accessTokenExpiryDate == null) {
            return true;
        }
        return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
    }
}
OidcHelperService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcHelperService.ctorParameters = () => [
    { type: HttpClient },
    { type: OAuthService },
    { type: ConfigurationServiceAbstractProvider },
    { type: LocalStoreManagerServiceAbstractProvider }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMtaGVscGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFbkQsT0FBTyxFQUVILHdDQUF3QyxFQUV4QyxvQ0FBb0MsRUFFcEMsTUFBTSxFQUNULE1BQU0sc0NBQXNDLENBQUM7QUFNOUMsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7OztJQVMxQixZQUNZLElBQWdCLEVBQ2hCLFlBQTBCLEVBQ2xDLDRCQUFrRSxFQUNsRSx5QkFBbUU7UUFIM0QsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQVI5QixhQUFRLEdBQUcsY0FBYyxDQUFDO1FBQzFCLFVBQUssR0FBRyw4REFBOEQsQ0FBQztRQVczRSxJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsNEJBQTRCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFekQ7Ozs7O1lBS0k7SUFFUixDQUFDOzs7OztJQXZCRCxJQUFZLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBMEI3RCxpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLFFBQWdC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bnRlbnQiOlsiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVtYWlsOiBpbmZvQGViZW5tb25uZXkuY29tXG4vLyB3d3cuZWJlbm1vbm5leS5jb20vdGVtcGxhdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgT0F1dGhTZXJ2aWNlIH0gZnJvbSAnYW5ndWxhci1vYXV0aDItb2lkYyc7XG5cbmltcG9ydCB7XG4gICAgSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3QsXG4gICAgTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdCxcbiAgICBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgZW52aXJvbm1lbnQsXG4gICAgREJrZXlzXG59IGZyb20gJ0Bwb2xwd2FyZS9uZ3gtYXBwa2l0LWNvbnRyYWN0cy1hbHBoYSc7XG5cbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvbG9naW4tcmVzcG9uc2UubW9kZWwnO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPaWRjSGVscGVyU2VydmljZSB7XG5cbiAgICBwcml2YXRlIGdldCBiYXNlVXJsKCkgeyByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9ucy5iYXNlVXJsOyB9XG4gICAgcHJpdmF0ZSBjbGllbnRJZCA9ICdxdWlja2FwcF9zcGEnO1xuICAgIHByaXZhdGUgc2NvcGUgPSAnb3BlbmlkIGVtYWlsIHBob25lIHByb2ZpbGUgb2ZmbGluZV9hY2Nlc3Mgcm9sZXMgcXVpY2thcHBfYXBpJztcblxuICAgIHByaXZhdGUgbG9jYWxTdG9yYWdlOiBJTG9jYWxTdG9yZU1hbmFnZXJDb250cmFjdDtcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25zOiBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgICAgIHByaXZhdGUgb2F1dGhTZXJ2aWNlOiBPQXV0aFNlcnZpY2UsXG4gICAgICAgIGNvbmZpZ3VyYXRpb25TZXJ2aWNlUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25TZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICAgICAgbG9jYWxTdG9yZU1hbmFnZXJQcm92aWRlcjogTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlcikge1xuXG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yZU1hbmFnZXJQcm92aWRlci5nZXQoKTtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucyA9IGNvbmZpZ3VyYXRpb25TZXJ2aWNlUHJvdmlkZXIuZ2V0KCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGVudmlyb25tZW50LnJlcXVpcmVIdHRwcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm9hdXRoU2VydmljZS5jb25maWd1cmUoe1xuICAgICAgICAgICAgICAgIHJlcXVpcmVIdHRwczogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ICovXG5cbiAgICB9XG5cblxuICAgIGxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpXG4gICAgICAgICAgICAuYXBwZW5kKCd1c2VybmFtZScsIHVzZXJOYW1lKVxuICAgICAgICAgICAgLmFwcGVuZCgncGFzc3dvcmQnLCBwYXNzd29yZClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NsaWVudF9pZCcsIHRoaXMuY2xpZW50SWQpXG4gICAgICAgICAgICAuYXBwZW5kKCdncmFudF90eXBlJywgJ3Bhc3N3b3JkJylcbiAgICAgICAgICAgIC5hcHBlbmQoJ3Njb3BlJywgdGhpcy5zY29wZSk7XG5cbiAgICAgICAgdGhpcy5vYXV0aFNlcnZpY2UuaXNzdWVyID0gdGhpcy5iYXNlVXJsO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMub2F1dGhTZXJ2aWNlLmxvYWREaXNjb3ZlcnlEb2N1bWVudCgpKVxuICAgICAgICAgICAgLnBpcGUobWVyZ2VNYXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxMb2dpblJlc3BvbnNlPih0aGlzLm9hdXRoU2VydmljZS50b2tlbkVuZHBvaW50LCBwYXJhbXMsIHsgaGVhZGVyczogaGVhZGVyIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWZyZXNoX3Rva2VuJywgdGhpcy5yZWZyZXNoVG9rZW4pXG4gICAgICAgICAgICAuYXBwZW5kKCdjbGllbnRfaWQnLCB0aGlzLmNsaWVudElkKVxuICAgICAgICAgICAgLmFwcGVuZCgnZ3JhbnRfdHlwZScsICdyZWZyZXNoX3Rva2VuJyk7XG5cbiAgICAgICAgdGhpcy5vYXV0aFNlcnZpY2UuaXNzdWVyID0gdGhpcy5iYXNlVXJsO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMub2F1dGhTZXJ2aWNlLmxvYWREaXNjb3ZlcnlEb2N1bWVudCgpKVxuICAgICAgICAgICAgLnBpcGUobWVyZ2VNYXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxMb2dpblJlc3BvbnNlPih0aGlzLm9hdXRoU2VydmljZS50b2tlbkVuZHBvaW50LCBwYXJhbXMsIHsgaGVhZGVyczogaGVhZGVyIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YShEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW5FeHBpcnlEYXRlKCk6IERhdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxEYXRlPihEQmtleXMuVE9LRU5fRVhQSVJFU19JTiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHJlZnJlc2hUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YShEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgfVxuXG4gICAgZ2V0IGlzU2Vzc2lvbkV4cGlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZS52YWx1ZU9mKCkgPD0gbmV3IERhdGUoKS52YWx1ZU9mKCk7XG4gICAgfVxufVxuIl19