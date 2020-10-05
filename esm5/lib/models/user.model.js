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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL21vZGVscy91c2VyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdDQUFnQztBQUNoQyw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLGdDQUFnQztBQUVoQztJQUNJLDBIQUEwSDtJQUMxSCxjQUFZLEVBQVcsRUFBRSxRQUFpQixFQUFFLFFBQWlCLEVBQUUsS0FBYyxFQUFFLFFBQWlCLEVBQUUsV0FBb0IsRUFBRSxLQUFnQjtRQUVwSSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFHRCxzQkFBSSw4QkFBWTthQUFoQjtZQUNJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUUxQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2YsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQzthQUNyQztZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBWUwsV0FBQztBQUFELENBQUMsQUFsQ0QsSUFrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRW1haWw6IGluZm9AZWJlbm1vbm5leS5jb21cbi8vIHd3dy5lYmVubW9ubmV5LmNvbS90ZW1wbGF0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBjbGFzcyBVc2VyIHtcbiAgICAvLyBOb3RlOiBVc2luZyBvbmx5IG9wdGlvbmFsIGNvbnN0cnVjdG9yIHByb3BlcnRpZXMgd2l0aG91dCBiYWNraW5nIHN0b3JlIGRpc2FibGVzIHR5cGVzY3JpcHQncyB0eXBlIGNoZWNraW5nIGZvciB0aGUgdHlwZVxuICAgIGNvbnN0cnVjdG9yKGlkPzogc3RyaW5nLCB1c2VyTmFtZT86IHN0cmluZywgZnVsbE5hbWU/OiBzdHJpbmcsIGVtYWlsPzogc3RyaW5nLCBqb2JUaXRsZT86IHN0cmluZywgcGhvbmVOdW1iZXI/OiBzdHJpbmcsIHJvbGVzPzogc3RyaW5nW10pIHtcblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMudXNlck5hbWUgPSB1c2VyTmFtZTtcbiAgICAgICAgdGhpcy5mdWxsTmFtZSA9IGZ1bGxOYW1lO1xuICAgICAgICB0aGlzLmVtYWlsID0gZW1haWw7XG4gICAgICAgIHRoaXMuam9iVGl0bGUgPSBqb2JUaXRsZTtcbiAgICAgICAgdGhpcy5waG9uZU51bWJlciA9IHBob25lTnVtYmVyO1xuICAgICAgICB0aGlzLnJvbGVzID0gcm9sZXM7XG4gICAgfVxuXG5cbiAgICBnZXQgZnJpZW5kbHlOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIGxldCBuYW1lID0gdGhpcy5mdWxsTmFtZSB8fCB0aGlzLnVzZXJOYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmpvYlRpdGxlKSB7XG4gICAgICAgICAgICBuYW1lID0gdGhpcy5qb2JUaXRsZSArICcgJyArIG5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBpZDogc3RyaW5nO1xuICAgIHB1YmxpYyB1c2VyTmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBmdWxsTmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBlbWFpbDogc3RyaW5nO1xuICAgIHB1YmxpYyBqb2JUaXRsZTogc3RyaW5nO1xuICAgIHB1YmxpYyBwaG9uZU51bWJlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBpc0VuYWJsZWQ6IGJvb2xlYW47XG4gICAgcHVibGljIGlzTG9ja2VkT3V0OiBib29sZWFuO1xuICAgIHB1YmxpYyByb2xlczogc3RyaW5nW107XG59XG4iXX0=