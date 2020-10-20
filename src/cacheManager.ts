import { user } from "./user";
import { card } from "./card";


export class cacheManager {

    private userCollection: Map<string, user>;
    private cardCollection: Map<string, card>;


    //
    //  Constructor and Initialization
    //

    constructor() {

    }






    //
    //  User Methods
    //

    public userExists(uuid: string): boolean {
        // TODO
        return false;
    }

    public getUser(uuid: string): user {
        // TODO
        return null;
    }

    public addUser(userToAdd: user): void {
        // TODO
    }

    public removeUser(uuid: string): void {
        // TODO
    }






    //
    //  Card Methods
    //

    public cardExists(cardID: string): boolean {
        // TODO
        return false;
    }

    public getCard(cardID: string): card {
        // TODO
        return null;
    }

    public addCard(cardToAdd: card): void {
        // TODO
    }

    public removeCard(cardID: string): void {
        // TODO
    }
}