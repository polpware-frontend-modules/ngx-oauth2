import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import * as i0 from "@angular/core";
export declare class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    private readonly _authService;
    constructor(_authService: AuthService);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    canLoad(route: Route): boolean;
    checkLogin(url: string): boolean;
    static ɵfac: i0.ɵɵFactoryDef<AuthGuard, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthGuard>;
}
