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
/** @nocollapse */ OidcHelperService.ɵprov = i0.ɵɵdefineInjectable({ token: OidcHelperService, factory: OidcHelperService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(OidcHelperService, [{
        type: Injectable
    }], function () { return [{ type: i1.HttpClient }, { type: i2.OAuthService }, { type: i3.ConfigurationServiceAbstractProvider }, { type: i3.LocalStoreManagerServiceAbstractProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMtaGVscGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0NBQWdDO0FBQ2hDLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsZ0NBQWdDO0FBRWhDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUcxQyxPQUFPLEVBTUgsTUFBTSxFQUNULE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBTTlDLE1BQU0sT0FBTyxpQkFBaUI7SUFTMUIsWUFDWSxJQUFnQixFQUNoQixZQUEwQixFQUNsQyw0QkFBa0UsRUFDbEUseUJBQW1FO1FBSDNELFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFSOUIsYUFBUSxHQUFHLGNBQWMsQ0FBQztRQUMxQixVQUFLLEdBQUcsOERBQThELENBQUM7UUFXM0UsSUFBSSxDQUFDLFlBQVksR0FBRyx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXpEOzs7OztZQUtJO0lBRVIsQ0FBQztJQXZCRCxJQUFZLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQTBCN0QsaUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUNoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxtQ0FBbUMsRUFBRSxDQUFDLENBQUM7UUFDeEYsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7YUFDMUIsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUM7YUFDNUIsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUM7YUFDNUIsTUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2xDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO2FBQ2hDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWpDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFeEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2FBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQWdCLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWixDQUFDO0lBRUQsWUFBWTtRQUNSLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFFLENBQUMsQ0FBQztRQUN4RixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRTthQUMxQixNQUFNLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDMUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2xDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUV4QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLENBQUM7YUFDakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdkcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDWCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsSUFBSSxxQkFBcUI7UUFDckIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBTyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELElBQUksWUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxJQUFJLGdCQUFnQjtRQUNoQixJQUFJLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLEVBQUU7WUFDcEMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDeEUsQ0FBQzs7cUdBOUVRLGlCQUFpQjs0RUFBakIsaUJBQWlCLFdBQWpCLGlCQUFpQjtrREFBakIsaUJBQWlCO2NBRDdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRW1haWw6IGluZm9AZWJlbm1vbm5leS5jb21cbi8vIHd3dy5lYmVubW9ubmV5LmNvbS90ZW1wbGF0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBPQXV0aFNlcnZpY2UgfSBmcm9tICdhbmd1bGFyLW9hdXRoMi1vaWRjJztcblxuaW1wb3J0IHtcbiAgICBJTG9jYWxTdG9yZU1hbmFnZXJDb250cmFjdCxcbiAgICBMb2NhbFN0b3JlTWFuYWdlclNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgIElDb25maWd1cmF0aW9uU2VydmljZUNvbnRyYWN0LFxuICAgIENvbmZpZ3VyYXRpb25TZXJ2aWNlQWJzdHJhY3RQcm92aWRlcixcbiAgICBlbnZpcm9ubWVudCxcbiAgICBEQmtleXNcbn0gZnJvbSAnQHBvbHB3YXJlL25neC1hcHBraXQtY29udHJhY3RzLWFscGhhJztcblxuaW1wb3J0IHsgTG9naW5SZXNwb25zZSB9IGZyb20gJy4uL21vZGVscy9sb2dpbi1yZXNwb25zZS5tb2RlbCc7XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9pZGNIZWxwZXJTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgZ2V0IGJhc2VVcmwoKSB7IHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25zLmJhc2VVcmw7IH1cbiAgICBwcml2YXRlIGNsaWVudElkID0gJ3F1aWNrYXBwX3NwYSc7XG4gICAgcHJpdmF0ZSBzY29wZSA9ICdvcGVuaWQgZW1haWwgcGhvbmUgcHJvZmlsZSBvZmZsaW5lX2FjY2VzcyByb2xlcyBxdWlja2FwcF9hcGknO1xuXG4gICAgcHJpdmF0ZSBsb2NhbFN0b3JhZ2U6IElMb2NhbFN0b3JlTWFuYWdlckNvbnRyYWN0O1xuICAgIHByaXZhdGUgY29uZmlndXJhdGlvbnM6IElDb25maWd1cmF0aW9uU2VydmljZUNvbnRyYWN0O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICAgICAgcHJpdmF0ZSBvYXV0aFNlcnZpY2U6IE9BdXRoU2VydmljZSxcbiAgICAgICAgY29uZmlndXJhdGlvblNlcnZpY2VQcm92aWRlcjogQ29uZmlndXJhdGlvblNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyLFxuICAgICAgICBsb2NhbFN0b3JlTWFuYWdlclByb3ZpZGVyOiBMb2NhbFN0b3JlTWFuYWdlclNlcnZpY2VBYnN0cmFjdFByb3ZpZGVyKSB7XG5cbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JlTWFuYWdlclByb3ZpZGVyLmdldCgpO1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25zID0gY29uZmlndXJhdGlvblNlcnZpY2VQcm92aWRlci5nZXQoKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoZW52aXJvbm1lbnQucmVxdWlyZUh0dHBzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMub2F1dGhTZXJ2aWNlLmNvbmZpZ3VyZSh7XG4gICAgICAgICAgICAgICAgcmVxdWlyZUh0dHBzOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gKi9cblxuICAgIH1cblxuXG4gICAgbG9naW5XaXRoUGFzc3dvcmQodXNlck5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBuZXcgSHR0cEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSk7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3VzZXJuYW1lJywgdXNlck5hbWUpXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXNzd29yZCcsIHBhc3N3b3JkKVxuICAgICAgICAgICAgLmFwcGVuZCgnY2xpZW50X2lkJywgdGhpcy5jbGllbnRJZClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2dyYW50X3R5cGUnLCAncGFzc3dvcmQnKVxuICAgICAgICAgICAgLmFwcGVuZCgnc2NvcGUnLCB0aGlzLnNjb3BlKTtcblxuICAgICAgICB0aGlzLm9hdXRoU2VydmljZS5pc3N1ZXIgPSB0aGlzLmJhc2VVcmw7XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5vYXV0aFNlcnZpY2UubG9hZERpc2NvdmVyeURvY3VtZW50KCkpXG4gICAgICAgICAgICAucGlwZShtZXJnZU1hcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PExvZ2luUmVzcG9uc2U+KHRoaXMub2F1dGhTZXJ2aWNlLnRva2VuRW5kcG9pbnQsIHBhcmFtcywgeyBoZWFkZXJzOiBoZWFkZXIgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaExvZ2luKCkge1xuICAgICAgICBjb25zdCBoZWFkZXIgPSBuZXcgSHR0cEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSk7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3JlZnJlc2hfdG9rZW4nLCB0aGlzLnJlZnJlc2hUb2tlbilcbiAgICAgICAgICAgIC5hcHBlbmQoJ2NsaWVudF9pZCcsIHRoaXMuY2xpZW50SWQpXG4gICAgICAgICAgICAuYXBwZW5kKCdncmFudF90eXBlJywgJ3JlZnJlc2hfdG9rZW4nKTtcblxuICAgICAgICB0aGlzLm9hdXRoU2VydmljZS5pc3N1ZXIgPSB0aGlzLmJhc2VVcmw7XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5vYXV0aFNlcnZpY2UubG9hZERpc2NvdmVyeURvY3VtZW50KCkpXG4gICAgICAgICAgICAucGlwZShtZXJnZU1hcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PExvZ2luUmVzcG9uc2U+KHRoaXMub2F1dGhTZXJ2aWNlLnRva2VuRW5kcG9pbnQsIHBhcmFtcywgeyBoZWFkZXJzOiBoZWFkZXIgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgZ2V0IGFjY2Vzc1Rva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhKERCa2V5cy5BQ0NFU1NfVE9LRU4pO1xuICAgIH1cblxuICAgIGdldCBhY2Nlc3NUb2tlbkV4cGlyeURhdGUoKTogRGF0ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhT2JqZWN0PERhdGU+KERCa2V5cy5UT0tFTl9FWFBJUkVTX0lOLCB0cnVlKTtcbiAgICB9XG5cbiAgICBnZXQgcmVmcmVzaFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZS5nZXREYXRhKERCa2V5cy5SRUZSRVNIX1RPS0VOKTtcbiAgICB9XG5cbiAgICBnZXQgaXNTZXNzaW9uRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW5FeHBpcnlEYXRlID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjZXNzVG9rZW5FeHBpcnlEYXRlLnZhbHVlT2YoKSA8PSBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcbiAgICB9XG59XG4iXX0=