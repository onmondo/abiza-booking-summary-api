import Guest from "../services/Guest";

export interface Visitor {
    visitGuest(guest: Guest): void;
}