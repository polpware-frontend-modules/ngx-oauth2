import { HttpHeaders } from '@angular/common/http';
import { from, Subject, throwError } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
var EndpointBase = /** @class */ (function () {
    function EndpointBase(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    EndpointBase.prototype.refreshLogin = function () {
        var _this = this;
        return this.authService.refreshLogin().pipe(catchError(function (error) {
            return _this.handleError(error, function () { return _this.refreshLogin(); });
        }));
    };
    Object.defineProperty(EndpointBase.prototype, "requestHeaders", {
        get: function () {
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
    EndpointBase.prototype.handleError = function (error, continuation) {
        var _this = this;
        // If the error is about authentication. 
        if (error.status == 401) {
            // Pause if the refreshing is in progress. 
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            // Try to refresh to see if we can rescue 
            this.isRefreshingLogin = true;
            return from(this.authService.refreshLogin())
                .pipe(mergeMap(function () {
                _this.isRefreshingLogin = false;
                // Run the resumed tasks 
                _this.resumeTasks(true);
                // Continue to run the paused 
                return continuation();
            }), catchError(function (refreshLoginError) {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(false);
                // Logout and notify others of the changes 
                _this.authService.logout();
                if (refreshLoginError.status == 401 ||
                    (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
                    return throwError('session expired');
                }
                else {
                    return throwError("unknown refresh error (" + (refreshLoginError || 'server error') + ")");
                }
            }));
        }
        if (error.error && error.error.error == 'invalid_grant') {
            // Logout 
            this.authService.logout();
            return throwError((error.error && error.error.error_description) ?
                "session expired (" + error.error.error_description + ")" : 'session expired');
        }
        else {
            return throwError(error);
        }
    };
    EndpointBase.prototype.pauseTask = function (continuation) {
        if (!this.taskPauser) {
            this.taskPauser = new Subject();
        }
        return this.taskPauser.pipe(switchMap(function (continueOp) {
            return continueOp ? continuation() : throwError('session expired');
        }));
    };
    EndpointBase.prototype.resumeTasks = function (continueOp) {
        var _this = this;
        setTimeout(function () {
            if (_this.taskPauser) {
                _this.taskPauser.next(continueOp);
                _this.taskPauser.complete();
                _this.taskPauser = null;
            }
        });
    };
    return EndpointBase;
}());
export { EndpointBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kcG9pbnQtYmFzZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvZW5kcG9pbnQtYmFzZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsSUFBSSxFQUFjLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHakU7SUFLSSxzQkFDYyxJQUFnQixFQUNsQixXQUF3QjtRQUR0QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2xCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQ3BDLENBQUM7SUFFTSxtQ0FBWSxHQUFuQjtRQUFBLGlCQUtDO1FBSkcsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FDdkMsVUFBVSxDQUFDLFVBQUEsS0FBSztZQUNaLE9BQU8sS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxZQUFZLEVBQUUsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWixDQUFDO0lBRUQsc0JBQWMsd0NBQWM7YUFBNUI7WUFDSSxJQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQztnQkFDNUIsYUFBYSxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVc7Z0JBQ3ZELGNBQWMsRUFBRSxrQkFBa0I7Z0JBQ2xDLE1BQU0sRUFBRSxtQ0FBbUM7YUFDOUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxFQUFFLE9BQU8sU0FBQSxFQUFFLENBQUM7UUFDdkIsQ0FBQzs7O09BQUE7SUFFUyxrQ0FBVyxH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Q1AsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQyxBQXpGRCxJQXlGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgZnJvbSwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWVyZ2VNYXAsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgRW5kcG9pbnRCYXNlIHtcblxuICAgIHByaXZhdGUgdGFza1BhdXNlcjogU3ViamVjdDxhbnk+O1xuICAgIHByaXZhdGUgaXNSZWZyZXNoaW5nTG9naW46IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFNlcnZpY2UucmVmcmVzaExvZ2luKCkucGlwZShcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCAoKSA9PiB0aGlzLnJlZnJlc2hMb2dpbigpKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IHJlcXVlc3RIZWFkZXJzKCk6IHsgaGVhZGVyczogSHR0cEhlYWRlcnMgfCB7IFtoZWFkZXI6IHN0cmluZ106IHN0cmluZyB8IHN0cmluZ1tdOyB9IH0ge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRoaXMuYXV0aFNlcnZpY2UuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4geyBoZWFkZXJzIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKGVycm9yLCBjb250aW51YXRpb246ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICAgICAgICAvLyBJZiB0aGUgZXJyb3IgaXMgYWJvdXQgYXV0aGVudGljYXRpb24uIFxuICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgLy8gUGF1c2UgaWYgdGhlIHJlZnJlc2hpbmcgaXMgaW4gcHJvZ3Jlc3MuIFxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSZWZyZXNoaW5nTG9naW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXVzZVRhc2soY29udGludWF0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHJ5IHRvIHJlZnJlc2ggdG8gc2VlIGlmIHdlIGNhbiByZXNjdWUgXG4gICAgICAgICAgICB0aGlzLmlzUmVmcmVzaGluZ0xvZ2luID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmcm9tKHRoaXMuYXV0aFNlcnZpY2UucmVmcmVzaExvZ2luKCkpXG4gICAgICAgICAgICAgICAgLnBpcGUobWVyZ2VNYXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVmcmVzaGluZ0xvZ2luID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB0aGUgcmVzdW1lZCB0YXNrcyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXNrcyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udGludWUgdG8gcnVuIHRoZSBwYXVzZWQgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250aW51YXRpb24oKTtcbiAgICAgICAgICAgICAgICB9KSwgY2F0Y2hFcnJvcihyZWZyZXNoTG9naW5FcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWZyZXNoaW5nTG9naW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXNrcyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIExvZ291dCBhbmQgbm90aWZ5IG90aGVycyBvZiB0aGUgY2hhbmdlcyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaExvZ2luRXJyb3Iuc3RhdHVzID09IDQwMSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlZnJlc2hMb2dpbkVycm9yLmVycm9yICYmIHJlZnJlc2hMb2dpbkVycm9yLmVycm9yLmVycm9yID09ICdpbnZhbGlkX2dyYW50JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdzZXNzaW9uIGV4cGlyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGB1bmtub3duIHJlZnJlc2ggZXJyb3IgKCR7cmVmcmVzaExvZ2luRXJyb3IgfHwgJ3NlcnZlciBlcnJvcid9KWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yLmVycm9yICYmIGVycm9yLmVycm9yLmVycm9yID09ICdpbnZhbGlkX2dyYW50Jykge1xuICAgICAgICAgICAgLy8gTG9nb3V0IFxuICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKGVycm9yLmVycm9yICYmIGVycm9yLmVycm9yLmVycm9yX2Rlc2NyaXB0aW9uKSA/XG4gICAgICAgICAgICAgICAgYHNlc3Npb24gZXhwaXJlZCAoJHtlcnJvci5lcnJvci5lcnJvcl9kZXNjcmlwdGlvbn0pYCA6ICdzZXNzaW9uIGV4cGlyZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcGF1c2VUYXNrKGNvbnRpbnVhdGlvbjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgICAgIGlmICghdGhpcy50YXNrUGF1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLnRhc2tQYXVzZXIgPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudGFza1BhdXNlci5waXBlKHN3aXRjaE1hcChjb250aW51ZU9wID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb250aW51ZU9wID8gY29udGludWF0aW9uKCkgOiB0aHJvd0Vycm9yKCdzZXNzaW9uIGV4cGlyZWQnKTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzdW1lVGFza3MoY29udGludWVPcDogYm9vbGVhbikge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhc2tQYXVzZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tQYXVzZXIubmV4dChjb250aW51ZU9wKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tQYXVzZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tQYXVzZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=