import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
export declare class EndpointBase {
    protected http: HttpClient;
    private authService;
    private taskPauser;
    private isRefreshingLogin;
    constructor(http: HttpClient, authService: AuthService);
    protected get requestHeaders(): {
        headers: HttpHeaders | {
            [header: string]: string | string[];
        };
    };
    refreshLogin(): any;
    protected handleError(error: any, continuation: () => Observable<any>): Observable<any>;
    private pauseTask;
    private resumeTasks;
}
