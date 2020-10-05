import * as i0 from "@angular/core";
export declare class JwtHelper {
    urlBase64Decode(str: string): string;
    private b64DecodeUnicode;
    decodeToken(token: string): any;
    getTokenExpirationDate(token: string): Date;
    isTokenExpired(token: string, offsetSeconds?: number): boolean;
    static ɵfac: i0.ɵɵFactoryDef<JwtHelper, never>;
    static ɵprov: i0.ɵɵInjectableDef<JwtHelper>;
}
