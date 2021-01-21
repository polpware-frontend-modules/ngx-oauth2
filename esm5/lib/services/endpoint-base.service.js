import { HttpHeaders } from '@angular/common/http';
import { from, Subject, throwError } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
var EndpointBase = /** @class */ (function () {
    function EndpointBase(http, authService) {
        this.http = http;
        this.authService = authService;
    }
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
    EndpointBase.prototype.refreshLogin = function () {
        var _this = this;
        return this.authService.refreshLogin().pipe(catchError(function (error) {
            return _this.handleError(error, function () { return _this.refreshLogin(); });
        }));
    };
    EndpointBase.prototype.handleError = function (error, continuation) {
        var _this = this;
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }
            this.isRefreshingLogin = true;
            return from(this.authService.refreshLogin()).pipe(mergeMap(function () {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(true);
                return continuation();
            }), catchError(function (refreshLoginError) {
                _this.isRefreshingLogin = false;
                _this.resumeTasks(false);
                _this.authService.reLogin();
                if (refreshLoginError.status == 401 || (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
                    return throwError('session expired');
                }
                else {
                    return throwError("unknown refresh error (" + (refreshLoginError || 'server error') + ")");
                }
            }));
        }
        if (error.error && error.error.error == 'invalid_grant') {
            this.authService.reLogin();
            return throwError((error.error && error.error.error_description) ? "session expired (" + error.error.error_description + ")" : 'session expired');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kcG9pbnQtYmFzZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHBvbHB3YXJlL25neC1vYXV0aDIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvZW5kcG9pbnQtYmFzZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsSUFBSSxFQUFjLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHakU7SUFLSSxzQkFDYyxJQUFnQixFQUNsQixXQUF3QjtRQUR0QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2xCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBRXBDLENBQUM7SUFFRCxzQkFBYyx3Q0FBYzthQUE1QjtZQUNJLElBQU0sT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDO2dCQUM1QixhQUFhLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVztnQkFDdkQsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsTUFBTSxFQUFFLG1DQUFtQzthQUM5QyxDQUFDLENBQUM7WUFFSCxPQUFPLEVBQUUsT0FBTyxTQUFBLEVBQUUsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVNLG1DQUFZLEdBQW5CO1FBQUEsaUJBS0M7UUFKRyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUN2QyxVQUFVLENBQUMsVUFBQSxLQUFLO1lBQ1osT0FBTyxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLFlBQVksRUFBRSxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFUyxrQ0FBVyxH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ZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgZnJvbSwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWVyZ2VNYXAsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgRW5kcG9pbnRCYXNlIHtcblxuICAgIHByaXZhdGUgdGFza1BhdXNlcjogU3ViamVjdDxhbnk+O1xuICAgIHByaXZhdGUgaXNSZWZyZXNoaW5nTG9naW46IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IHJlcXVlc3RIZWFkZXJzKCk6IHsgaGVhZGVyczogSHR0cEhlYWRlcnMgfCB7IFtoZWFkZXI6IHN0cmluZ106IHN0cmluZyB8IHN0cmluZ1tdOyB9IH0ge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRoaXMuYXV0aFNlcnZpY2UuYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4geyBoZWFkZXJzIH07XG4gICAgfVxuXG4gICAgcHVibGljIHJlZnJlc2hMb2dpbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFNlcnZpY2UucmVmcmVzaExvZ2luKCkucGlwZShcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCAoKSA9PiB0aGlzLnJlZnJlc2hMb2dpbigpKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaGFuZGxlRXJyb3IoZXJyb3IsIGNvbnRpbnVhdGlvbjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT0gNDAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1JlZnJlc2hpbmdMb2dpbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhdXNlVGFzayhjb250aW51YXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlzUmVmcmVzaGluZ0xvZ2luID0gdHJ1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hdXRoU2VydmljZS5yZWZyZXNoTG9naW4oKSkucGlwZShcbiAgICAgICAgICAgICAgICBtZXJnZU1hcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWZyZXNoaW5nTG9naW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXNrcyh0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGludWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihyZWZyZXNoTG9naW5FcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWZyZXNoaW5nTG9naW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXNrcyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UucmVMb2dpbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoTG9naW5FcnJvci5zdGF0dXMgPT0gNDAxIHx8IChyZWZyZXNoTG9naW5FcnJvci5lcnJvciAmJiByZWZyZXNoTG9naW5FcnJvci5lcnJvci5lcnJvciA9PSAnaW52YWxpZF9ncmFudCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcignc2Vzc2lvbiBleHBpcmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihgdW5rbm93biByZWZyZXNoIGVycm9yICgke3JlZnJlc2hMb2dpbkVycm9yIHx8ICdzZXJ2ZXIgZXJyb3InfSlgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvci5lcnJvciAmJiBlcnJvci5lcnJvci5lcnJvciA9PSAnaW52YWxpZF9ncmFudCcpIHtcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UucmVMb2dpbigpO1xuICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKGVycm9yLmVycm9yICYmIGVycm9yLmVycm9yLmVycm9yX2Rlc2NyaXB0aW9uKSA/IGBzZXNzaW9uIGV4cGlyZWQgKCR7ZXJyb3IuZXJyb3IuZXJyb3JfZGVzY3JpcHRpb259KWAgOiAnc2Vzc2lvbiBleHBpcmVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgcHJpdmF0ZSBwYXVzZVRhc2soY29udGludWF0aW9uOiAoKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICAgICAgaWYgKCF0aGlzLnRhc2tQYXVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMudGFza1BhdXNlciA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy50YXNrUGF1c2VyLnBpcGUoc3dpdGNoTWFwKGNvbnRpbnVlT3AgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRpbnVlT3AgPyBjb250aW51YXRpb24oKSA6IHRocm93RXJyb3IoJ3Nlc3Npb24gZXhwaXJlZCcpO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHJlc3VtZVRhc2tzKGNvbnRpbnVlT3A6IGJvb2xlYW4pIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy50YXNrUGF1c2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrUGF1c2VyLm5leHQoY29udGludWVPcCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrUGF1c2VyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrUGF1c2VyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19