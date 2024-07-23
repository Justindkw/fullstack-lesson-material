import {Timestamp} from "@firebase/firestore";

export interface MessageInterface {
    text: string,
    timestamp: Timestamp
}

export interface UserInterface {
    uid: string,
    displayName: string,
    photoURL: string,
    email: string,
    friends: string[]
}

export interface RequestInterface {
    senderID: string,
    senderDisplayName: string,
    receiverID: string,
    receiverDisplayName: string,
}