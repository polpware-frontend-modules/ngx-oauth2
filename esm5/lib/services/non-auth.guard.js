import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./auth.service";
var NonAuthGuard = /** @class */ (function () {
    function NonAuthGuard(_authService) {
        this._authService = _authService;
    }
    NonAuthGuard.prototype.canActivate = function (next, state) {
        return this.checkNonLogin();
    };
    NonAuthGuard.prototype.canActivateChild = function (next, state) {
        return this.checkNonLogin();
    };
    NonAuthGuard.prototype.checkNonLogin = function () {
        if (this._authService.isLoggedIn) {
            this._authService.redirectLoginUser();
            return false;
        }
        return true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9uLWF1dGguZ3VhcmQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvbmd4LW9hdXRoMi8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9ub24tYXV0aC5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFLM0M7SUFLSSxzQkFBNkIsWUFBeUI7UUFBekIsaUJBQVksR0FBWixZQUFZLENBQWE7SUFBSSxDQUFDO0lBRTNELGtDQUFXLEdBQVgsVUFDSSxJQUE0QixFQUM1QixLQUEwQjtRQUUxQixPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsdUNBQWdCLEdBQWhCLFVBQ0ksSUFBNEIsRUFDNUIsS0FBMEI7UUFFMUIsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFFaEMsQ0FBQztJQUVELG9DQUFhLEdBQWI7UUFDSSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFO1lBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN0QyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBRWhCLENBQUM7K0ZBM0JRLFlBQVk7MkVBQVosWUFBWSxXQUFaLFlBQVksbUJBRlQsTUFBTTt1QkFOdEI7Q0FvQ0MsQUEvQkQsSUErQkM7U0E1QlksWUFBWTtrREFBWixZQUFZO2NBSHhCLFVBQVU7ZUFBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2FuQWN0aXZhdGUsIENhbkFjdGl2YXRlQ2hpbGQsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIFJvdXRlclN0YXRlU25hcHNob3QsIFVybFRyZWUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb25BdXRoR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSwgQ2FuQWN0aXZhdGVDaGlsZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7IH1cclxuXHJcbiAgICBjYW5BY3RpdmF0ZShcclxuICAgICAgICBuZXh0OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxyXG4gICAgICAgIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tOb25Mb2dpbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbkFjdGl2YXRlQ2hpbGQoXHJcbiAgICAgICAgbmV4dDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcclxuICAgICAgICBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHwgUHJvbWlzZTxib29sZWFuIHwgVXJsVHJlZT4gfCBib29sZWFuIHwgVXJsVHJlZSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrTm9uTG9naW4oKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tOb25Mb2dpbigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5fYXV0aFNlcnZpY2UuaXNMb2dnZWRJbikge1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRoU2VydmljZS5yZWRpcmVjdExvZ2luVXNlcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICB9XHJcbn1cclxuIl19