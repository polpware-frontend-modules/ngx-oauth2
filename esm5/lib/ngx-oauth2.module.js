import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OidcHelperService } from './services/oidc-helper.service';
import { AuthService } from './services/auth.service';
import { JwtHelper } from './services/jwt-helper';
import { AuthGuard } from './services/auth-guard.service';
import * as i0 from "@angular/core";
var NgxOauth2Module = /** @class */ (function () {
    function NgxOauth2Module() {
    }
    /** @nocollapse */ NgxOauth2Module.ɵmod = i0.ɵɵdefineNgModule({ type: NgxOauth2Module });
    /** @nocollapse */ NgxOauth2Module.ɵinj = i0.ɵɵdefineInjector({ factory: function NgxOauth2Module_Factory(t) { return new (t || NgxOauth2Module)(); }, providers: [
            OidcHelperService,
            AuthService,
            JwtHelper,
            AuthGuard
        ], imports: [[
                OAuthModule,
            ]] });
    return NgxOauth2Module;
}());
export { NgxOauth2Module };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgxOauth2Module, { imports: [OAuthModule] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxOauth2Module, [{
        type: NgModule,
        args: [{
                declarations: [],
                imports: [
                    OAuthModule,
                ],
                exports: [],
                providers: [
                    OidcHelperService,
                    AuthService,
                    JwtHelper,
                    AuthGuard
                ]
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW9hdXRoMi5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvbmd4LW9hdXRoMi8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtb2F1dGgyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxXQUFXLEVBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFFaEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDbkUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBRzFEO0lBQUE7S0FhZ0M7MEVBQW5CLGVBQWU7b0lBQWYsZUFBZSxtQkFQYjtZQUNQLGlCQUFpQjtZQUNqQixXQUFXO1lBQ1gsU0FBUztZQUNULFNBQVM7U0FDWixZQVRRO2dCQUNMLFdBQVc7YUFDZDswQkFkTDtDQXVCZ0MsQUFiaEMsSUFhZ0M7U0FBbkIsZUFBZTt3RkFBZixlQUFlLGNBVnBCLFdBQVc7a0RBVU4sZUFBZTtjQWIzQixRQUFRO2VBQUM7Z0JBQ04sWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRTtvQkFDTCxXQUFXO2lCQUNkO2dCQUNELE9BQU8sRUFBRSxFQUFFO2dCQUNYLFNBQVMsRUFBRTtvQkFDUCxpQkFBaUI7b0JBQ2pCLFdBQVc7b0JBQ1gsU0FBUztvQkFDVCxTQUFTO2lCQUNaO2FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPQXV0aE1vZHVsZSwgT0F1dGhTdG9yYWdlIH0gZnJvbSAnYW5ndWxhci1vYXV0aDItb2lkYyc7XG5cbmltcG9ydCB7IE9pZGNIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9vaWRjLWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9qd3QtaGVscGVyJztcbmltcG9ydCB7IEF1dGhHdWFyZCB9IGZyb20gJy4vc2VydmljZXMvYXV0aC1ndWFyZC5zZXJ2aWNlJztcblxuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW10sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBPQXV0aE1vZHVsZSxcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBPaWRjSGVscGVyU2VydmljZSxcbiAgICAgICAgQXV0aFNlcnZpY2UsXG4gICAgICAgIEp3dEhlbHBlcixcbiAgICAgICAgQXV0aEd1YXJkXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hPYXV0aDJNb2R1bGUgeyB9XG4iXX0=