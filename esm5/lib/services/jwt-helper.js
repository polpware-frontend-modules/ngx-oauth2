/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/jwt-helper.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
/**
 * Helper class to decode and find JWT expiration.
 */
import { Injectable } from '@angular/core';
var JwtHelper = /** @class */ (function () {
    function JwtHelper() {
    }
    /**
     * @param {?} str
     * @return {?}
     */
    JwtHelper.prototype.urlBase64Decode = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        /** @type {?} */
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return this.b64DecodeUnicode(output);
    };
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    JwtHelper.prototype.b64DecodeUnicode = 
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (/**
         * @param {?} c
         * @return {?}
         */
        function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })).join(''));
    };
    /**
     * @param {?} token
     * @return {?}
     */
    JwtHelper.prototype.decodeToken = /**
     * @param {?} token
     * @return {?}
     */
    function (token) {
        /** @type {?} */
        var parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        /** @type {?} */
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    };
    /**
     * @param {?} token
     * @return {?}
     */
    JwtHelper.prototype.getTokenExpirationDate = /**
     * @param {?} token
     * @return {?}
     */
    function (token) {
        /** @type {?} */
        var decoded;
        decoded = this.decodeToken(token);
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        /** @type {?} */
        var date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    };
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    JwtHelper.prototype.isTokenExpired = /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    function (token, offsetSeconds) {
        /** @type {?} */
        var date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
    JwtHelper.decorators = [
        { type: Injectable }
    ];
    return JwtHelper;
}());
export { JwtHelper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2p3dC1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQztJQUFBO0lBK0RBLENBQUM7Ozs7O0lBNURVLG1DQUFlOzs7O0lBQXRCLFVBQXVCLEdBQVc7O1lBQzFCLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztRQUN0RCxRQUFRLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQUUsTUFBTTthQUFFO1lBQ2xCLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQUUsTUFBTSxJQUFJLElBQUksQ0FBQztnQkFBQyxNQUFNO2FBQUU7WUFDbEMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFBRSxNQUFNLElBQUksR0FBRyxDQUFDO2dCQUFDLE1BQU07YUFBRTtZQUNqQyxPQUFPLENBQUMsQ0FBQztnQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7YUFDaEQ7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCw4R0FBOEc7Ozs7Ozs7SUFDdEcsb0NBQWdCOzs7Ozs7O0lBQXhCLFVBQXlCLEdBQVE7UUFDN0IsT0FBTyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7OztRQUFFLFVBQUMsQ0FBTTtZQUNqRSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7Ozs7O0lBRU0sK0JBQVc7Ozs7SUFBbEIsVUFBbUIsS0FBYTs7WUFDdEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBRTlCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzVDOztZQUVLLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzlDO1FBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7Ozs7O0lBRU0sMENBQXNCOzs7O0lBQTdCLFVBQThCLEtBQWE7O1lBQ25DLE9BQVk7UUFDaEIsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUM7U0FDZjs7WUFFSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Ozs7OztJQUVNLGtDQUFjOzs7OztJQUFyQixVQUFzQixLQUFhLEVBQUUsYUFBc0I7O1lBQ2pELElBQUksR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDO1FBQy9DLGFBQWEsR0FBRyxhQUFhLElBQUksQ0FBQyxDQUFDO1FBRW5DLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNkLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsaUJBQWlCO1FBQ2pCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7O2dCQTlESixVQUFVOztJQStEWCxnQkFBQztDQUFBLEFBL0RELElBK0RDO1NBOURZLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRW1haWw6IGluZm9AZWJlbm1vbm5leS5jb21cbi8vIHd3dy5lYmVubW9ubmV5LmNvbS90ZW1wbGF0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIHRvIGRlY29kZSBhbmQgZmluZCBKV1QgZXhwaXJhdGlvbi5cbiAqL1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnd0SGVscGVyIHtcblxuICAgIHB1YmxpYyB1cmxCYXNlNjREZWNvZGUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgb3V0cHV0ID0gc3RyLnJlcGxhY2UoLy0vZywgJysnKS5yZXBsYWNlKC9fL2csICcvJyk7XG4gICAgICAgIHN3aXRjaCAob3V0cHV0Lmxlbmd0aCAlIDQpIHtcbiAgICAgICAgICAgIGNhc2UgMDogeyBicmVhazsgfVxuICAgICAgICAgICAgY2FzZSAyOiB7IG91dHB1dCArPSAnPT0nOyBicmVhazsgfVxuICAgICAgICAgICAgY2FzZSAzOiB7IG91dHB1dCArPSAnPSc7IGJyZWFrOyB9XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGJhc2U2NHVybCBzdHJpbmchJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYjY0RGVjb2RlVW5pY29kZShvdXRwdXQpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2RvY3MvV2ViL0FQSS9XaW5kb3dCYXNlNjQvQmFzZTY0X2VuY29kaW5nX2FuZF9kZWNvZGluZyNUaGVfVW5pY29kZV9Qcm9ibGVtXG4gICAgcHJpdmF0ZSBiNjREZWNvZGVVbmljb2RlKHN0cjogYW55KSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGF0b2Ioc3RyKSwgKGM6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICclJyArICgnMDAnICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuICAgICAgICB9KS5qb2luKCcnKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlY29kZVRva2VuKHRva2VuOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHRva2VuLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdKV1QgbXVzdCBoYXZlIDMgcGFydHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRlY29kZWQgPSB0aGlzLnVybEJhc2U2NERlY29kZShwYXJ0c1sxXSk7XG4gICAgICAgIGlmICghZGVjb2RlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGVjb2RlIHRoZSB0b2tlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGVjb2RlZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRva2VuRXhwaXJhdGlvbkRhdGUodG9rZW46IHN0cmluZyk6IERhdGUge1xuICAgICAgICBsZXQgZGVjb2RlZDogYW55O1xuICAgICAgICBkZWNvZGVkID0gdGhpcy5kZWNvZGVUb2tlbih0b2tlbik7XG5cbiAgICAgICAgaWYgKCFkZWNvZGVkLmhhc093blByb3BlcnR5KCdleHAnKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoMCk7IC8vIFRoZSAwIGhlcmUgaXMgdGhlIGtleSwgd2hpY2ggc2V0cyB0aGUgZGF0ZSB0byB0aGUgZXBvY2hcbiAgICAgICAgZGF0ZS5zZXRVVENTZWNvbmRzKGRlY29kZWQuZXhwKTtcblxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUb2tlbkV4cGlyZWQodG9rZW46IHN0cmluZywgb2Zmc2V0U2Vjb25kcz86IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5nZXRUb2tlbkV4cGlyYXRpb25EYXRlKHRva2VuKTtcbiAgICAgICAgb2Zmc2V0U2Vjb25kcyA9IG9mZnNldFNlY29uZHMgfHwgMDtcblxuICAgICAgICBpZiAoZGF0ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUb2tlbiBleHBpcmVkP1xuICAgICAgICByZXR1cm4gIShkYXRlLnZhbHVlT2YoKSA+IChuZXcgRGF0ZSgpLnZhbHVlT2YoKSArIChvZmZzZXRTZWNvbmRzICogMTAwMCkpKTtcbiAgICB9XG59XG4iXX0=