export class ChangePasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;

    constructor(oldPassword: string = '', newPassword: string = '', confirmNewPassword: string = '') {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.confirmNewPassword = confirmNewPassword;
    }
}
