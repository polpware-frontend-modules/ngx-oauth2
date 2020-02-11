/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/auth-guard.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    AuthGuard.prototype.canActivate = /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    function (route, state) {
        /** @type {?} */
        var url = state.url;
        return this.checkLogin(url);
    };
    /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    AuthGuard.prototype.canActivateChild = /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    function (route, state) {
        return this.canActivate(route, state);
    };
    /**
     * @param {?} route
     * @return {?}
     */
    AuthGuard.prototype.canLoad = /**
     * @param {?} route
     * @return {?}
     */
    function (route) {
        /** @type {?} */
        var url = "/" + route.path;
        return this.checkLogin(url);
    };
    /**
     * @param {?} url
     * @return {?}
     */
    AuthGuard.prototype.checkLogin = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        if (this.authService.isLoggedIn) {
            return true;
        }
        this.authService.loginRedirectUrl = url;
        this.router.navigate(['/login']);
        return false;
    };
    AuthGuard.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    AuthGuard.ctorParameters = function () { return [
        { type: AuthService },
        { type: Router }
    ]; };
    return AuthGuard;
}());
export { AuthGuard };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AuthGuard.prototype.authService;
    /**
     * @type {?}
     * @private
     */
    AuthGuard.prototype.router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1ndWFyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYXV0aC1ndWFyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFlLE1BQU0sRUFBbUcsTUFBTSxpQkFBaUIsQ0FBQztBQUN2SixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHN0M7SUFFSSxtQkFBb0IsV0FBd0IsRUFBVSxNQUFjO1FBQWhELGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFJLENBQUM7Ozs7OztJQUV6RSwrQkFBVzs7Ozs7SUFBWCxVQUFZLEtBQTZCLEVBQUUsS0FBMEI7O1lBRTNELEdBQUcsR0FBVyxLQUFLLENBQUMsR0FBRztRQUM3QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7Ozs7O0lBRUQsb0NBQWdCOzs7OztJQUFoQixVQUFpQixLQUE2QixFQUFFLEtBQTBCO1FBQ3RFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7Ozs7SUFFRCwyQkFBTzs7OztJQUFQLFVBQVEsS0FBWTs7WUFFVixHQUFHLEdBQUcsTUFBSSxLQUFLLENBQUMsSUFBTTtRQUM1QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7Ozs7SUFFRCw4QkFBVTs7OztJQUFWLFVBQVcsR0FBVztRQUVsQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO1lBQzdCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFakMsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7Z0JBOUJKLFVBQVU7Ozs7Z0JBSEYsV0FBVztnQkFERSxNQUFNOztJQW1DNUIsZ0JBQUM7Q0FBQSxBQS9CRCxJQStCQztTQTlCWSxTQUFTOzs7Ozs7SUFDTixnQ0FBZ0M7Ozs7O0lBQUUsMkJBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVtYWlsOiBpbmZvQGViZW5tb25uZXkuY29tXG4vLyB3d3cuZWJlbm1vbm5leS5jb20vdGVtcGxhdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYW5BY3RpdmF0ZSwgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZXJTdGF0ZVNuYXBzaG90LCBDYW5BY3RpdmF0ZUNoaWxkLCBOYXZpZ2F0aW9uRXh0cmFzLCBDYW5Mb2FkLCBSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUsIENhbkFjdGl2YXRlQ2hpbGQsIENhbkxvYWQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7IH1cblxuICAgIGNhbkFjdGl2YXRlKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IHVybDogc3RyaW5nID0gc3RhdGUudXJsO1xuICAgICAgICByZXR1cm4gdGhpcy5jaGVja0xvZ2luKHVybCk7XG4gICAgfVxuXG4gICAgY2FuQWN0aXZhdGVDaGlsZChyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FuQWN0aXZhdGUocm91dGUsIHN0YXRlKTtcbiAgICB9XG5cbiAgICBjYW5Mb2FkKHJvdXRlOiBSb3V0ZSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IHVybCA9IGAvJHtyb3V0ZS5wYXRofWA7XG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrTG9naW4odXJsKTtcbiAgICB9XG5cbiAgICBjaGVja0xvZ2luKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0aFNlcnZpY2UuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLmxvZ2luUmVkaXJlY3RVcmwgPSB1cmw7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL2xvZ2luJ10pO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4iXX0=