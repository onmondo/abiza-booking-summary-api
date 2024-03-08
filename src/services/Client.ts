import { Visitor } from "../interface/Visitor";

export default abstract class Client {
    public abstract accept(visitor: Visitor): void
}