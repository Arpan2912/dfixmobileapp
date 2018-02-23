export default class Validation {
    static emailValidator(email) {
        if (email && email.trim().length > 5) {
            return null;
        } else {
            return { error: true, errorMsg: 'Email is not valid' }
        }
    }

    static noWhiteSpaceAllowed(text) {
        if (text && text.trim().length > 0) {
            return null;
        } else {
            return { error: true, errorMsg: 'Only Space Not Allowed' }
        }
    }

    static passwordValidator(pas1, pas2) {
        if (pas1 && pas2 && pas1 === pas2) {
            return null;
        } else {
            return { error: true, errorMsg: 'Password Not Match' };
        }
    }

    static numberValidation(text) {
        if (text) {
            return null;
        } else {
            return { error: true, errorMsg: 'only numbers are valid' };
        }
    }

}