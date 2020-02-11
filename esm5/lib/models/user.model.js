/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/user.model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
var User = /** @class */ (function () {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    function User(id, userName, fullName, email, jobTitle, phoneNumber, roles) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }
    Object.defineProperty(User.prototype, "friendlyName", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var name = this.fullName || this.userName;
            if (this.jobTitle) {
                name = this.jobTitle + ' ' + name;
            }
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());
export { User };
if (false) {
    /** @type {?} */
    User.prototype.id;
    /** @type {?} */
    User.prototype.userName;
    /** @type {?} */
    User.prototype.fullName;
    /** @type {?} */
    User.prototype.email;
    /** @type {?} */
    User.prototype.jobTitle;
    /** @type {?} */
    User.prototype.phoneNumber;
    /** @type {?} */
    User.prototype.isEnabled;
    /** @type {?} */
    User.prototype.isLockedOut;
    /** @type {?} */
    User.prototype.roles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL21vZGVscy91c2VyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBO0lBQ0ksMEhBQTBIO0lBQzFILGNBQVksRUFBVyxFQUFFLFFBQWlCLEVBQUUsUUFBaUIsRUFBRSxLQUFjLEVBQUUsUUFBaUIsRUFBRSxXQUFvQixFQUFFLEtBQWdCO1FBRXBJLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUdELHNCQUFJLDhCQUFZOzs7O1FBQWhCOztnQkFDUSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUTtZQUV6QyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2YsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQzthQUNyQztZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBWUwsV0FBQztBQUFELENBQUMsQUFsQ0QsSUFrQ0M7Ozs7SUFURyxrQkFBa0I7O0lBQ2xCLHdCQUF3Qjs7SUFDeEIsd0JBQXdCOztJQUN4QixxQkFBcUI7O0lBQ3JCLHdCQUF3Qjs7SUFDeEIsMkJBQTJCOztJQUMzQix5QkFBMEI7O0lBQzFCLDJCQUE0Qjs7SUFDNUIscUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVtYWlsOiBpbmZvQGViZW5tb25uZXkuY29tXG4vLyB3d3cuZWJlbm1vbm5leS5jb20vdGVtcGxhdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgY2xhc3MgVXNlciB7XG4gICAgLy8gTm90ZTogVXNpbmcgb25seSBvcHRpb25hbCBjb25zdHJ1Y3RvciBwcm9wZXJ0aWVzIHdpdGhvdXQgYmFja2luZyBzdG9yZSBkaXNhYmxlcyB0eXBlc2NyaXB0J3MgdHlwZSBjaGVja2luZyBmb3IgdGhlIHR5cGVcbiAgICBjb25zdHJ1Y3RvcihpZD86IHN0cmluZywgdXNlck5hbWU/OiBzdHJpbmcsIGZ1bGxOYW1lPzogc3RyaW5nLCBlbWFpbD86IHN0cmluZywgam9iVGl0bGU/OiBzdHJpbmcsIHBob25lTnVtYmVyPzogc3RyaW5nLCByb2xlcz86IHN0cmluZ1tdKSB7XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnVzZXJOYW1lID0gdXNlck5hbWU7XG4gICAgICAgIHRoaXMuZnVsbE5hbWUgPSBmdWxsTmFtZTtcbiAgICAgICAgdGhpcy5lbWFpbCA9IGVtYWlsO1xuICAgICAgICB0aGlzLmpvYlRpdGxlID0gam9iVGl0bGU7XG4gICAgICAgIHRoaXMucGhvbmVOdW1iZXIgPSBwaG9uZU51bWJlcjtcbiAgICAgICAgdGhpcy5yb2xlcyA9IHJvbGVzO1xuICAgIH1cblxuXG4gICAgZ2V0IGZyaWVuZGx5TmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZnVsbE5hbWUgfHwgdGhpcy51c2VyTmFtZTtcblxuICAgICAgICBpZiAodGhpcy5qb2JUaXRsZSkge1xuICAgICAgICAgICAgbmFtZSA9IHRoaXMuam9iVGl0bGUgKyAnICcgKyBuYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgaWQ6IHN0cmluZztcbiAgICBwdWJsaWMgdXNlck5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgZW1haWw6IHN0cmluZztcbiAgICBwdWJsaWMgam9iVGl0bGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGhvbmVOdW1iZXI6IHN0cmluZztcbiAgICBwdWJsaWMgaXNFbmFibGVkOiBib29sZWFuO1xuICAgIHB1YmxpYyBpc0xvY2tlZE91dDogYm9vbGVhbjtcbiAgICBwdWJsaWMgcm9sZXM6IHN0cmluZ1tdO1xufVxuIl19