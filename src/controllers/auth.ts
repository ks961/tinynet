import { iLoggedInClient } from "../models/clientsLoggedIn";

class Auth {

    public generateUniqueCookieForUser(client: iLoggedInClient): string {
        return 'testcookie';
    }

    public isSessionVaid(cookie: string) {

    }
};

export default new Auth();