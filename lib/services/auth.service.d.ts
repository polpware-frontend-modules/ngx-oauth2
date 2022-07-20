import { Router } from '@angular/router';
import { ConfigurationServiceAbstractProvider, LocalStoreManagerServiceAbstractProvider } from '@polpware/ngx-appkit-contracts-alpha';
import { NgxLoggerImpl } from '@polpware/ngx-logger';
import { Observable } from 'rxjs';
import { PermissionValues } from '../models/permission.model';
import { User } from '../models/user.model';
import { OidcHelperService } from './oidc-helper.service';
import * as i0 from "@angular/core";
export declare class AuthService {
    private router;
    private oidcHelperService;
    private readonly _logger;
    get loginUrl(): string;
    get homeUrl(): string;
    /**
     * Tracks the the url a user attempts to access but
     * cannot be authenticated.
     */
    loginRedirectUrl: string;
    logoutRedirectUrl: string;
    reLoginDelegate: () => void;
    private _loginStatus;
    private localStorage;
    private configurations;
    constructor(router: Router, oidcHelperService: OidcHelperService, _logger: NgxLoggerImpl, configurationServiceProvider: ConfigurationServiceAbstractProvider, localStoreManagerProvider: LocalStoreManagerServiceAbstractProvider);
    private initializeLoginStatus;
    gotoPage(page: string, preserveParams?: boolean): void;
    gotoHomePage(): void;
    redirectLoginUser(ignoreQueryParams?: boolean): void;
    redirectLogoutUser(): void;
    redirectForLogin(redirectUrl?: string): void;
    /**
     * Prepare the login URL,
     * including setting up the right redirect url.
     * @param redirectUrl Redirect url.
     */
    prepareLoginUrl(redirectUrl?: string): import("@angular/router").UrlTree;
    reLogin(): void;
    refreshLogin(): Observable<User>;
    loginWithPassword(userName: string, password: string, rememberMe?: boolean): Observable<User>;
    loginWithToken(accessToken: string, refreshToken?: string, expiresIn?: number, saveInStorage?: boolean): User;
    private processLoginResponse;
    private saveUserDetails;
    logout(silentEvent?: boolean): void;
    private emitLoginStatus;
    getLoginStatusEvent(): Observable<boolean>;
    get currentUser(): User;
    get userPermissions(): PermissionValues[];
    get accessToken(): string;
    get accessTokenExpiryDate(): Date;
    get refreshToken(): string;
    get isSessionExpired(): boolean;
    get isLoggedIn(): boolean;
    get rememberMe(): boolean;
    static ɵfac: i0.ɵɵFactoryDef<AuthService, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthService>;
}
