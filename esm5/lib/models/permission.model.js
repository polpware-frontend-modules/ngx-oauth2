/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/permission.model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
var Permission = /** @class */ (function () {
    function Permission(name, value, groupName, description) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }
    Permission.viewUsersPermission = 'users.view';
    Permission.manageUsersPermission = 'users.manage';
    Permission.viewRolesPermission = 'roles.view';
    Permission.manageRolesPermission = 'roles.manage';
    Permission.assignRolesPermission = 'roles.assign';
    return Permission;
}());
export { Permission };
if (false) {
    /** @type {?} */
    Permission.viewUsersPermission;
    /** @type {?} */
    Permission.manageUsersPermission;
    /** @type {?} */
    Permission.viewRolesPermission;
    /** @type {?} */
    Permission.manageRolesPermission;
    /** @type {?} */
    Permission.assignRolesPermission;
    /** @type {?} */
    Permission.prototype.name;
    /** @type {?} */
    Permission.prototype.value;
    /** @type {?} */
    Permission.prototype.groupName;
    /** @type {?} */
    Permission.prototype.description;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbi5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL21vZGVscy9wZXJtaXNzaW9uLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQWFBO0lBVUksb0JBQVksSUFBc0IsRUFBRSxLQUF3QixFQUFFLFNBQWtCLEVBQUUsV0FBb0I7UUFDbEcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7SUFDbkMsQ0FBQztJQWJzQiw4QkFBbUIsR0FBcUIsWUFBWSxDQUFDO0lBQ3JELGdDQUFxQixHQUFxQixjQUFjLENBQUM7SUFFekQsOEJBQW1CLEdBQXFCLFlBQVksQ0FBQztJQUNyRCxnQ0FBcUIsR0FBcUIsY0FBYyxDQUFDO0lBQ3pELGdDQUFxQixHQUFxQixjQUFjLENBQUM7SUFjcEYsaUJBQUM7Q0FBQSxBQXJCRCxJQXFCQztTQXJCWSxVQUFVOzs7SUFFbkIsK0JBQTRFOztJQUM1RSxpQ0FBZ0Y7O0lBRWhGLCtCQUE0RTs7SUFDNUUsaUNBQWdGOztJQUNoRixpQ0FBZ0Y7O0lBVWhGLDBCQUE2Qjs7SUFDN0IsMkJBQStCOztJQUMvQiwrQkFBeUI7O0lBQ3pCLGlDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFbWFpbDogaW5mb0BlYmVubW9ubmV5LmNvbVxuLy8gd3d3LmViZW5tb25uZXkuY29tL3RlbXBsYXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IHR5cGUgUGVybWlzc2lvbk5hbWVzID1cbiAgICAnVmlldyBVc2VycycgfCAnTWFuYWdlIFVzZXJzJyB8XG4gICAgJ1ZpZXcgUm9sZXMnIHwgJ01hbmFnZSBSb2xlcycgfCAnQXNzaWduIFJvbGVzJztcblxuZXhwb3J0IHR5cGUgUGVybWlzc2lvblZhbHVlcyA9XG4gICAgJ3VzZXJzLnZpZXcnIHwgJ3VzZXJzLm1hbmFnZScgfFxuICAgICdyb2xlcy52aWV3JyB8ICdyb2xlcy5tYW5hZ2UnIHwgJ3JvbGVzLmFzc2lnbic7XG5cbmV4cG9ydCBjbGFzcyBQZXJtaXNzaW9uIHtcblxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgdmlld1VzZXJzUGVybWlzc2lvbjogUGVybWlzc2lvblZhbHVlcyA9ICd1c2Vycy52aWV3JztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IG1hbmFnZVVzZXJzUGVybWlzc2lvbjogUGVybWlzc2lvblZhbHVlcyA9ICd1c2Vycy5tYW5hZ2UnO1xuXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSB2aWV3Um9sZXNQZXJtaXNzaW9uOiBQZXJtaXNzaW9uVmFsdWVzID0gJ3JvbGVzLnZpZXcnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgbWFuYWdlUm9sZXNQZXJtaXNzaW9uOiBQZXJtaXNzaW9uVmFsdWVzID0gJ3JvbGVzLm1hbmFnZSc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBhc3NpZ25Sb2xlc1Blcm1pc3Npb246IFBlcm1pc3Npb25WYWx1ZXMgPSAncm9sZXMuYXNzaWduJztcblxuXG4gICAgY29uc3RydWN0b3IobmFtZT86IFBlcm1pc3Npb25OYW1lcywgdmFsdWU/OiBQZXJtaXNzaW9uVmFsdWVzLCBncm91cE5hbWU/OiBzdHJpbmcsIGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5ncm91cE5hbWUgPSBncm91cE5hbWU7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmFtZTogUGVybWlzc2lvbk5hbWVzO1xuICAgIHB1YmxpYyB2YWx1ZTogUGVybWlzc2lvblZhbHVlcztcbiAgICBwdWJsaWMgZ3JvdXBOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG59XG4iXX0=