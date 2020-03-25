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
export class EndpointBase {
    /**
     * @param {?} http
     * @param {?} authService
     */
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    /**
     * @protected
     * @return {?}
     */
    get requestHeaders() {
        /** @type {?} */
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.authService.accessToken,
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*'
        });
        return { headers };
    }
    /**
     * @return {?}
     */
    refreshLogin() {
        return this.authService.refreshLogin().pipe(catchError((/**
         * @param {?} error
         * @return {?}
         */
        error => {
            return this.handleError(error, (/**
             * @return {?}
             */
            () => this.refreshLogin()));
        })));
    }
    /**
     * @protected
     * @param {?} error
     * @param {?} continuation
     * @return {?}
     */
    handleError(error, continuation) {
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            this.isRefreshingLogin = true;
            return from(this.authService.refreshLogin()).pipe(mergeMap((/**
             * @return {?}
             */
            () => {
                this.isRefreshingLogin = false;
                this.resumeTasks(true);
                return continuation();
            })), catchError((/**
             * @param {?} refreshLoginError
             * @return {?}
             */
            refreshLoginError => {
                this.isRefreshingLogin = false;
                this.resumeTasks(false);
                this.authService.reLogin();
                if (refreshLoginError.status == 401 || (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
                    return throwError('session expired');
                }
                else {
                    return throwError(refreshLoginError || 'server error');
                }
            })));
        }
        if (error.error && error.error.error == 'invalid_grant') {
            this.authService.reLogin();
            return throwError((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
        }
        else {
            return throwError(error);
        }
    }
    /**
     * @private
     * @param {?} continuation
     * @return {?}
     */
    pauseTask(continuation) {
        if (!this.taskPauser) {
            this.taskPauser = new Subject();
        }
        return this.taskPauser.pipe(switchMap((/**
         * @param {?} continueOp
         * @return {?}
         */
        continueOp => {
            return continueOp ? continuation() : throwError('session expired');
        })));
    }
    /**
     * @private
     * @param {?} continueOp
     * @return {?}
     */
    resumeTasks(continueOp) {
        setTimeout((/**
         * @return {?}
         */
        () => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        }));
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kcG9pbnQtYmFzZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvZW5kcG9pbnQtYmFzZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU1BLE9BQU8sRUFBYyxXQUFXLEVBQWMsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQWMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakUsTUFBTSxPQUFPLFlBQVk7Ozs7O0lBS3JCLFlBQ2MsSUFBZ0IsRUFDbEIsV0FBd0I7UUFEdEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNsQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUVwQyxDQUFDOzs7OztJQUVELElBQWMsY0FBYzs7Y0FDbEIsT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDO1lBQzVCLGFBQWEsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXO1lBQ3ZELGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsTUFBTSxFQUFFLG1DQUFtQztTQUM5QyxDQUFDO1FBRUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Ozs7SUFFTSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FDdkMsVUFBVTs7OztRQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUs7OztZQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBQyxDQUFDO1FBQzlELENBQUMsRUFBQyxDQUFDLENBQUM7SUFDWixDQUFDOzs7Ozs7O0lBRVMsV0FBVyxDQUFDLEtB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PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVtYWlsOiBpbmZvQGViZW5tb25uZXkuY29tXG4vLyB3d3cuZWJlbm1vbm5leS5jb20vdGVtcGxhdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIGZyb20sIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1lcmdlTWFwLCBzd2l0Y2hNYXAsIGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgRW5kcG9pbnRCYXNlIHtcblxuICAgIHByaXZhdGUgdGFza1BhdXNlcjogU3ViamVjdDxhbnk+O1xuICAgIHByaXZhdGUgaXNSZWZyZXNoaW5nTG9naW46IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IHJlcXVlc3RIZWFkZXJzKCk6IHsgaGVhZGVyczogSHR0cEhlYWRlcnMgfCB7IFtoZWFkZXI6IHN0cmluZ106IHN0cmluZyB8IHN0cmluZ1tdOyB9IH0ge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRoaXMuYXV0aFNlcnZpY2UuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4geyBoZWFkZXJzIH07XG4gICAgfVxuXG4gICAgcHVibGljIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFNlcnZpY2UucmVmcmVzaExvZ2luKCkucGlwZShcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCAoKSA9PiB0aGlzLnJlZnJlc2hMb2dpbigpKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaGFuZGxlRXJyb3IoZXJyb3IsIGNvbnRpbnVhdGlvbjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT0gNDAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1JlZnJlc2hpbmdMb2dpbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhdXNlVGFzayhjb250aW51YXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlzUmVmcmVzaGluZ0xvZ2luID0gdHJ1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hdXRoU2VydmljZS5yZWZyZXNoTG9naW4oKSkucGlwZShcbiAgICAgICAgICAgICAgICBtZXJnZU1hcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWZyZXNoaW5nTG9naW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXNrcyh0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGludWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihyZWZyZXNoTG9naW5FcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWZyZXNoaW5nTG9naW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXNrcyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UucmVMb2dpbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoTG9naW5FcnJvci5zdGF0dXMgPT0gNDAxIHx8IChyZWZyZXNoTG9naW5FcnJvci5lcnJvciAmJiByZWZyZXNoTG9naW5FcnJvci5lcnJvci5lcnJvciA9PSAnaW52YWxpZF9ncmFudCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcignc2Vzc2lvbiBleHBpcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihyZWZyZXNoTG9naW5FcnJvciB8fCAnc2VydmVyIGVycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IuZXJyb3IgJiYgZXJyb3IuZXJyb3IuZXJyb3IgPT0gJ2ludmFsaWRfZ3JhbnQnKSB7XG4gICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLnJlTG9naW4oKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKGVycm9yLmVycm9yICYmIGVycm9yLmVycm9yLmVycm9yX2Rlc2NyaXB0aW9uKSA/IGBzZXNzaW9uIGV4cGlyZWQgKCR7ZXJyb3IuZXJyb3IuZXJyb3JfZGVzY3JpcHRpb259KWAgOiAnc2Vzc2lvbiBleHBpcmVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgcHJpdmF0ZSBwYXVzZVRhc2soY29udGludWF0aW9uOiAoKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICAgICAgaWYgKCF0aGlzLnRhc2tQYXVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMudGFza1BhdXNlciA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy50YXNrUGF1c2VyLnBpcGUoc3dpdGNoTWFwKGNvbnRpbnVlT3AgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRpbnVlT3AgPyBjb250aW51YXRpb24oKSA6IHRocm93RXJyb3IoJ3Nlc3Npb24gZXhwaXJlZCcpO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHJlc3VtZVRhc2tzKGNvbnRpbnVlT3A6IGJvb2xlYW4pIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy50YXNrUGF1c2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrUGF1c2VyLm5leHQoY29udGludWVPcCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrUGF1c2VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrUGF1c2VyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19