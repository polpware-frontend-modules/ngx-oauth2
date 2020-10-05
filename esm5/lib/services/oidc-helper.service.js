// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DBkeys } from '@polpware/ngx-appkit-contracts-alpha';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "angular-oauth2-oidc";
import * as i3 from "@polpware/ngx-appkit-contracts-alpha";
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
    /** @nocollapse */ OidcHelperService.ɵfac = function OidcHelperService_Factory(t) { return new (t || OidcHelperService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.OAuthService), i0.ɵɵinject(i3.ConfigurationServiceAbstractProvider), i0.ɵɵinject(i3.LocalStoreManagerServiceAbstractProvider)); };
    /** @nocollapse */ OidcHelperService.ɵprov = i0.ɵɵdefineInjectable({ token: OidcHelperService, factory: OidcHelperService.ɵfac });
    return OidcHelperService;
}());
export { OidcHelperService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(OidcHelperService, [{
        type: Injectable
    }], function () { return [{ type: i1.HttpClient }, { type: i2.OAuthService }, { type: i3.ConfigurationServiceAbstractProvider }, { type: i3.LocalStoreManagerServiceAbstractProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMtaGVscGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0NBQWdDO0FBQ2hDLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsZ0NBQWdDO0FBRWhDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUcxQyxPQUFPLEVBTUgsTUFBTSxFQUNULE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBSzlDO0lBVUksMkJBQ1ksSUFBZ0IsRUFDaEIsWUFBMEIsRUFDbEMsNEJBQWtFLEVBQ2xFLHlCQUFtRTtRQUgzRCxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBUjlCLGFBQVEsR0FBRyxjQUFjLENBQUM7UUFDMUIsVUFBSyxHQUFHLDhEQUE4RCxDQUFDO1FBVzNFLElBQUksQ0FBQyxZQUFZLEdBQUcseUJBQXlCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGNBQWMsR0FBRyw0QkFBNEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUV6RDs7Ozs7WUFLSTtJQUVSLENBQUM7SUF2QkQsc0JBQVksc0NBQU87YUFBbkIsY0FBd0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBMEI3RCw2Q0FBaUIsR0FBakIsVUFBa0IsUUFBZ0IsRUFBRSxRQUFnQjtRQUFwRCxpQkFlQztRQWRHLElBQU0sTUFBTSxHQUFHLElBQUksV0FB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PT09PT09PT09PT09PT09PT1cbi8vIEVtYWlsOiBpbmZvQGViZW5tb25uZXkuY29tXG4vLyB3d3cuZWJlbm1vbm5leS5jb20vdGVtcGxhdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgT0F1dGhTZXJ2aWNlIH0gZnJvbSAnYW5ndWxhci1vYXV0aDItb2lkYyc7XG5cbmltcG9ydCB7XG4gICAgSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3QsXG4gICAgTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdCxcbiAgICBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgZW52aXJvbm1lbnQsXG4gICAgREJrZXlzXG59IGZyb20gJ0Bwb2xwd2FyZS9uZ3gtYXBwa2l0LWNvbnRyYWN0cy1hbHBoYSc7XG5cbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvbG9naW4tcmVzcG9uc2UubW9kZWwnO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPaWRjSGVscGVyU2VydmljZSB7XG5cbiAgICBwcml2YXRlIGdldCBiYXNlVXJsKCkgeyByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9ucy5iYXNlVXJsOyB9XG4gICAgcHJpdmF0ZSBjbGllbnRJZCA9ICdxdWlja2FwcF9zcGEnO1xuICAgIHByaXZhdGUgc2NvcGUgPSAnb3BlbmlkIGVtYWlsIHBob25lIHByb2ZpbGUgb2ZmbGluZV9hY2Nlc3Mgcm9sZXMgcXVpY2thcHBfYXBpJztcblxuICAgIHByaXZhdGUgbG9jYWxTdG9yYWdlOiBJTG9jYWxTdG9yZU1hbmFnZXJDb250cmFjdDtcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25zOiBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgICAgIHByaXZhdGUgb2F1dGhTZXJ2aWNlOiBPQXV0aFNlcnZpY2UsXG4gICAgICAgIGNvbmZpZ3VyYXRpb25TZXJ2aWNlUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25TZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICAgICAgbG9jYWxTdG9yZU1hbmFnZXJQcm92aWRlcjogTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlcikge1xuXG4gICAgICAgIHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yZU1hbmFnZXJQcm92aWRlci5nZXQoKTtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9ucyA9IGNvbmZpZ3VyYXRpb25TZXJ2aWNlUHJvdmlkZXIuZ2V0KCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGVudmlyb25tZW50LnJlcXVpcmVIdHRwcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm9hdXRoU2VydmljZS5jb25maWd1cmUoe1xuICAgICAgICAgICAgICAgIHJlcXVpcmVIdHRwczogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ICovXG5cbiAgICB9XG5cblxuICAgIGxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpXG4gICAgICAgICAgICAuYXBwZW5kKCd1c2VybmFtZScsIHVzZXJOYW1lKVxuICAgICAgICAgICAgLmFwcGVuZCgncGFzc3dvcmQnLCBwYXNzd29yZClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NsaWVudF9pZCcsIHRoaXMuY2xpZW50SWQpXG4gICAgICAgICAgICAuYXBwZW5kKCdncmFudF90eXBlJywgJ3Bhc3N3b3JkJylcbiAgICAgICAgICAgIC5hcHBlbmQoJ3Njb3BlJywgdGhpcy5zY29wZSk7XG5cbiAgICAgICAgdGhpcy5vYXV0aFNlcnZpY2UuaXNzdWVyID0gdGhpcy5iYXNlVXJsO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMub2F1dGhTZXJ2aWNlLmxvYWREaXNjb3ZlcnlEb2N1bWVudCgpKVxuICAgICAgICAgICAgLnBpcGUobWVyZ2VNYXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxMb2dpblJlc3BvbnNlPih0aGlzLm9hdXRoU2VydmljZS50b2tlbkVuZHBvaW50LCBwYXJhbXMsIHsgaGVhZGVyczogaGVhZGVyIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWZyZXNoX3Rva2VuJywgdGhpcy5yZWZyZXNoVG9rZW4pXG4gICAgICAgICAgICAuYXBwZW5kKCdjbGllbnRfaWQnLCB0aGlzLmNsaWVudElkKVxuICAgICAgICAgICAgLmFwcGVuZCgnZ3JhbnRfdHlwZScsICdyZWZyZXNoX3Rva2VuJyk7XG5cbiAgICAgICAgdGhpcy5vYXV0aFNlcnZpY2UuaXNzdWVyID0gdGhpcy5iYXNlVXJsO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMub2F1dGhTZXJ2aWNlLmxvYWREaXNjb3ZlcnlEb2N1bWVudCgpKVxuICAgICAgICAgICAgLnBpcGUobWVyZ2VNYXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxMb2dpblJlc3BvbnNlPih0aGlzLm9hdXRoU2VydmljZS50b2tlbkVuZHBvaW50LCBwYXJhbXMsIHsgaGVhZGVyczogaGVhZGVyIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YShEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW5FeHBpcnlEYXRlKCk6IERhdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxEYXRlPihEQmtleXMuVE9LRU5fRVhQSVJFU19JTiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHJlZnJlc2hUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YShEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgfVxuXG4gICAgZ2V0IGlzU2Vzc2lvbkV4cGlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZS52YWx1ZU9mKCkgPD0gbmV3IERhdGUoKS52YWx1ZU9mKCk7XG4gICAgfVxufVxuIl19