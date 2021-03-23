import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./auth.service";
export class AuthGuard {
    constructor(_authService) {
        this._authService = _authService;
    }
    canActivate(route, state) {
        const url = state.url;
        return this.checkLogin(url);
    }
    canActivateChild(route, state) {
        return this.canActivate(route, state);
    }
    canLoad(route) {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }
    checkLogin(url) {
        if (this._authService.isLoggedIn) {
            return true;
        }
        this._authService.redirectForLogin();
        return false;
    }
}
/** @nocollapse */ AuthGuard.ɵfac = function AuthGuard_Factory(t) { return new (t || AuthGuard)(i0.ɵɵinject(i1.AuthService)); };
/** @nocollapse */ AuthGuard.ɵprov = i0.ɵɵdefineInjectable({ token: AuthGuard, factory: AuthGuard.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AuthGuard, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.AuthService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1ndWFyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC1ndWFyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQU8zQyxNQUFNLE9BQU8sU0FBUztJQUVsQixZQUE2QixZQUF5QjtRQUF6QixpQkFBWSxHQUFaLFlBQVksQ0FBYTtJQUFJLENBQUM7SUFFM0QsV0FBVyxDQUFDLEtBQTZCLEVBQUUsS0FBMEI7UUFFakUsTUFBTSxHQUFHLEdBQVcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQTZCLEVBQUUsS0FBMEI7UUFDdEUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQVk7UUFFaEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxVQUFVLENBQUMsR0FBVztRQUVsQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDckMsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7cUZBNUJRLFNBQVM7b0VBQVQsU0FBUyxXQUFULFNBQVMsbUJBRk4sTUFBTTtrREFFVCxTQUFTO2NBSHJCLFVBQVU7ZUFBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgQ2FuQWN0aXZhdGUsIENhbkFjdGl2YXRlQ2hpbGQsIENhbkxvYWQsIFJvdXRlLCBSb3V0ZXJTdGF0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEF1dGhHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlLCBDYW5BY3RpdmF0ZUNoaWxkLCBDYW5Mb2FkIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX2F1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkgeyB9XG5cbiAgICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBib29sZWFuIHtcblxuICAgICAgICBjb25zdCB1cmw6IHN0cmluZyA9IHN0YXRlLnVybDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tMb2dpbih1cmwpO1xuICAgIH1cblxuICAgIGNhbkFjdGl2YXRlQ2hpbGQocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbkFjdGl2YXRlKHJvdXRlLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgY2FuTG9hZChyb3V0ZTogUm91dGUpOiBib29sZWFuIHtcblxuICAgICAgICBjb25zdCB1cmwgPSBgLyR7cm91dGUucGF0aH1gO1xuICAgICAgICByZXR1cm4gdGhpcy5jaGVja0xvZ2luKHVybCk7XG4gICAgfVxuXG4gICAgY2hlY2tMb2dpbih1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGlmICh0aGlzLl9hdXRoU2VydmljZS5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2F1dGhTZXJ2aWNlLnJlZGlyZWN0Rm9yTG9naW4oKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==