import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./auth.service";
var NonAuthGuard = /** @class */ (function () {
    function NonAuthGuard(_authService) {
        this._authService = _authService;
    }
    NonAuthGuard.prototype.canActivate = function (next, state) {
        return !this._authService.isLoggedIn;
    };
    NonAuthGuard.prototype.canActivateChild = function (next, state) {
        return !this._authService.isLoggedIn;
    };
    /** @nocollapse */ NonAuthGuard.ɵfac = function NonAuthGuard_Factory(t) { return new (t || NonAuthGuard)(i0.ɵɵinject(i1.AuthService)); };
    /** @nocollapse */ NonAuthGuard.ɵprov = i0.ɵɵdefineInjectable({ token: NonAuthGuard, factory: NonAuthGuard.ɵfac, providedIn: 'root' });
    return NonAuthGuard;
}());
export { NonAuthGuard };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NonAuthGuard, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.AuthService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9uLWF1dGguZ3VhcmQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvbmd4LW9hdXRoMi8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9ub24tYXV0aC5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFLM0M7SUFLSSxzQkFBNkIsWUFBeUI7UUFBekIsaUJBQVksR0FBWixZQUFZLENBQWE7SUFBSSxDQUFDO0lBRTNELGtDQUFXLEdBQVgsVUFDSSxJQUE0QixFQUM1QixLQUEwQjtRQUUxQixPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7SUFDekMsQ0FBQztJQUNELHVDQUFnQixHQUFoQixVQUNJLElBQTRCLEVBQzVCLEtBQTBCO1FBRTFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztJQUN6QyxDQUFDOytGQWZRLFlBQVk7MkVBQVosWUFBWSxXQUFaLFlBQVksbUJBRlQsTUFBTTt1QkFOdEI7Q0F3QkMsQUFuQkQsSUFtQkM7U0FoQlksWUFBWTtrREFBWixZQUFZO2NBSHhCLFVBQVU7ZUFBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhbkFjdGl2YXRlLCBDYW5BY3RpdmF0ZUNoaWxkLCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZXJTdGF0ZVNuYXBzaG90LCBVcmxUcmVlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5vbkF1dGhHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlLCBDYW5BY3RpdmF0ZUNoaWxkIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX2F1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkgeyB9XG5cbiAgICBjYW5BY3RpdmF0ZShcbiAgICAgICAgbmV4dDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcbiAgICAgICAgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IFByb21pc2U8Ym9vbGVhbiB8IFVybFRyZWU+IHwgYm9vbGVhbiB8IFVybFRyZWUge1xuXG4gICAgICAgIHJldHVybiAhdGhpcy5fYXV0aFNlcnZpY2UuaXNMb2dnZWRJbjtcbiAgICB9XG4gICAgY2FuQWN0aXZhdGVDaGlsZChcbiAgICAgICAgbmV4dDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcbiAgICAgICAgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IFByb21pc2U8Ym9vbGVhbiB8IFVybFRyZWU+IHwgYm9vbGVhbiB8IFVybFRyZWUge1xuXG4gICAgICAgIHJldHVybiAhdGhpcy5fYXV0aFNlcnZpY2UuaXNMb2dnZWRJbjtcbiAgICB9XG59XG4iXX0=