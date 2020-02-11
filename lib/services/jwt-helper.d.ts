export declare class JwtHelper {
    urlBase64Decode(str: string): string;
    private b64DecodeUnicode;
    decodeToken(token: string): any;
    getTokenExpirationDate(token: string): Date;
    isTokenExpired(token: string, offsetSeconds?: number): boolean;
}
