// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================
export class User {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(id, userName, fullName, email, jobTitle, phoneNumber, roles) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }
    get friendlyName() {
        let name = this.fullName || this.userName;
        if (this.jobTitle) {
            name = this.jobTitle + ' ' + name;
        }
        return name;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL21vZGVscy91c2VyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQUNoQyw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLGdDQUFnQztBQUVoQyxNQUFNLE9BQU8sSUFBSTtJQUNiLDBIQUEwSDtJQUMxSCxZQUFZLEVBQVcsRUFBRSxRQUFpQixFQUFFLFFBQWlCLEVBQUUsS0FBYyxFQUFFLFFBQWlCLEVBQUUsV0FBb0IsRUFBRSxLQUFnQjtRQUVwSSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFHRCxJQUFJLFlBQVk7UUFDWixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFMUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztTQUNyQztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FZSiIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFbWFpbDogaW5mb0BlYmVubW9ubmV5LmNvbVxuLy8gd3d3LmViZW5tb25uZXkuY29tL3RlbXBsYXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IGNsYXNzIFVzZXIge1xuICAgIC8vIE5vdGU6IFVzaW5nIG9ubHkgb3B0aW9uYWwgY29uc3RydWN0b3IgcHJvcGVydGllcyB3aXRob3V0IGJhY2tpbmcgc3RvcmUgZGlzYWJsZXMgdHlwZXNjcmlwdCdzIHR5cGUgY2hlY2tpbmcgZm9yIHRoZSB0eXBlXG4gICAgY29uc3RydWN0b3IoaWQ/OiBzdHJpbmcsIHVzZXJOYW1lPzogc3RyaW5nLCBmdWxsTmFtZT86IHN0cmluZywgZW1haWw/OiBzdHJpbmcsIGpvYlRpdGxlPzogc3RyaW5nLCBwaG9uZU51bWJlcj86IHN0cmluZywgcm9sZXM/OiBzdHJpbmdbXSkge1xuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy51c2VyTmFtZSA9IHVzZXJOYW1lO1xuICAgICAgICB0aGlzLmZ1bGxOYW1lID0gZnVsbE5hbWU7XG4gICAgICAgIHRoaXMuZW1haWwgPSBlbWFpbDtcbiAgICAgICAgdGhpcy5qb2JUaXRsZSA9IGpvYlRpdGxlO1xuICAgICAgICB0aGlzLnBob25lTnVtYmVyID0gcGhvbmVOdW1iZXI7XG4gICAgICAgIHRoaXMucm9sZXMgPSByb2xlcztcbiAgICB9XG5cblxuICAgIGdldCBmcmllbmRseU5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmZ1bGxOYW1lIHx8IHRoaXMudXNlck5hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMuam9iVGl0bGUpIHtcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLmpvYlRpdGxlICsgJyAnICsgbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuXG4gICAgcHVibGljIGlkOiBzdHJpbmc7XG4gICAgcHVibGljIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGZ1bGxOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGVtYWlsOiBzdHJpbmc7XG4gICAgcHVibGljIGpvYlRpdGxlOiBzdHJpbmc7XG4gICAgcHVibGljIHBob25lTnVtYmVyOiBzdHJpbmc7XG4gICAgcHVibGljIGlzRW5hYmxlZDogYm9vbGVhbjtcbiAgICBwdWJsaWMgaXNMb2NrZWRPdXQ6IGJvb2xlYW47XG4gICAgcHVibGljIHJvbGVzOiBzdHJpbmdbXTtcbn1cbiJdfQ==