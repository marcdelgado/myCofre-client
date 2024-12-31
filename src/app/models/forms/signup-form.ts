export class SignupForm {
    name: string;
    surname: string;
    email: string;
    password: string;
    language: string;

    constructor(name: string, surname: string, email: string, password: string, language: string) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.language = language;
    }
}
