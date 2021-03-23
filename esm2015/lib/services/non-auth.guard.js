import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./auth.service";
export class NonAuthGuard {
    constructor(_authService) {
        this._authService = _authService;
    }
    canActivate(next, state) {
        return !this._authService.isLoggedIn;
    }
    canActivateChild(next, state) {
        return !this._authService.isLoggedIn;
    }
}
/** @nocollapse */ NonAuthGuard.ɵfac = function NonAuthGuard_Factory(t) { return new (t || NonAuthGuard)(i0.ɵɵinject(i1.AuthService)); };
/** @nocollapse */ NonAuthGuard.ɵprov = i0.ɵɵdefineInjectable({ token: NonAuthGuard, factory: NonAuthGuard.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NonAuthGuard, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.AuthService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9uLWF1dGguZ3VhcmQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvbmd4LW9hdXRoMi8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9ub24tYXV0aC5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFRM0MsTUFBTSxPQUFPLFlBQVk7SUFFckIsWUFBNkIsWUFBeUI7UUFBekIsaUJBQVksR0FBWixZQUFZLENBQWE7SUFBSSxDQUFDO0lBRTNELFdBQVcsQ0FDUCxJQUE0QixFQUM1QixLQUEwQjtRQUUxQixPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7SUFDekMsQ0FBQztJQUNELGdCQUFnQixDQUNaLElBQTRCLEVBQzVCLEtBQTBCO1FBRTFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztJQUN6QyxDQUFDOzsyRkFmUSxZQUFZO3VFQUFaLFlBQVksV0FBWixZQUFZLG1CQUZULE1BQU07a0RBRVQsWUFBWTtjQUh4QixVQUFVO2VBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYW5BY3RpdmF0ZSwgQ2FuQWN0aXZhdGVDaGlsZCwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdCwgVXJsVHJlZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOb25BdXRoR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSwgQ2FuQWN0aXZhdGVDaGlsZCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9hdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHsgfVxuXG4gICAgY2FuQWN0aXZhdGUoXG4gICAgICAgIG5leHQ6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsXG4gICAgICAgIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcblxuICAgICAgICByZXR1cm4gIXRoaXMuX2F1dGhTZXJ2aWNlLmlzTG9nZ2VkSW47XG4gICAgfVxuICAgIGNhbkFjdGl2YXRlQ2hpbGQoXG4gICAgICAgIG5leHQ6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsXG4gICAgICAgIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcblxuICAgICAgICByZXR1cm4gIXRoaXMuX2F1dGhTZXJ2aWNlLmlzTG9nZ2VkSW47XG4gICAgfVxufVxuIl19