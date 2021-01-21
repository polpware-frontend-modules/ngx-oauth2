import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DBkeys } from '@polpware/ngx-appkit-contracts-alpha';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "angular-oauth2-oidc";
import * as i3 from "@polpware/ngx-appkit-contracts-alpha";
export class OidcHelperService {
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
    get baseUrl() { return this.configurations.baseUrl; }
    loginWithPassword(userName, password) {
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('client_id', this.clientId)
            .append('grant_type', 'password')
            .append('scope', this.scope);
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap(() => {
            return this.http.post(this.oauthService.tokenEndpoint, params, { headers: header });
        }));
    }
    refreshLogin() {
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const params = new HttpParams()
            .append('refresh_token', this.refreshToken)
            .append('client_id', this.clientId)
            .append('grant_type', 'refresh_token');
        this.oauthService.issuer = this.baseUrl;
        return from(this.oauthService.loadDiscoveryDocument())
            .pipe(mergeMap(() => {
            return this.http.post(this.oauthService.tokenEndpoint, params, { headers: header });
        }));
    }
    get accessToken() {
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }
    get accessTokenExpiryDate() {
        return this.localStorage.getDataObject(DBkeys.TOKEN_EXPIRES_IN, true);
    }
    get refreshToken() {
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }
    get isSessionExpired() {
        if (this.accessTokenExpiryDate == null) {
            return true;
        }
        return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
    }
}
/** @nocollapse */ OidcHelperService.ɵfac = function OidcHelperService_Factory(t) { return new (t || OidcHelperService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.OAuthService), i0.ɵɵinject(i3.ConfigurationServiceAbstractProvider), i0.ɵɵinject(i3.LocalStoreManagerServiceAbstractProvider)); };
/** @nocollapse */ OidcHelperService.ɵprov = i0.ɵɵdefineInjectable({ token: OidcHelperService, factory: OidcHelperService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(OidcHelperService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }, { type: i2.OAuthService }, { type: i3.ConfigurationServiceAbstractProvider }, { type: i3.LocalStoreManagerServiceAbstractProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMtaGVscGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFFSCxNQUFNLEVBR1QsTUFBTSxzQ0FBc0MsQ0FBQztBQUU5QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFNMUMsTUFBTSxPQUFPLGlCQUFpQjtJQVMxQixZQUNZLElBQWdCLEVBQ2hCLFlBQTBCLEVBQ2xDLDRCQUFrRSxFQUNsRSx5QkFBbUU7UUFIM0QsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQVI5QixhQUFRLEdBQUcsY0FBYyxDQUFDO1FBQzFCLFVBQUssR0FBRyw4REFBOEQsQ0FBQztRQVczRSxJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsNEJBQTRCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFekQ7Ozs7O1lBS0k7SUFFUixDQUFDO0lBdkJELElBQVksT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBeUI3RCxpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFFLENBQUMsQ0FBQztRQUN4RixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRTthQUMxQixNQUFNLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQzthQUM1QixNQUFNLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQzthQUM1QixNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDbEMsTUFBTSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7YUFDaEMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUV4QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLENBQUM7YUFDakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdkcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFRCxZQUFZO1FBQ1IsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxjQUFjLEVBQUUsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDO1FBQ3hGLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO2FBQzFCLE1BQU0sQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQzthQUMxQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDbEMsTUFBTSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRXhDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMscUJBQXFCLEVBQUUsQ0FBQzthQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUNoQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFnQixJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN2RyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUVELElBQUksV0FBVztRQUNYLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxJQUFJLHFCQUFxQjtRQUNyQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFPLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ1osT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELElBQUksZ0JBQWdCO1FBQ2hCLElBQUksSUFBSSxDQUFDLHFCQUFxQixJQUFJLElBQUksRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4RSxDQUFDOztxR0E3RVEsaUJBQWlCOzRFQUFqQixpQkFBaUIsV0FBakIsaUJBQWlCLG1CQUZkLE1BQU07a0RBRVQsaUJBQWlCO2NBSDdCLFVBQVU7ZUFBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgREJrZXlzLCBJQ29uZmlndXJhdGlvblNlcnZpY2VDb250cmFjdCxcbiAgICBJTG9jYWxTdG9yZU1hbmFnZXJDb250cmFjdCxcbiAgICBMb2NhbFN0b3JlTWFuYWdlclNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyXG59IGZyb20gJ0Bwb2xwd2FyZS9uZ3gtYXBwa2l0LWNvbnRyYWN0cy1hbHBoYSc7XG5pbXBvcnQgeyBPQXV0aFNlcnZpY2UgfSBmcm9tICdhbmd1bGFyLW9hdXRoMi1vaWRjJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4uL21vZGVscy9sb2dpbi1yZXNwb25zZS5tb2RlbCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgT2lkY0hlbHBlclNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBnZXQgYmFzZVVybCgpIHsgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbnMuYmFzZVVybDsgfVxuICAgIHByaXZhdGUgY2xpZW50SWQgPSAncXVpY2thcHBfc3BhJztcbiAgICBwcml2YXRlIHNjb3BlID0gJ29wZW5pZCBlbWFpbCBwaG9uZSBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIHJvbGVzIHF1aWNrYXBwX2FwaSc7XG5cbiAgICBwcml2YXRlIGxvY2FsU3RvcmFnZTogSUxvY2FsU3RvcmVNYW5hZ2VyQ29udHJhY3Q7XG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uczogSUNvbmZpZ3VyYXRpb25TZXJ2aWNlQ29udHJhY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgICAgICBwcml2YXRlIG9hdXRoU2VydmljZTogT0F1dGhTZXJ2aWNlLFxuICAgICAgICBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyOiBDb25maWd1cmF0aW9uU2VydmljZUFic3RyYWN0UHJvdmlkZXIsXG4gICAgICAgIGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXI6IExvY2FsU3RvcmVNYW5hZ2VyU2VydmljZUFic3RyYWN0UHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmVNYW5hZ2VyUHJvdmlkZXIuZ2V0KCk7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvbnMgPSBjb25maWd1cmF0aW9uU2VydmljZVByb3ZpZGVyLmdldCgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChlbnZpcm9ubWVudC5yZXF1aXJlSHR0cHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5vYXV0aFNlcnZpY2UuY29uZmlndXJlKHtcbiAgICAgICAgICAgICAgICByZXF1aXJlSHR0cHM6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSAqL1xuXG4gICAgfVxuXG4gICAgbG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBuZXcgSHR0cEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSk7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3VzZXJuYW1lJywgdXNlck5hbWUpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXNzd29yZCcsIHBhc3N3b3JkKVxuICAgICAgICAgICAgLmFwcGVuZCgnY2xpZW50X2lkJywgdGhpcy5jbGllbnRJZClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2dyYW50X3R5cGUnLCAncGFzc3dvcmQnKVxuICAgICAgICAgICAgLmFwcGVuZCgnc2NvcGUnLCB0aGlzLnNjb3BlKTtcblxuICAgICAgICB0aGlzLm9hdXRoU2VydmljZS5pc3N1ZXIgPSB0aGlzLmJhc2VVcmw7XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5vYXV0aFNlcnZpY2UubG9hZERpc2NvdmVyeURvY3VtZW50KCkpXG4gICAgICAgICAgICAucGlwZShtZXJnZU1hcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PExvZ2luUmVzcG9uc2U+KHRoaXMub2F1dGhTZXJ2aWNlLnRva2VuRW5kcG9pbnQsIHBhcmFtcywgeyBoZWFkZXJzOiBoZWFkZXIgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaExvZ2luKCkge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBuZXcgSHR0cEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSk7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlZnJlc2hfdG9rZW4nLCB0aGlzLnJlZnJlc2hUb2tlbilcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NsaWVudF9pZCcsIHRoaXMuY2xpZW50SWQpXG4gICAgICAgICAgICAuYXBwZW5kKCdncmFudF90eXBlJywgJ3JlZnJlc2hfdG9rZW4nKTtcblxuICAgICAgICB0aGlzLm9hdXRoU2VydmljZS5pc3N1ZXIgPSB0aGlzLmJhc2VVcmw7XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5vYXV0aFNlcnZpY2UubG9hZERpc2NvdmVyeURvY3VtZW50KCkpXG4gICAgICAgICAgICAucGlwZShtZXJnZU1hcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PExvZ2luUmVzcG9uc2U+KHRoaXMub2F1dGhTZXJ2aWNlLnRva2VuRW5kcG9pbnQsIHBhcmFtcywgeyBoZWFkZXJzOiBoZWFkZXIgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgZ2V0IGFjY2Vzc1Rva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhKERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbkV4cGlyeURhdGUoKTogRGF0ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PERhdGU+KERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOLCB0cnVlKTtcbiAgICB9XG5cbiAgICBnZXQgcmVmcmVzaFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhKERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICB9XG5cbiAgICBnZXQgaXNTZXNzaW9uRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW5FeHBpcnlEYXRlID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjZXNzVG9rZW5FeHBpcnlEYXRlLnZhbHVlT2YoKSA8PSBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcbiAgICB9XG59XG4iXX0=