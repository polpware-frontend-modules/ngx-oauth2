import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { LocalStoreManagerServiceAbstractProvider, ConfigurationServiceAbstractProvider } from '@polpware/ngx-appkit-contracts-alpha';
import { LoginResponse } from '../models/login-response.model';
export declare class OidcHelperService {
    private http;
    private oauthService;
    private readonly baseUrl;
    private clientId;
    private scope;
    private localStorage;
    private configurations;
    constructor(http: HttpClient, oauthService: OAuthService, configurationServiceProvider: ConfigurationServiceAbstractProvider, localStoreManagerProvider: LocalStoreManagerServiceAbstractProvider);
    loginWithPassword(userName: string, password: string): import("rxjs").Observable<LoginResponse>;
    refreshLogin(): import("rxjs").Observable<LoginResponse>;
    readonly accessToken: string;
    readonly accessTokenExpiryDate: Date;
    readonly refreshToken: string;
    readonly isSessionExpired: boolean;
}
