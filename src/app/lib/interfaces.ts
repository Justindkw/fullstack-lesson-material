import {Timestamp} from "@firebase/firestore";

export interface UserInterface {
    uid: string,
    displayName: string,
    photoURL: string,
    email: string,
    timestamp: Timestamp
}