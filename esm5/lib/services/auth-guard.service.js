import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./auth.service";
var AuthGuard = /** @class */ (function () {
    function AuthGuard(_authService) {
        this._authService = _authService;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    AuthGuard.prototype.canLoad = function (route) {
        var url = "/" + route.path;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        if (this._authService.isLoggedIn) {
            return true;
        }
        this._authService.redirectForLogin();
        return false;
    };
    /** @nocollapse */ AuthGuard.ɵfac = function AuthGuard_Factory(t) { return new (t || AuthGuard)(i0.ɵɵinject(i1.AuthService)); };
    /** @nocollapse */ AuthGuard.ɵprov = i0.ɵɵdefineInjectable({ token: AuthGuard, factory: AuthGuard.ɵfac, providedIn: 'root' });
    return AuthGuard;
}());
export { AuthGuard };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthGuard, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.AuthService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1ndWFyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC1ndWFyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUkzQztJQUtJLG1CQUE2QixZQUF5QjtRQUF6QixpQkFBWSxHQUFaLFlBQVksQ0FBYTtJQUFJLENBQUM7SUFFM0QsK0JBQVcsR0FBWCxVQUFZLEtBQTZCLEVBQUUsS0FBMEI7UUFFakUsSUFBTSxHQUFHLEdBQVcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELG9DQUFnQixHQUFoQixVQUFpQixLQUE2QixFQUFFLEtBQTBCO1FBQ3RFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELDJCQUFPLEdBQVAsVUFBUSxLQUFZO1FBRWhCLElBQU0sR0FBRyxHQUFHLE1BQUksS0FBSyxDQUFDLElBQU0sQ0FBQztRQUM3QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELDhCQUFVLEdBQVYsVUFBVyxHQUFXO1FBRWxCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNyQyxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO3lGQTVCUSxTQUFTO3dFQUFULFNBQVMsV0FBVCxTQUFTLG1CQUZOLE1BQU07b0JBTnRCO0NBcUNDLEFBaENELElBZ0NDO1NBN0JZLFNBQVM7a0RBQVQsU0FBUztjQUhyQixVQUFVO2VBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIENhbkFjdGl2YXRlLCBDYW5BY3RpdmF0ZUNoaWxkLCBDYW5Mb2FkLCBSb3V0ZSwgUm91dGVyU3RhdGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBdXRoR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSwgQ2FuQWN0aXZhdGVDaGlsZCwgQ2FuTG9hZCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9hdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHsgfVxuXG4gICAgY2FuQWN0aXZhdGUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgdXJsOiBzdHJpbmcgPSBzdGF0ZS51cmw7XG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrTG9naW4odXJsKTtcbiAgICB9XG5cbiAgICBjYW5BY3RpdmF0ZUNoaWxkKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5BY3RpdmF0ZShyb3V0ZSwgc3RhdGUpO1xuICAgIH1cblxuICAgIGNhbkxvYWQocm91dGU6IFJvdXRlKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgdXJsID0gYC8ke3JvdXRlLnBhdGh9YDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tMb2dpbih1cmwpO1xuICAgIH1cblxuICAgIGNoZWNrTG9naW4odXJsOiBzdHJpbmcpOiBib29sZWFuIHtcblxuICAgICAgICBpZiAodGhpcy5fYXV0aFNlcnZpY2UuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9hdXRoU2VydmljZS5yZWRpcmVjdEZvckxvZ2luKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4iXX0=