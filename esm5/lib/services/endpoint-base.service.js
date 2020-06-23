/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/endpoint-base.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
import { HttpHeaders } from '@angular/common/http';
import { Subject, from, throwError } from 'rxjs';
import { mergeMap, switchMap, catchError } from 'rxjs/operators';
var EndpointBase = /** @class */ (function () {
    function EndpointBase(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    Object.defineProperty(EndpointBase.prototype, "requestHeaders", {
        get: /**
         * @protected
         * @return {?}
         */
        function () {
            /** @type {?} */
            var headers = new HttpHeaders({
                Authorization: 'Bearer ' + this.authService.accessToken,
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*'
            });
            return { headers: headers };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EndpointBase.prototype.refreshLogin = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.authService.refreshLogin().pipe(catchError((/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            return _this.handleError(error, (/**
             * @return {?}
             */
            function () { return _this.refreshLogin(); }));
        })));
    };
    /**
     * @protected
     * @param {?} error
     * @param {?} continuation
     * @return {?}
     */
    EndpointBase.prototype.handleError = /**
     * @protected
     * @param {?} error
     * @param {?} continuation
     * @return {?}
     */
    function (error, continuation) {
        var _this = this;
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            this.isRefreshingLogin = true;
            return from(this.authService.refreshLogin()).pipe(mergeMap((/**
             * @return {?}
             */
            function () {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(true);
                return continuation();
            })), catchError((/**
             * @param {?} refreshLoginError
             * @return {?}
             */
            function (refreshLoginError) {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(false);
                _this.authService.reLogin();
                if (refreshLoginError.status == 401 || (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
                    return throwError('session expired');
                }
                else {
                    return throwError("unknown refresh error (" + (refreshLoginError || 'server error') + ")");
                }
            })));
        }
        if (error.error && error.error.error == 'invalid_grant') {
            this.authService.reLogin();
            return throwError((error.error && error.error.error_description) ? "session expired (" + error.error.error_description + ")" : 'session expired');
        }
        else {
            return throwError(error);
        }
    };
    /**
     * @private
     * @param {?} continuation
     * @return {?}
     */
    EndpointBase.prototype.pauseTask = /**
     * @private
     * @param {?} continuation
     * @return {?}
     */
    function (continuation) {
        if (!this.taskPauser) {
            this.taskPauser = new Subject();
        }
        return this.taskPauser.pipe(switchMap((/**
         * @param {?} continueOp
         * @return {?}
         */
        function (continueOp) {
            return continueOp ? continuation() : throwError('session expired');
        })));
    };
    /**
     * @private
     * @param {?} continueOp
     * @return {?}
     */
    EndpointBase.prototype.resumeTasks = /**
     * @private
     * @param {?} continueOp
     * @return {?}
     */
    function (continueOp) {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () {
            if (_this.taskPauser) {
                _this.taskPauser.next(continueOp);
                _this.taskPauser.complete();
                _this.taskPauser = null;
            }
        }));
    };
    return EndpointBase;
}());
export { EndpointBase };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EndpointBase.prototype.taskPauser;
    /**
     * @type {?}
     * @private
     */
    EndpointBase.prototype.isRefreshingLogin;
    /**
     * @type {?}
     * @protected
     */
    EndpointBase.prototype.http;
    /**
     * @type {?}
     * @private
     */
    EndpointBase.prototype.authService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kcG9pbnQtYmFzZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvZW5kcG9pbnQtYmFzZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU1BLE9BQU8sRUFBYyxXQUFXLEVBQWMsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQWMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakU7SUFLSSxzQkFDYyxJQUFnQixFQUNsQixXQUF3QjtRQUR0QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2xCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBRXBDLENBQUM7SUFFRCxzQkFBYyx3Q0FBYzs7Ozs7UUFBNUI7O2dCQUNVLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQztnQkFDNUIsYUFBYSxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVc7Z0JBQ3ZELGNBQWMsRUFBRSxrQkFBa0I7Z0JBQ2xDLE1BQU0sRUFBRSxtQ0FBbUM7YUFDOUMsQ0FBQztZQUVGLE9BQU8sRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7OztPQUFBOzs7O0lBRU0sbUNBQVk7OztJQUFuQjtRQUFBLGlCQUtDO1FBSkcsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FDdkMsVUFBVTs7OztRQUFDLFVBQUEsS0FBSztZQUNaLE9BQU8sS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLOzs7WUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLFlBQVksRUFBRSxFQUFuQixDQUFtQixFQUFDLENBQUM7UUFDOUQsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUNaLENB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Ozs7OztJQXJGRyxrQ0FBaUM7Ozs7O0lBQ2pDLHlDQUFtQzs7Ozs7SUFHL0IsNEJBQTBCOzs7OztJQUMxQixtQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRW1haWw6IGluZm9AZWJlbm1vbm5leS5jb21cbi8vIHd3dy5lYmVubW9ubmV5LmNvbS90ZW1wbGF0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgZnJvbSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWVyZ2VNYXAsIHN3aXRjaE1hcCwgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBFbmRwb2ludEJhc2Uge1xuXG4gICAgcHJpdmF0ZSB0YXNrUGF1c2VyOiBTdWJqZWN0PGFueT47XG4gICAgcHJpdmF0ZSBpc1JlZnJlc2hpbmdMb2dpbjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHtcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgcmVxdWVzdEhlYWRlcnMoKTogeyBoZWFkZXJzOiBIdHRwSGVhZGVycyB8IHsgW2hlYWRlcjogc3RyaW5nXTogc3RyaW5nIHwgc3RyaW5nW107IH0gfSB7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdGhpcy5hdXRoU2VydmljZS5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7IGhlYWRlcnMgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVmcmVzaExvZ2luKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoU2VydmljZS5yZWZyZXNoTG9naW4oKS5waXBlKFxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsICgpID0+IHRoaXMucmVmcmVzaExvZ2luKCkpO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvciwgY29udGludWF0aW9uOiAoKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUmVmcmVzaGluZ0xvZ2luKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGF1c2VUYXNrKGNvbnRpbnVhdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNSZWZyZXNoaW5nTG9naW4gPSB0cnVlO1xuXG4gICAgICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmF1dGhTZXJ2aWNlLnJlZnJlc2hMb2dpbigpKS5waXBlKFxuICAgICAgICAgICAgICAgIG1lcmdlTWFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlZnJlc2hpbmdMb2dpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VtZVRhc2tzKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250aW51YXRpb24oKTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKHJlZnJlc2hMb2dpbkVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlZnJlc2hpbmdMb2dpbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VtZVRhc2tzKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5yZUxvZ2luKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hMb2dpbkVycm9yLnN0YXR1cyA9PSA0MDEgfHwgKHJlZnJlc2hMb2dpbkVycm9yLmVycm9yICYmIHJlZnJlc2hMb2dpbkVycm9yLmVycm9yLmVycm9yID09ICdpbnZhbGlkX2dyYW50JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdzZXNzaW9uIGV4cGlyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGB1bmtub3duIHJlZnJlc2ggZXJyb3IgKCR7cmVmcmVzaExvZ2luRXJyb3IgfHwgJ3NlcnZlciBlcnJvcid9KWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yLmVycm9yICYmIGVycm9yLmVycm9yLmVycm9yID09ICdpbnZhbGlkX2dyYW50Jykge1xuICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5yZUxvZ2luKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKChlcnJvci5lcnJvciAmJiBlcnJvci5lcnJvci5lcnJvcl9kZXNjcmlwdGlvbikgPyBgc2Vzc2lvbiBleHBpcmVkICgke2Vycm9yLmVycm9yLmVycm9yX2Rlc2NyaXB0aW9ufSlgIDogJ3Nlc3Npb24gZXhwaXJlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIHByaXZhdGUgcGF1c2VUYXNrKGNvbnRpbnVhdGlvbjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgICAgIGlmICghdGhpcy50YXNrUGF1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLnRhc2tQYXVzZXIgPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudGFza1BhdXNlci5waXBlKHN3aXRjaE1hcChjb250aW51ZU9wID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb250aW51ZU9wID8gY29udGludWF0aW9uKCkgOiB0aHJvd0Vycm9yKCdzZXNzaW9uIGV4cGlyZWQnKTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSByZXN1bWVUYXNrcyhjb250aW51ZU9wOiBib29sZWFuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudGFza1BhdXNlcikge1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1BhdXNlci5uZXh0KGNvbnRpbnVlT3ApO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1BhdXNlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1BhdXNlciA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==