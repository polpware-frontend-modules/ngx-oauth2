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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwb2xwd2FyZS9uZ3gtb2F1dGgyLyIsInNvdXJjZXMiOlsibGliL21vZGVscy91c2VyLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxJQUFJO0lBQ2IsMEhBQTBIO0lBQzFILFlBQVksRUFBVyxFQUNuQixRQUFpQixFQUNqQixRQUFpQixFQUNqQixLQUFjLEVBQ2QsUUFBaUIsRUFDakIsV0FBb0IsRUFDcEIsS0FBZ0I7UUFFaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBR0QsSUFBSSxZQUFZO1FBQ1osSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRTFDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDckM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBWUoiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgVXNlciB7XG4gICAgLy8gTm90ZTogVXNpbmcgb25seSBvcHRpb25hbCBjb25zdHJ1Y3RvciBwcm9wZXJ0aWVzIHdpdGhvdXQgYmFja2luZyBzdG9yZSBkaXNhYmxlcyB0eXBlc2NyaXB0J3MgdHlwZSBjaGVja2luZyBmb3IgdGhlIHR5cGVcbiAgICBjb25zdHJ1Y3RvcihpZD86IHN0cmluZyxcbiAgICAgICAgdXNlck5hbWU/OiBzdHJpbmcsXG4gICAgICAgIGZ1bGxOYW1lPzogc3RyaW5nLFxuICAgICAgICBlbWFpbD86IHN0cmluZyxcbiAgICAgICAgam9iVGl0bGU/OiBzdHJpbmcsXG4gICAgICAgIHBob25lTnVtYmVyPzogc3RyaW5nLFxuICAgICAgICByb2xlcz86IHN0cmluZ1tdKSB7XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnVzZXJOYW1lID0gdXNlck5hbWU7XG4gICAgICAgIHRoaXMuZnVsbE5hbWUgPSBmdWxsTmFtZTtcbiAgICAgICAgdGhpcy5lbWFpbCA9IGVtYWlsO1xuICAgICAgICB0aGlzLmpvYlRpdGxlID0gam9iVGl0bGU7XG4gICAgICAgIHRoaXMucGhvbmVOdW1iZXIgPSBwaG9uZU51bWJlcjtcbiAgICAgICAgdGhpcy5yb2xlcyA9IHJvbGVzO1xuICAgIH1cblxuXG4gICAgZ2V0IGZyaWVuZGx5TmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZnVsbE5hbWUgfHwgdGhpcy51c2VyTmFtZTtcblxuICAgICAgICBpZiAodGhpcy5qb2JUaXRsZSkge1xuICAgICAgICAgICAgbmFtZSA9IHRoaXMuam9iVGl0bGUgKyAnICcgKyBuYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgaWQ6IHN0cmluZztcbiAgICBwdWJsaWMgdXNlck5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgZW1haWw6IHN0cmluZztcbiAgICBwdWJsaWMgam9iVGl0bGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGhvbmVOdW1iZXI6IHN0cmluZztcbiAgICBwdWJsaWMgaXNFbmFibGVkOiBib29sZWFuO1xuICAgIHB1YmxpYyBpc0xvY2tlZE91dDogYm9vbGVhbjtcbiAgICBwdWJsaWMgcm9sZXM6IHN0cmluZ1tdO1xufVxuIl19