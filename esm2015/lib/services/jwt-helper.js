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
export class JwtHelper {
    /**
     * @param {?} str
     * @return {?}
     */
    urlBase64Decode(str) {
        /** @type {?} */
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
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
    }
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (/**
         * @param {?} c
         * @return {?}
         */
        (c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })).join(''));
    }
    /**
     * @param {?} token
     * @return {?}
     */
    decodeToken(token) {
        /** @type {?} */
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        /** @type {?} */
        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    }
    /**
     * @param {?} token
     * @return {?}
     */
    getTokenExpirationDate(token) {
        /** @type {?} */
        let decoded;
        decoded = this.decodeToken(token);
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        /** @type {?} */
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    isTokenExpired(token, offsetSeconds) {
        /** @type {?} */
        const date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
}
JwtHelper.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2p3dC1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxNQUFNLE9BQU8sU0FBUzs7Ozs7SUFFWCxlQUFlLENBQUMsR0FBVzs7WUFDMUIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1FBQ3RELFFBQVEsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkIsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFBRSxNQUFNO2FBQUU7WUFDbEIsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFBRSxNQUFNLElBQUksSUFBSSxDQUFDO2dCQUFDLE1BQU07YUFBRTtZQUNsQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUFFLE1BQU0sSUFBSSxHQUFHLENBQUM7Z0JBQUMsTUFBTTthQUFFO1lBQ2pDLE9BQU8sQ0FBQyxDQUFDO2dCQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQzthQUNoRDtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQzs7Ozs7OztJQUdPLGdCQUFnQixDQUFDLEdBQVE7UUFDN0IsT0FBTyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7OztRQUFFLENBQUMsQ0FBTSxFQUFFLEVBQUU7WUFDckUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqQixDQUFDOzs7OztJQUVNLFdBQVcsQ0FBQyxLQUFhOztjQUN0QixLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFFOUIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7U0FDNUM7O2NBRUssT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDOUM7UUFFRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7Ozs7SUFFTSxzQkFBc0IsQ0FBQyxLQUFhOztZQUNuQyxPQUFZO1FBQ2hCLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7O2NBRUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOzs7Ozs7SUFFTSxjQUFjLENBQUMsS0FBYSxFQUFFLGFBQXNCOztjQUNqRCxJQUFJLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQztRQUMvQyxhQUFhLEdBQUcsYUFBYSxJQUFJLENBQUMsQ0FBQztRQUVuQyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDZCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELGlCQUFpQjtRQUNqQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDOzs7WUE5REosVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFbWFpbDogaW5mb0BlYmVubW9ubmV5LmNvbVxuLy8gd3d3LmViZW5tb25uZXkuY29tL3RlbXBsYXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgdG8gZGVjb2RlIGFuZCBmaW5kIEpXVCBleHBpcmF0aW9uLlxuICovXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBKd3RIZWxwZXIge1xuXG4gICAgcHVibGljIHVybEJhc2U2NERlY29kZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBvdXRwdXQgPSBzdHIucmVwbGFjZSgvLS9nLCAnKycpLnJlcGxhY2UoL18vZywgJy8nKTtcbiAgICAgICAgc3dpdGNoIChvdXRwdXQubGVuZ3RoICUgNCkge1xuICAgICAgICAgICAgY2FzZSAwOiB7IGJyZWFrOyB9XG4gICAgICAgICAgICBjYXNlIDI6IHsgb3V0cHV0ICs9ICc9PSc7IGJyZWFrOyB9XG4gICAgICAgICAgICBjYXNlIDM6IHsgb3V0cHV0ICs9ICc9JzsgYnJlYWs7IH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgYmFzZTY0dXJsIHN0cmluZyEnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5iNjREZWNvZGVVbmljb2RlKG91dHB1dCk7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvQVBJL1dpbmRvd0Jhc2U2NC9CYXNlNjRfZW5jb2RpbmdfYW5kX2RlY29kaW5nI1RoZV9Vbmljb2RlX1Byb2JsZW1cbiAgICBwcml2YXRlIGI2NERlY29kZVVuaWNvZGUoc3RyOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoYXRvYihzdHIpLCAoYzogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJyUnICsgKCcwMCcgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgIH0pLmpvaW4oJycpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVjb2RlVG9rZW4odG9rZW46IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gdG9rZW4uc3BsaXQoJy4nKTtcblxuICAgICAgICBpZiAocGFydHMubGVuZ3RoICE9PSAzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pXVCBtdXN0IGhhdmUgMyBwYXJ0cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVjb2RlZCA9IHRoaXMudXJsQmFzZTY0RGVjb2RlKHBhcnRzWzFdKTtcbiAgICAgICAgaWYgKCFkZWNvZGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWNvZGUgdGhlIHRva2VuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VG9rZW5FeHBpcmF0aW9uRGF0ZSh0b2tlbjogc3RyaW5nKTogRGF0ZSB7XG4gICAgICAgIGxldCBkZWNvZGVkOiBhbnk7XG4gICAgICAgIGRlY29kZWQgPSB0aGlzLmRlY29kZVRva2VuKHRva2VuKTtcblxuICAgICAgICBpZiAoIWRlY29kZWQuaGFzT3duUHJvcGVydHkoJ2V4cCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgwKTsgLy8gVGhlIDAgaGVyZSBpcyB0aGUga2V5LCB3aGljaCBzZXRzIHRoZSBkYXRlIHRvIHRoZSBlcG9jaFxuICAgICAgICBkYXRlLnNldFVUQ1NlY29uZHMoZGVjb2RlZC5leHApO1xuXG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1Rva2VuRXhwaXJlZCh0b2tlbjogc3RyaW5nLCBvZmZzZXRTZWNvbmRzPzogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLmdldFRva2VuRXhwaXJhdGlvbkRhdGUodG9rZW4pO1xuICAgICAgICBvZmZzZXRTZWNvbmRzID0gb2Zmc2V0U2Vjb25kcyB8fCAwO1xuXG4gICAgICAgIGlmIChkYXRlID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRva2VuIGV4cGlyZWQ/XG4gICAgICAgIHJldHVybiAhKGRhdGUudmFsdWVPZigpID4gKG5ldyBEYXRlKCkudmFsdWVPZigpICsgKG9mZnNldFNlY29uZHMgKiAxMDAwKSkpO1xuICAgIH1cbn1cbiJdfQ==