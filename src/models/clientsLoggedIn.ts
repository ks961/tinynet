export interface iLoggedInClient {
    username: string,
    sessionStart: number,
    cookieValue: string,
}

export const loggedInClients: iLoggedInClient[] = [
];