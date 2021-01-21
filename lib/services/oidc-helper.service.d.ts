import { HttpClient } from '@angular/common/http';
import { ConfigurationServiceAbstractProvider, LocalStoreManagerServiceAbstractProvider } from '@polpware/ngx-appkit-contracts-alpha';
import { OAuthService } from 'angular-oauth2-oidc';
import { LoginResponse } from '../models/login-response.model';
import * as i0 from "@angular/core";
export declare class OidcHelperService {
    private http;
    private oauthService;
    private get baseUrl();
    private clientId;
    private scope;
    private localStorage;
    private configurations;
    constructor(http: HttpClient, oauthService: OAuthService, configurationServiceProvider: ConfigurationServiceAbstractProvider, localStoreManagerProvider: LocalStoreManagerServiceAbstractProvider);
    loginWithPassword(userName: string, password: string): import("rxjs").Observable<LoginResponse>;
    refreshLogin(): import("rxjs").Observable<LoginResponse>;
    get accessToken(): string;
    get accessTokenExpiryDate(): Date;
    get refreshToken(): string;
    get isSessionExpired(): boolean;
    static ɵfac: i0.ɵɵFactoryDef<OidcHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDef<OidcHelperService>;
}
