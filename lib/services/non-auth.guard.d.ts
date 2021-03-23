import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as i0 from "@angular/core";
export declare class NonAuthGuard implements CanActivate, CanActivateChild {
    private readonly _authService;
    constructor(_authService: AuthService);
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
    static ɵfac: i0.ɵɵFactoryDef<NonAuthGuard, never>;
    static ɵprov: i0.ɵɵInjectableDef<NonAuthGuard>;
}
