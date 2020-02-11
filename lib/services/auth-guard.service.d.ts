import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, Route } from '@angular/router';
import { AuthService } from './auth.service';
export declare class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    private authService;
    private router;
    constructor(authService: AuthService, router: Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    canLoad(route: Route): boolean;
    checkLogin(url: string): boolean;
}
