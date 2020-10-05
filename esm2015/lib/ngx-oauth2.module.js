import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OidcHelperService } from './services/oidc-helper.service';
import { AuthService } from './services/auth.service';
import { JwtHelper } from './services/jwt-helper';
import { AuthGuard } from './services/auth-guard.service';
import * as i0 from "@angular/core";
export class NgxOauth2Module {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW9hdXRoMi5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvbmd4LW9hdXRoMi8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtb2F1dGgyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxXQUFXLEVBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFFaEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDbkUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBZ0IxRCxNQUFNLE9BQU8sZUFBZTs7c0VBQWYsZUFBZTtnSUFBZixlQUFlLG1CQVBiO1FBQ1AsaUJBQWlCO1FBQ2pCLFdBQVc7UUFDWCxTQUFTO1FBQ1QsU0FBUztLQUNaLFlBVFE7WUFDTCxXQUFXO1NBQ2Q7d0ZBU1EsZUFBZSxjQVZwQixXQUFXO2tEQVVOLGVBQWU7Y0FiM0IsUUFBUTtlQUFDO2dCQUNOLFlBQVksRUFBRSxFQUFFO2dCQUNoQixPQUFPLEVBQUU7b0JBQ0wsV0FBVztpQkFDZDtnQkFDRCxPQUFPLEVBQUUsRUFBRTtnQkFDWCxTQUFTLEVBQUU7b0JBQ1AsaUJBQWlCO29CQUNqQixXQUFXO29CQUNYLFNBQVM7b0JBQ1QsU0FBUztpQkFDWjthQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0F1dGhNb2R1bGUsIE9BdXRoU3RvcmFnZSB9IGZyb20gJ2FuZ3VsYXItb2F1dGgyLW9pZGMnO1xuXG5pbXBvcnQgeyBPaWRjSGVscGVyU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvb2lkYy1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IEp3dEhlbHBlciB9IGZyb20gJy4vc2VydmljZXMvand0LWhlbHBlcic7XG5pbXBvcnQgeyBBdXRoR3VhcmQgfSBmcm9tICcuL3NlcnZpY2VzL2F1dGgtZ3VhcmQuc2VydmljZSc7XG5cblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgT0F1dGhNb2R1bGUsXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgT2lkY0hlbHBlclNlcnZpY2UsXG4gICAgICAgIEF1dGhTZXJ2aWNlLFxuICAgICAgICBKd3RIZWxwZXIsXG4gICAgICAgIEF1dGhHdWFyZFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4T2F1dGgyTW9kdWxlIHsgfVxuIl19