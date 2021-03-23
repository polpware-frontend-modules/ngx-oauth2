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
        get: function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL21vZGVscy91c2VyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksMEhBQTBIO0lBQzFILGNBQVksRUFBVyxFQUNuQixRQUFpQixFQUNqQixRQUFpQixFQUNqQixLQUFjLEVBQ2QsUUFBaUIsRUFDakIsV0FBb0IsRUFDcEIsS0FBZ0I7UUFFaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBR0Qsc0JBQUksOEJBQVk7YUFBaEI7WUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7WUFFMUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7YUFDckM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQVlMLFdBQUM7QUFBRCxDQUFDLEFBeENELElBd0NDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFVzZXIge1xuICAgIC8vIE5vdGU6IFVzaW5nIG9ubHkgb3B0aW9uYWwgY29uc3RydWN0b3IgcHJvcGVydGllcyB3aXRob3V0IGJhY2tpbmcgc3RvcmUgZGlzYWJsZXMgdHlwZXNjcmlwdCdzIHR5cGUgY2hlY2tpbmcgZm9yIHRoZSB0eXBlXG4gICAgY29uc3RydWN0b3IoaWQ/OiBzdHJpbmcsXG4gICAgICAgIHVzZXJOYW1lPzogc3RyaW5nLFxuICAgICAgICBmdWxsTmFtZT86IHN0cmluZyxcbiAgICAgICAgZW1haWw/OiBzdHJpbmcsXG4gICAgICAgIGpvYlRpdGxlPzogc3RyaW5nLFxuICAgICAgICBwaG9uZU51bWJlcj86IHN0cmluZyxcbiAgICAgICAgcm9sZXM/OiBzdHJpbmdbXSkge1xuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy51c2VyTmFtZSA9IHVzZXJOYW1lO1xuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gZnVsbE5hbWU7XG4gICAgICAgIHRoaXMuZW1haWwgPSBlbWFpbDtcbiAgICAgICAgdGhpcy5qb2JUaXRsZSA9IGpvYlRpdGxlO1xuICAgICAgICB0aGlzLnBob25lTnVtYmVyID0gcGhvbmVOdW1iZXI7XG4gICAgICAgIHRoaXMucm9sZXMgPSByb2xlcztcbiAgICB9XG5cblxuICAgIGdldCBmcmllbmRseU5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmZ1bGxOYW1lIHx8IHRoaXMudXNlck5hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMuam9iVGl0bGUpIHtcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLmpvYlRpdGxlICsgJyAnICsgbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuXG4gICAgcHVibGljIGlkOiBzdHJpbmc7XG4gICAgcHVibGljIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGZ1bGxOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGVtYWlsOiBzdHJpbmc7XG4gICAgcHVibGljIGpvYlRpdGxlOiBzdHJpbmc7XG4gICAgcHVibGljIHBob25lTnVtYmVyOiBzdHJpbmc7XG4gICAgcHVibGljIGlzRW5hYmxlZDogYm9vbGVhbjtcbiAgICBwdWJsaWMgaXNMb2NrZWRPdXQ6IGJvb2xlYW47XG4gICAgcHVibGljIHJvbGVzOiBzdHJpbmdbXTtcbn1cbiJdfQ==