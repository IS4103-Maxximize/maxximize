export class UsernameAlreadyExistsException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UsernameAlreadyExistsException";
    }
}