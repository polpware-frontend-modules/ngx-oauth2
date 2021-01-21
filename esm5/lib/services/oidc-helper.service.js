import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DBkeys } from '@polpware/ngx-appkit-contracts-alpha';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
    /** @nocollapse */ OidcHelperService.ɵprov = i0.ɵɵdefineInjectable({ token: OidcHelperService, factory: OidcHelperService.ɵfac, providedIn: 'root' });
    return OidcHelperService;
}());
export { OidcHelperService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(OidcHelperService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }, { type: i2.OAuthService }, { type: i3.ConfigurationServiceAbstractProvider }, { type: i3.LocalStoreManagerServiceAbstractProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMtaGVscGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFFSCxNQUFNLEVBR1QsTUFBTSxzQ0FBc0MsQ0FBQztBQUU5QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFHMUM7SUFZSSwyQkFDWSxJQUFnQixFQUNoQixZQUEwQixFQUNsQyw0QkFBa0UsRUFDbEUseUJBQW1FO1FBSDNELFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFSOUIsYUFBUSxHQUFHLGNBQWMsQ0FBQztRQUMxQixVQUFLLEdBQUcsOERBQThELENBQUM7UUFXM0UsSUFBSSxDQUFDLFlBQVksR0FBRyx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXpEOzs7OztZQUtJO0lBRVIsQ0FBQztJQXZCRCxzQkFBWSxzQ0FBTzthQUFuQixjQUF3QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUF5QjdELDZDQUFpQixHQUFqQixVQUFrQixRQUFnQixFQUFFLFFBQWdCO1FBQXBELGlCQWVDO1FBZEcsSUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxjQUFjLEVBQUUsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDO1FBQ3hGLElB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SGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIERCa2V5cywgSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3QsXG4gICAgSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3QsXG4gICAgTG9jYWxTdG9yZU1hbmFnZXJTZXJ2aWNlQWJzdHJhY3RQcm92aWRlclxufSBmcm9tICdAcG9scHdhcmUvbmd4LWFwcGtpdC1jb250cmFjdHMtYWxwaGEnO1xuaW1wb3J0IHsgT0F1dGhTZXJ2aWNlIH0gZnJvbSAnYW5ndWxhci1vYXV0aDItb2lkYyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IExvZ2luUmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvbG9naW4tcmVzcG9uc2UubW9kZWwnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE9pZGNIZWxwZXJTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgZ2V0IGJhc2VVcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmJhc2VVcmw7IH1cbiAgICBwcml2YXRlIGNsaWVudElkID0gJ3F1aWNrYXBwX3NwYSc7XG4gICAgcHJpdmF0ZSBzY29wZSA9ICdvcGVuaWQgZW1haWwgcGhvbmUgcHJvZmlsZSBvZmZsaW5lX2FjY2VzcyByb2xlcyBxdWlja2FwcF9hcGknO1xuXG4gICAgcHJpdmF0ZSBsb2NhbFN0b3JhZ2U6IElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0O1xuICAgIHByaXZhdGUgY29uZmlndXJhdGlvbnM6IElDb25maWd1cmF0aW9uU2VydmljZUNvbnRyYWN0O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICAgICAgcHJpdmF0ZSBvYXV0aFNlcnZpY2U6IE9BdXRoU2VydmljZSxcbiAgICAgICAgY29uZmlndXJhdGlvblNlcnZpY2VQcm92aWRlcjogQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgICAgICBsb2NhbFN0b3JlTWFuYWdlclByb3ZpZGVyOiBMb2NhbFN0b3JlTWFuYWdlclNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyKSB7XG5cbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JlTWFuYWdlclByb3ZpZGVyLmdldCgpO1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25zID0gY29uZmlndXJhdGlvblNlcnZpY2VQcm92aWRlci5nZXQoKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoZW52aXJvbm1lbnQucmVxdWlyZUh0dHBzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMub2F1dGhTZXJ2aWNlLmNvbmZpZ3VyZSh7XG4gICAgICAgICAgICAgICAgcmVxdWlyZUh0dHBzOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gKi9cblxuICAgIH1cblxuICAgIGxvZ2luV2l0aFBhc3N3b3JkKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpXG4gICAgICAgICAgICAuYXBwZW5kKCd1c2VybmFtZScsIHVzZXJOYW1lKVxuICAgICAgICAgICAgLmFwcGVuZCgncGFzc3dvcmQnLCBwYXNzd29yZClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NsaWVudF9pZCcsIHRoaXMuY2xpZW50SWQpXG4gICAgICAgICAgICAuYXBwZW5kKCdncmFudF90eXBlJywgJ3Bhc3N3b3JkJylcbiAgICAgICAgICAgIC5hcHBlbmQoJ3Njb3BlJywgdGhpcy5zY29wZSk7XG5cbiAgICAgICAgdGhpcy5vYXV0aFNlcnZpY2UuaXNzdWVyID0gdGhpcy5iYXNlVXJsO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMub2F1dGhTZXJ2aWNlLmxvYWREaXNjb3ZlcnlEb2N1bWVudCgpKVxuICAgICAgICAgICAgLnBpcGUobWVyZ2VNYXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxMb2dpblJlc3BvbnNlPih0aGlzLm9hdXRoU2VydmljZS50b2tlbkVuZHBvaW50LCBwYXJhbXMsIHsgaGVhZGVyczogaGVhZGVyIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpXG4gICAgICAgICAgICAuYXBwZW5kKCdyZWZyZXNoX3Rva2VuJywgdGhpcy5yZWZyZXNoVG9rZW4pXG4gICAgICAgICAgICAuYXBwZW5kKCdjbGllbnRfaWQnLCB0aGlzLmNsaWVudElkKVxuICAgICAgICAgICAgLmFwcGVuZCgnZ3JhbnRfdHlwZScsICdyZWZyZXNoX3Rva2VuJyk7XG5cbiAgICAgICAgdGhpcy5vYXV0aFNlcnZpY2UuaXNzdWVyID0gdGhpcy5iYXNlVXJsO1xuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMub2F1dGhTZXJ2aWNlLmxvYWREaXNjb3ZlcnlEb2N1bWVudCgpKVxuICAgICAgICAgICAgLnBpcGUobWVyZ2VNYXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxMb2dpblJlc3BvbnNlPih0aGlzLm9hdXRoU2VydmljZS50b2tlbkVuZHBvaW50LCBwYXJhbXMsIHsgaGVhZGVyczogaGVhZGVyIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YShEQmtleXMuQUNDRVNTX1RPS0VOKTtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXNzVG9rZW5FeHBpcnlEYXRlKCk6IERhdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YU9iamVjdDxEYXRlPihEQmtleXMuVE9LRU5fRVhQSVJFU19JTiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHJlZnJlc2hUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0RGF0YShEQmtleXMuUkVGUkVTSF9UT0tFTik7XG4gICAgfVxuXG4gICAgZ2V0IGlzU2Vzc2lvbkV4cGlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuRXhwaXJ5RGF0ZS52YWx1ZU9mKCkgPD0gbmV3IERhdGUoKS52YWx1ZU9mKCk7XG4gICAgfVxufVxuIl19